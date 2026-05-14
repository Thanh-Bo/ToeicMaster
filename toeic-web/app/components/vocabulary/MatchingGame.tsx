"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, Clock, Star, Flame, BookOpen, Gamepad2, Library, PenTool, SkipForward } from 'lucide-react';
import { VocabWord } from '@/app/types';

const BATCH_SIZE = 6;

interface AudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

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

interface Props {
  words: VocabWord[];
  onComplete: () => void;
  onSkip?: () => void;
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
    const AudioContextConstructor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AudioContextConstructor) return;

    const audioContext = new AudioContextConstructor();
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

export default function MatchingGame({ words, onComplete, onSkip }: Props) {
  const [enCards, setEnCards] = useState<EnglishCard[]>([]);
  const [viCards, setViCards] = useState<VietnameseCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<{side: 'en'|'vi', index: number}[]>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBatchSize, setCurrentBatchSize] = useState(BATCH_SIZE);
  const totalBatches = useMemo(() => Math.ceil(words.length / BATCH_SIZE), [words.length]);

  const initializeBatch = useCallback((batchIndex: number, sourceWords: VocabWord[]) => {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, sourceWords.length);
    const batchWords = sourceWords.slice(start, end);
    const batchSize = batchWords.length;

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
    setCurrentBatchSize(batchSize);
  }, []);

  useEffect(() => {
    // The matching board needs local shuffled card state whenever the word set changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initializeBatch(0, words);
  }, [initializeBatch, words]);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleCardClick = (side: 'en'|'vi', index: number) => {
    // Prevent spam clicking during animation
    if (isProcessing) return;

    const cardsArray = side === 'en' ? enCards : viCards;
    const card = cardsArray[index];
    if (card.status === 'matched' || card.status === 'selected') return;

    // Play audio when clicking English card
    // if (side === 'en') {
    //   const enCard = card as EnglishCard;
    //   playWordAudio(enCard.content, enCard.audioUrl);
    // }

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
    <div className="w-full h-[min(660px,calc(100vh-7rem))] min-h-[500px] flex flex-col overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm p-2.5">
        <h3 className="text-center font-bold text-lg md:text-xl text-gray-700 dark:text-white flex items-center justify-center gap-2">
          <Gamepad2 className="w-5 h-5 text-blue-500" />
          Nối từ vựng với nghĩa đúng
        </h3>
      </div>

      {/* Main Game Area - Flex Container */}
      <div className="flex gap-2.5 p-2.5 overflow-hidden mx-auto w-full max-w-4xl flex-1">
        
        {/* SIDEBAR - Stats & Controls */}
        <div className="w-40 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2.5 flex flex-col gap-2 overflow-y-auto">
          
          {/* Time - Prominent */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-900/20 p-2.5 rounded-lg text-center border border-purple-200 dark:border-purple-700">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 flex items-center justify-center gap-1.5">
              <Clock size={16} /> Thời gian
            </p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-400 mt-0.5">{Math.floor(timeElapsed/60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</p>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 p-2.5 rounded-lg text-center border border-blue-200 dark:border-blue-700">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-300 flex items-center justify-center gap-1.5">
              <Star size={16} /> Điểm
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-400 mt-0.5">{score}</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 p-2.5 rounded-lg text-center border border-amber-200 dark:border-amber-700">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 flex items-center justify-center gap-1.5">
              <Flame size={16} /> Streak
            </p>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-0.5">{streak}</p>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300 text-center flex items-center justify-center gap-1.5">
              <Check size={16} /> Tiến độ
            </p>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 text-center">{matchedCount}/{currentBatchSize}</p>
            <div className="w-full bg-emerald-200 dark:bg-emerald-700 rounded-full h-1.5 mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(matchedCount / currentBatchSize) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          {/* Batch Info */}
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-center">
            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1.5">
              Nhóm từ
            </p>
            <p className="text-lg font-bold text-gray-700 dark:text-gray-200 mt-0.5">{currentBatchIndex + 1}/{totalBatches}</p>
          </div>

          {/* Batch Navigation */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1.5 flex items-center justify-center gap-1">
              Nhóm:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {Array.from({ length: totalBatches }).map((_, bIdx) => (
                <div key={bIdx} className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-all ${
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

          {/* Skip Button */}
          {onSkip && (
            <button
              onClick={() => {
                if (confirm("Bạn có chắc chắn muốn bỏ qua phần luyện tập?")) {
                  onSkip();
                }
              }}
              className="mt-1 w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white text-sm font-bold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <SkipForward size={14} />
              Bỏ qua
            </button>
          )}
        </div>

        {/* Game Board - Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-2.5 flex-1 overflow-y-auto pr-2 text-gray-700 dark:text-gray-300">
            {/* ENGLISH SIDE - LEFT */}
            <div>
              <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 text-center flex items-center justify-center gap-1.5">
                 Tiếng Anh
              </h4>
              <div className="space-y-2">
                {enCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                  let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-700';
                  if (card.status === 'selected') bgClass = 'bg-blue-500 text-white border-blue-500 dark:border-blue-400 shadow-md scale-[1.02]';
                  if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick('en', idx)}
                      disabled={isProcessing}
                      className={`w-full min-h-14 px-2.5 py-2 rounded-lg border flex items-center justify-center font-bold text-center text-sm leading-snug transition-all duration-200 shadow-sm hover:shadow-md ${bgClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {card.content}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* VIETNAMESE SIDE - RIGHT */}
            <div>
              <h4 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2 text-center flex items-center justify-center gap-1.5">
                Tiếng Việt
              </h4>
              <div className="space-y-2">
                {viCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                  let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-700';
                  if (card.status === 'selected') bgClass = 'bg-orange-500 text-white border-orange-500 dark:border-orange-400 shadow-md scale-[1.02]';
                  if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardClick('vi', idx)}
                      disabled={isProcessing}
                      className={`w-full min-h-14 px-2.5 py-2 rounded-lg border flex items-center justify-center font-bold text-center text-sm leading-snug transition-all duration-200 shadow-sm hover:shadow-md ${bgClass} disabled:opacity-50 disabled:cursor-not-allowed`}
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
            <div className="mt-2.5 p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Check size={16} /> Đã ghép xong: {matchedCount}/{currentBatchSize}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {enCards
                  .filter(c => c.status === 'matched')
                  .map(card => {
                    const viCard = viCards.find(v => v.wordId === card.wordId);
                    return (
                      <div 
                        key={card.id} 
                        className="text-[11px] px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-300 dark:border-emerald-700"
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
