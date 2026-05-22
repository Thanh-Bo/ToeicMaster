"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Check, Clock, Star, Flame, BookOpen, Gamepad2, Library, SkipForward } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    if (isProcessing) return;

    const cardsArray = side === 'en' ? enCards : viCards;
    const card = cardsArray[index];
    if (card.status === 'matched' || card.status === 'selected') return;

    // Play pronunciation if clicking English card
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

    // Check match
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
          
          if (newMatched === currentBatchSize) {
            if (currentBatchIndex + 1 < totalBatches) {
              setTimeout(() => {
                setCurrentBatchIndex(prev => prev + 1);
                initializeBatch(currentBatchIndex + 1, words);
              }, 800);
            } else {
              setTimeout(() => onComplete(), 800);
            }
          }
        }, 300);
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
            setScore(prev => Math.max(0, prev - 5)); // Penalty
            setIsProcessing(false);
          }, 800);
        }, 200);
      }
    }
  };

  return (
    <div className="w-full h-[min(680px,calc(100vh-7rem))] xs:h-[min(620px,calc(100vh-6rem))] sm:h-[min(680px,calc(100vh-7rem))] min-h-[500px] xs:min-h-[420px] flex flex-col overflow-hidden rounded-2xl border border-gray-200/50 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/20 backdrop-blur-md">
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-zinc-850 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-center flex-1 font-black text-xs xs:text-sm sm:text-base md:text-lg text-gray-900 dark:text-white flex items-center justify-center gap-2">
            <Gamepad2 className="w-5 h-5 text-blue-500 flex-shrink-0 animate-bounce" />
            <span>Nối từ vựng với nghĩa đúng</span>
          </h3>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="xs:hidden flex-shrink-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all cursor-pointer"
            title="Xem chỉ số"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex gap-3 p-3 sm:p-4 overflow-hidden mx-auto w-full max-w-4xl flex-1">
        
        {/* SIDEBAR - Stats & Controls */}
        <div className={`flex-shrink-0 rounded-2xl p-3 flex flex-col gap-3 overflow-y-auto border border-gray-200/50 dark:border-zinc-850 transition-all duration-300 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md ${
          sidebarOpen ? 'w-32 xs:w-36 sm:w-44' : 'w-0 overflow-hidden p-0 border-0'
        }`}>
          
          {/* Time widget */}
          <div className="bg-purple-50/50 dark:bg-purple-950/20 p-2.5 rounded-xl text-center border border-purple-200/50 dark:border-purple-900/30">
            <p className="text-[10px] sm:text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center justify-center gap-1">
              <Clock size={12} className="text-purple-500" />
              <span>Thời gian</span>
            </p>
            <p className="text-base sm:text-lg font-black text-purple-800 dark:text-purple-300 mt-1 select-none tabular-nums">
              {Math.floor(timeElapsed/60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
            </p>
          </div>

          {/* Score widget */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl text-center border border-blue-200/50 dark:border-blue-900/30">
            <p className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1">
              <Star size={12} className="text-blue-500" />
              <span>Điểm</span>
            </p>
            <p className="text-base sm:text-lg font-black text-blue-800 dark:text-blue-300 mt-1 select-none">
              {score}
            </p>
          </div>

          {/* Streak widget */}
          <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl text-center border border-amber-200/50 dark:border-amber-900/30 relative overflow-hidden">
            <p className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
              <Flame size={12} className="text-amber-500 animate-pulse" />
              <span>Streak</span>
            </p>
            <p className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-300 mt-1 select-none">
              {streak}
            </p>
          </div>

          {/* Progress widget */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 text-center flex items-center justify-center gap-1">
              <Check size={12} className="text-emerald-500" />
              <span>Tiến độ</span>
            </p>
            <p className="text-sm sm:text-base font-black text-emerald-850 dark:text-emerald-300 mt-1 text-center">
              {matchedCount}/{currentBatchSize}
            </p>
            <div className="w-full bg-emerald-200/60 dark:bg-emerald-800/40 rounded-full h-1.5 mt-2">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-350"
                style={{ width: `${(matchedCount / currentBatchSize) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-zinc-800/80 my-1"></div>

          {/* Batch Info */}
          <div className="bg-gray-50/50 dark:bg-zinc-800/40 p-2 rounded-xl text-center border border-gray-200/30 dark:border-zinc-800/30">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
              Nhóm từ
            </p>
            <p className="text-base font-black text-gray-800 dark:text-gray-200 mt-0.5">
              {currentBatchIndex + 1}/{totalBatches}
            </p>
          </div>

          {/* Mini batch visualization */}
          <div className="flex flex-wrap gap-1 justify-center p-1 bg-gray-100/50 dark:bg-zinc-900/40 rounded-lg">
            {Array.from({ length: totalBatches }).map((_, bIdx) => (
              <div 
                key={bIdx} 
                className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center transition-all ${
                  bIdx < currentBatchIndex 
                    ? 'bg-green-500 text-white' 
                    : bIdx === currentBatchIndex 
                    ? 'bg-blue-600 text-white ring-2 ring-blue-100 dark:ring-blue-900/50' 
                    : 'bg-gray-300 dark:bg-zinc-800 text-gray-500'
                }`}
              >
                {bIdx + 1}
              </div>
            ))}
          </div>

          {/* Skip Button */}
          {onSkip && (
            <button
              onClick={() => {
                if (confirm("Bạn có chắc chắn muốn bỏ qua phần luyện tập?")) {
                  onSkip();
                }
              }}
              className="mt-auto w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <SkipForward size={12} />
              <span>Bỏ qua</span>
            </button>
          )}
        </div>

        {/* Game Board */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-1">
            {/* ENGLISH SIDE - LEFT */}
            <div className="flex flex-col overflow-hidden">
              <h4 className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 mb-2 text-center flex items-center justify-center gap-1.5">
                <BookOpen size={14} className="text-blue-500" />
                <span>Tiếng Anh</span>
              </h4>
              <div className="space-y-2.5 overflow-y-auto flex-1 pr-0.5">
                {enCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                    let styleClass = 'bg-white/80 dark:bg-zinc-900/60 text-gray-900 dark:text-zinc-200 border-gray-200/50 dark:border-zinc-800/80 hover:bg-blue-50/30 dark:hover:bg-zinc-800/80 hover:border-blue-300/40 hover:scale-[1.01]';
                    if (card.status === 'selected') {
                      styleClass = 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)] scale-[1.03]';
                    }
                    if (card.status === 'wrong') {
                      styleClass = 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-shake';
                    }

                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick('en', idx)}
                        disabled={isProcessing}
                        className={`w-full min-h-12 sm:min-h-16 px-3 py-2.5 rounded-xl border flex items-center justify-center font-bold text-center text-xs sm:text-sm leading-snug transition-all duration-200 shadow-xs ${styleClass} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        {card.content}
                      </button>
                    )
                  })}
              </div>
            </div>

            {/* VIETNAMESE SIDE - RIGHT */}
            <div className="flex flex-col overflow-hidden">
              <h4 className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400 mb-2 text-center flex items-center justify-center gap-1.5">
                <Library size={14} className="text-orange-500" />
                <span>Tiếng Việt</span>
              </h4>
              <div className="space-y-2.5 overflow-y-auto flex-1 pl-0.5">
                {viCards
                  .map((card, idx) => ({ card, idx }))
                  .filter(({ card }) => card.status !== 'matched')
                  .map(({ card, idx }) => {
                    let styleClass = 'bg-white/80 dark:bg-zinc-900/60 text-gray-900 dark:text-zinc-200 border-gray-200/50 dark:border-zinc-800/80 hover:bg-orange-50/30 dark:hover:bg-zinc-800/80 hover:border-orange-300/40 hover:scale-[1.01]';
                    if (card.status === 'selected') {
                      styleClass = 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.3)] scale-[1.03]';
                    }
                    if (card.status === 'wrong') {
                      styleClass = 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-shake';
                    }

                    return (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick('vi', idx)}
                        disabled={isProcessing}
                        className={`w-full min-h-12 sm:min-h-16 px-3 py-2.5 rounded-xl border flex items-center justify-center font-bold text-center text-xs sm:text-sm leading-snug transition-all duration-200 shadow-xs ${styleClass} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
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
            <div className="mt-3 p-3 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xs rounded-xl shadow-xs border border-gray-200/50 dark:border-zinc-850 flex-shrink-0">
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
                <Check size={14} className="text-green-500" /> 
                <span>Đã ghép đúng ({matchedCount}/{currentBatchSize})</span>
              </p>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-1">
                {enCards
                  .filter(c => c.status === 'matched')
                  .map(card => {
                    const viCard = viCards.find(v => v.wordId === card.wordId);
                    return (
                      <div 
                        key={card.id} 
                        className="text-[10px] font-bold px-2.5 py-1 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200/30 dark:border-green-800/30 flex items-center gap-1.5 select-none"
                      >
                        <span className="text-gray-900 dark:text-white">{card.content}</span>
                        <span className="text-green-500 font-black">→</span>
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
