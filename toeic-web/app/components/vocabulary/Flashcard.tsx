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
    <div className="perspective-1000 w-full max-w-sm mx-auto h-[380px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 [perspective:1000px] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`} style={{transformStyle: 'preserve-3d'}}>
        
        {/* --- MẶT TRƯỚC (ENGLISH) --- */}
        <div className="absolute w-full h-full backface-hidden bg-linear-to-br from-white to-blue-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-zinc-700 flex flex-col items-center justify-center p-5 gap-4">
          <div className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 text-xs flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
             <RotateCw size={12}/> Chạm để lật
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">{word.word}</h2>
            <div className="flex items-center gap-2 justify-center text-gray-600 dark:text-gray-400 mb-4 flex-wrap text-sm">
              <span className="italic font-serif">({word.type})</span>
              <span className="font-semibold">{word.pronunciation}</span>
            </div>
          </div>

          <button 
            onClick={handlePlayAudio}
            className="p-3 bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <Volume2 size={24} />
          </button>

          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
             Nhấp để nghe phát âm
          </div>
        </div>

        {/* --- MẶT SAU (VIETNAMESE MEANING) --- */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-linear-to-br from-blue-50 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-2xl shadow-xl border-2 border-blue-200 dark:border-zinc-700 flex flex-col p-5 ">
           {/* Header: Actions */}
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-zinc-700">
              <button onClick={(e) => {e.stopPropagation(); onBookmark()}} className={`p-2 rounded-full transition-all ${word.isBookmarked ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-md' : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}>
                <Bookmark size={18}/>
              </button>
              
              {/* Master Button - Icon only */}
              <div className="flex items-center gap-2">
                {onMaster && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newState = !isMastered;
                      onMaster(newState);
                      if (newState) {
                        toast.success('Đã đánh dấu là đã nhớ!');
                      } else {
                        toast.error('Đã bỏ đánh dấu');
                      }
                    }}
                    className={`p-2 rounded-full transition-all shadow-md hover:shadow-lg ${
                      isMastered
                        ? 'text-green-500 bg-green-100 dark:bg-green-900/30'
                        : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                    title={isMastered ? 'Đã nhớ (click để bỏ)' : 'Đánh dấu đã nhớ'}
                  >
                    {isMastered ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                )}
                <button onClick={handlePlayAudio} className="p-2 text-white bg-linear-to-br from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                  <Volume2 size={18}/>
                </button>
              </div>
           </div>

           {/* Nghĩa & Ảnh */}
           <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">{word.meaning}</h3>
              {word.imageUrl && (
                <img src={word.imageUrl} alt="illustration" className="h-20 mx-auto object-contain mb-2 rounded-lg" />
              )}
           </div>

           {/* Ví dụ */}
           <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-xl border border-blue-200 dark:border-zinc-700 mb-4">
              <p className="text-gray-800 dark:text-white font-semibold text-sm mb-2">"{word.example}"</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs italic font-medium">{word.exampleTranslation}</p>
           </div>

           {/* Word Family */}
           {word.wordFamilies && word.wordFamilies.length > 0 && (
             <div className="mb-4">
               <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2"> Word Family</p>
               <div className="space-y-1.5">
                 {word.wordFamilies.map((wf: any, idx: number) => (
                   <div key={idx} className="text-xs flex gap-2 p-2 rounded-lg bg-gray-50 dark:bg-zinc-700/50">
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