"use client";
import { useState } from 'react';

import { Volume2, RotateCw, Bookmark } from 'lucide-react';
import { VocabWord } from '@/app/types';

interface Props {
  word: VocabWord;
  onBookmark: () => void;
}

export default function Flashcard({ word, onBookmark }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Xử lý Audio (Dùng Browser Speech API nếu không có file mp3)
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
    <div className="perspective-1000 w-full max-w-md mx-auto h-[500px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 [perspective:1000px] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{transformStyle: 'preserve-3d'}}>
        
        {/* --- MẶT TRƯỚC (ENGLISH) --- */}
        <div className="absolute w-full h-full backface-hidden bg-linear-to-br from-white to-blue-50 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center p-8 gap-6">
          <div className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 text-sm flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
             <RotateCw size={14}/> Chạm để lật
          </div>
          
          <div className="text-center">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">{word.word}</h2>
            <div className="flex items-center gap-3 justify-center text-gray-600 dark:text-gray-400 mb-6 flex-wrap">
              <span className="italic font-serif text-xl">({word.type})</span>
              <span className="font-semibold">{word.pronunciation}</span>
            </div>
          </div>

          <button 
            onClick={handlePlayAudio}
            className="p-5 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
          >
            <Volume2 size={36} />
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
             Nhấp để nghe phát âm
          </div>
        </div>

        {/* --- MẶT SAU (VIETNAMESE MEANING) --- */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-linear-to-br from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-3xl shadow-2xl border-2 border-blue-200 dark:border-zinc-700 flex flex-col p-8 overflow-y-auto">
           {/* Header: Actions */}
           <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200 dark:border-zinc-700">
              <button onClick={(e) => {e.stopPropagation(); onBookmark()}} className={`p-3 rounded-full transition-all ${word.isBookmarked ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg' : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}>
                <Bookmark size={22}/>
              </button>
              <button onClick={handlePlayAudio} className="p-3 text-white bg-linear-to-br from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                <Volume2 size={22}/>
              </button>
           </div>

           {/* Nghĩa & Ảnh */}
           <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">{word.meaning}</h3>
              {word.imageUrl && (
                <img src={word.imageUrl} alt="illustration" className="h-32 mx-auto object-contain mb-4 rounded-lg" />
              )}
           </div>

           {/* Ví dụ */}
           <div className="bg-blue-50 dark:bg-zinc-800 p-5 rounded-2xl border border-blue-200 dark:border-zinc-700 mb-6">
              <p className="text-gray-800 dark:text-white font-semibold text-base mb-3">"{word.example}"</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm italic font-medium">{word.exampleTranslation}</p>
           </div>

           {/* Word Family */}
           {word.wordFamilies && word.wordFamilies.length > 0 && (
             <div className="mb-6">
               <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3"> Word Family</p>
               <div className="space-y-2.5">
                 {word.wordFamilies.map((wf: any, idx: number) => (
                   <div key={idx} className="text-sm flex gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-700/50">
                      <span className="font-bold text-blue-600 dark:text-blue-400 min-w-fit">{wf.word}</span>
                      <span className="text-gray-600 dark:text-gray-400 italic">({wf.partOfSpeech || wf.type})</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           
        </div>

      </div>
    </div>
  );
}