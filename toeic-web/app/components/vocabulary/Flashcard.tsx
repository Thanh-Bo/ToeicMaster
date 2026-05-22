"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Volume2, RotateCw, Bookmark, CheckCircle, Circle } from 'lucide-react';
import { VocabWord } from '@/app/types';

interface Props {
  word: VocabWord;
  onBookmark: () => void;
  onMaster?: (isMastered: boolean) => void;
  isMastered?: boolean;
}

export default function Flashcard({ word, onBookmark, onMaster, isMastered }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Audio Handler
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.audioUrl) {
      new Audio(word.audioUrl).play();  
    } else {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="w-full max-w-sm mx-auto h-[340px] sm:h-[400px] cursor-pointer group" 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px", WebkitPerspective: "1000px" }}
    >
      <div 
        className="relative w-full h-full transition-transform duration-500" 
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        
        {/* --- MẶT TRƯỚC (ENGLISH) --- */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-zinc-900 shadow-xs border border-gray-200/50 dark:border-zinc-800/80 flex flex-col items-center justify-center p-5 gap-4 transition-opacity duration-300"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            opacity: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? "none" : "auto",
          }}
        >
          <div className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-gray-100/80 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full border border-gray-200/30 dark:border-zinc-800/30">
            <RotateCw size={10} className="animate-spin-slow"/> Chạm để lật
          </div>
          
          <div className="text-center mt-4">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight select-none">
              {word.word}
            </h2>
            <div className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400 mb-4 flex-wrap text-xs sm:text-sm">
              <span className="italic font-serif font-bold text-blue-600 dark:text-blue-400">({word.type})</span>
              <span className="font-semibold tracking-wide">{word.pronunciation}</span>
            </div>
          </div>

          <div className="relative group/audio">
            <div className="absolute -inset-1.5 bg-blue-500/20 rounded-full blur-xs opacity-0 group-hover/audio:opacity-100 transition-opacity animate-pulse"></div>
            <button 
              onClick={handlePlayAudio}
              className="relative p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95 cursor-pointer z-10"
            >
              <Volume2 size={24} />
            </button>
          </div>

          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-wide">
            Nhấp để nghe phát âm
          </div>
        </div>

        {/* --- MẶT SAU (VIETNAMESE MEANING) --- */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl bg-white dark:bg-zinc-900 shadow-xs border border-gray-200/50 dark:border-zinc-800/80 flex flex-col p-5 transition-opacity duration-300"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            opacity: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? "auto" : "none",
          }}
        >
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-zinc-800/80">
            <button 
              onClick={(e) => { e.stopPropagation(); onBookmark(); }} 
              className={`p-2 rounded-xl transition-all border ${
                word.isBookmarked 
                  ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200/40 dark:border-yellow-800/30' 
                  : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border-transparent'
              }`}
            >
              <Bookmark size={16} />
            </button>
            
            <div className="flex items-center gap-2">
              {onMaster && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newState = !isMastered;
                    onMaster(newState);
                    if (newState) {
                      toast.success('Đã nhớ từ vựng!');
                    } else {
                      toast.error('Đã bỏ nhớ từ vựng');
                    }
                  }}
                  className={`p-2 rounded-xl transition-all border ${
                    isMastered
                      ? 'text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200/40 dark:border-green-800/30 font-bold'
                      : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border-transparent'
                  }`}
                  title={isMastered ? 'Đã thuộc (click để bỏ)' : 'Đánh dấu đã thuộc'}
                >
                  <CheckCircle size={16} />
                </button>
              )}
              <button 
                onClick={handlePlayAudio} 
                className="p-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-xs"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {/* Meaning & Image */}
          <div className="text-center mb-4 flex-1 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {word.meaning}
            </h3>
            {word.imageUrl && (
              <div className="mt-3 overflow-hidden rounded-xl h-20 max-w-xs mx-auto">
                <img src={word.imageUrl} alt={word.word} className="h-full w-full object-contain" />
              </div>
            )}
          </div>

          {/* Example Quote Card */}
          <div className="bg-blue-50/40 dark:bg-zinc-950/20 p-3.5 rounded-xl border-l-4 border-blue-500 dark:border-blue-500/80 mb-4 text-left">
            <p className="text-gray-900 dark:text-white font-bold text-xs sm:text-sm mb-1.5 leading-relaxed">
              "{word.example}"
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-[11px] sm:text-xs font-semibold">
              {word.exampleTranslation}
            </p>
          </div>

          {/* Synonyms Tags */}
          {(() => {
            const synonyms = typeof word.synonyms === 'string' 
              ? (word.synonyms ? JSON.parse(word.synonyms) : [])
              : (word.synonyms || []);
            
            if (synonyms.length === 0) return null;
            
            return (
              <div className="text-left mb-2">
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                  Từ đồng nghĩa
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pr-1">
                  {synonyms.map((syn: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-zinc-800 flex items-center gap-1"
                    >
                      <span className="text-blue-600 dark:text-blue-400">{syn.word}</span>
                      <span className="text-gray-400 dark:text-gray-500">: {syn.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}