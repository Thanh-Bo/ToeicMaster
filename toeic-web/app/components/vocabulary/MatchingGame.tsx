"use client";
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { VocabWord } from '@/app/types';

const BATCH_SIZE = 6;

interface EnglishCard {
  id: string;
  content: string;
  type: 'EN';
  wordId: number;
  status: 'default' | 'selected' | 'matched' | 'wrong';
  audioUrl?: string;
}

interface VietnameseCard {
  id: string;
  content: string;
  type: 'VI';
  wordId: number;
  status: 'default' | 'selected' | 'matched' | 'wrong';
}

type Card = EnglishCard | VietnameseCard;

interface Props {
  words: VocabWord[];
  onComplete: () => void;
}

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Play audio for word
async function playWordAudio(word: string, audioUrl?: string) {
  try {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      await audio.play();
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  } catch (error) {
    console.log('Audio playback failed:', error);
  }
}

// Play sound effect
function playSoundEffect(type: 'match' | 'wrong') {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'match') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  } catch (error) {
    console.log('Sound effect failed:', error);
  }
}

export default function MatchingGame({ words, onComplete }: Props) {
  const [enCards, setEnCards] = useState<EnglishCard[]>([]);
  const [viCards, setViCards] = useState<VietnameseCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<{side: 'en'|'vi', index: number}[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalBatches, setTotalBatches] = useState(0);
  const [currentBatchSize, setCurrentBatchSize] = useState(BATCH_SIZE);

  useEffect(() => {
    const batches = Math.ceil(words.length / BATCH_SIZE);
    setTotalBatches(batches);
    initializeBatch(0, words);
  }, [words]);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const initializeBatch = (batchIndex: number, sourceWords: VocabWord[]) => {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, sourceWords.length);
    const batchWords = sourceWords.slice(start, end);
    const batchSize = batchWords.length; // Lưu kích thước batch thực tế

    const english: EnglishCard[] = batchWords.map(w => ({ 
      id: `en-${w.id}`, 
      content: w.word, 
      type: 'EN' as const, 
      wordId: w.id, 
      status: 'default' as const,
      audioUrl: w.audioUrl
    }));

    const vietnamese: VietnameseCard[] = shuffleArray(batchWords.map(w => ({ 
      id: `vi-${w.id}`, 
      content: w.meaning, 
      type: 'VI' as const, 
      wordId: w.id, 
      status: 'default' as const
    })));
    
    setEnCards(shuffleArray(english));
    setViCards(vietnamese);
    setSelectedCards([]);
    setMatchedCount(0);
    setCurrentBatchSize(batchSize); // Set kích thước batch hiện tại
  };

  const handleCardClick = (side: 'en'|'vi', index: number) => {
    // Prevent spam clicking during animation
    if (isProcessing) return;

    const cardsArray = side === 'en' ? enCards : viCards;
    const card = cardsArray[index];
    if (card.status === 'matched' || card.status === 'selected') return;

    // Play audio when clicking English card
    if (side === 'en') {
      const enCard = card as EnglishCard;
      playWordAudio(enCard.content, enCard.audioUrl);
    }

    // Select card
    if (side === 'en') {
      const newCards: EnglishCard[] = [...enCards];
      newCards[index].status = 'selected';
      setEnCards(newCards);
    } else {
      const newCards: VietnameseCard[] = [...viCards];
      newCards[index].status = 'selected';
      setViCards(newCards);
    }
    
    const newSelected = [...selectedCards, {side, index}];
    setSelectedCards(newSelected);

    // If 2 cards selected -> check match
    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [select1, select2] = newSelected;
      const card1 = select1.side === 'en' ? enCards[select1.index] : viCards[select1.index];
      const card2 = select2.side === 'en' ? enCards[select2.index] : viCards[select2.index];

      // Must be 1 EN + 1 VI with same wordId
      if (card1.wordId === card2.wordId && card1.type !== card2.type) {
        // MATCH!
        playSoundEffect('match');
        setTimeout(() => {
          const enMatched = [...enCards];
          const viMatched = [...viCards];
          if (select1.side === 'en') enMatched[select1.index].status = 'matched';
          else viMatched[select1.index].status = 'matched';
          if (select2.side === 'en') enMatched[select2.index].status = 'matched';
          else viMatched[select2.index].status = 'matched';
          
          setEnCards(enMatched);
          setViCards(viMatched);
          setSelectedCards([]);
          
          const newMatched = matchedCount + 1;
          setMatchedCount(newMatched);
          setScore(prev => prev + 10 * (streak + 1));
          setStreak(prev => prev + 1);
          setIsProcessing(false);
          
          // Check if batch is complete (dùng currentBatchSize thay vì BATCH_SIZE)
          if (newMatched === currentBatchSize) {
            // Batch complete -> load next batch or finish
            if (currentBatchIndex + 1 < totalBatches) {
              setTimeout(() => {
                setCurrentBatchIndex(prev => prev + 1);
                initializeBatch(currentBatchIndex + 1, words);
              }, 800);
            } else {
              // All batches complete!
              setTimeout(() => onComplete(), 800);
            }
          }
        }, 500);
      } else {
        // WRONG!
        playSoundEffect('wrong');
        setTimeout(() => {
          const enReset = [...enCards];
          const viReset = [...viCards];
          if (select1.side === 'en') enReset[select1.index].status = 'wrong';
          else viReset[select1.index].status = 'wrong';
          if (select2.side === 'en') enReset[select2.index].status = 'wrong';
          else viReset[select2.index].status = 'wrong';
          setEnCards(enReset);
          setViCards(viReset);
          
          setTimeout(() => {
            if (select1.side === 'en') enReset[select1.index].status = 'default';
            else viReset[select1.index].status = 'default';
            if (select2.side === 'en') enReset[select2.index].status = 'default';
            else viReset[select2.index].status = 'default';
            setEnCards([...enReset]);
            setViCards([...viReset]);
            setSelectedCards([]);
            setStreak(0);
            setScore(prev => Math.max(0, prev - 5)); // Penalty for wrong match
            setIsProcessing(false);
          }, 800);
        }, 500);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <h3 className="text-center font-bold text-3xl text-gray-700 dark:text-white">🎮 Nối từ vựng với nghĩa đúng</h3>
      </div>

      {/* Main Game Area - Flex Container */}
      <div className="flex-1 flex gap-3 p-3 overflow-hidden mx-auto w-full max-w-6xl">
        
        {/* SIDEBAR - Stats & Controls */}
        <div className="w-52 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 flex flex-col gap-3 overflow-y-auto">
          
          {/* Time - Prominent */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 p-4 rounded-xl text-center border border-purple-200 dark:border-purple-700">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-300">⏱️ Thời gian</p>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-400 mt-1">{Math.floor(timeElapsed/60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 p-4 rounded-xl text-center border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300">⭐ Điểm</p>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{score}</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 p-4 rounded-xl text-center border border-amber-200 dark:border-amber-700">
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">🔥 Streak</p>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-1">{streak}</p>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 text-center flex items-center justify-center gap-2"><Check size={18} /> Tiến độ</p>
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 text-center">{matchedCount}/{currentBatchSize}</p>
            <div className="w-full bg-emerald-200 dark:bg-emerald-700 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(matchedCount / currentBatchSize) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Batch Info */}
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">📚 Nhóm từ</p>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-200 mt-1">{currentBatchIndex + 1}/{totalBatches}</p>
          </div>

          {/* Batch Navigation */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Nhóm:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: totalBatches }).map((_, bIdx) => (
                <div key={bIdx} className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  bIdx < currentBatchIndex 
                    ? 'bg-green-500 text-white' 
                    : bIdx === currentBatchIndex 
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-700' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {bIdx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Board - Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-3">
            {/* ENGLISH SIDE - LEFT */}
            <div>
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 mb-3 text-center">📝 Tiếng Anh</h4>
              <div className="space-y-3">
                {enCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                  let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-700';
                  if (card.status === 'selected') bgClass = 'bg-blue-500 text-white border-blue-500 dark:border-blue-400 shadow-lg scale-105';
                  if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick('en', idx)}
                      disabled={isProcessing}
                      className={`w-full h-20 p-3 rounded-lg border-2 flex items-center justify-center font-bold text-center text-base transition-all duration-200 shadow-md hover:shadow-lg ${bgClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {card.content}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* VIETNAMESE SIDE - RIGHT */}
            <div>
              <h4 className="text-base font-bold text-orange-600 dark:text-orange-400 mb-3 text-center">📖 Tiếng Việt</h4>
              <div className="space-y-3">
                {viCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                  let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-700';
                  if (card.status === 'selected') bgClass = 'bg-orange-500 text-white border-orange-500 dark:border-orange-400 shadow-lg scale-105';
                  if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick('vi', idx)}
                      disabled={isProcessing}
                      className={`w-full h-20 p-3 rounded-lg border-2 flex items-center justify-center font-bold text-center text-base transition-all duration-200 shadow-md hover:shadow-lg ${bgClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {card.content}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Matched Cards Display */}
          {matchedCount > 0 && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Check size={16} /> Đã ghép xong: {matchedCount}/{currentBatchSize}
              </p>
              <div className="flex flex-wrap gap-2">
                {enCards
                  .filter(c => c.status === 'matched')
                  .map(card => {
                    const viCard = viCards.find(v => v.wordId === card.wordId);
                    return (
                      <div 
                        key={card.id} 
                        className="text-xs p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-300 dark:border-emerald-700"
                      >
                        <span className="font-semibold">{card.content}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 mx-1">→</span>
                        <span>{viCard?.content}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}