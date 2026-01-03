"use client";
import { useState } from 'react';

import { Volume2, RotateCw, Bookmark } from 'lucide-react';

interface Props {
  word: VocabWord;
  onStatusChange: (status: 'LEARNING' | 'MASTERED') => void;
  onBookmark: () => void;
}

export default function Flashcard({ word, onStatusChange, onBookmark }: Props) {
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
    <div className="perspective-1000 w-full max-w-md mx-auto h-[450px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* --- MẶT TRƯỚC --- */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center justify-center p-8">
          <div className="absolute top-4 right-4 text-gray-400 text-sm flex items-center gap-1">
             <RotateCw size={14}/> Chạm để lật
          </div>
          
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{word.word}</h2>
          <div className="flex items-center gap-3 text-gray-500 mb-6">
            <span className="italic font-serif text-lg">({word.type})</span>
            <span>{word.pronunciation}</span>
          </div>

          <button 
            onClick={handlePlayAudio}
            className="p-4 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition shadow-sm"
          >
            <Volume2 size={32} />
          </button>
        </div>

        {/* --- MẶT SAU --- */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl border border-blue-100 flex flex-col p-6 overflow-y-auto">
           {/* Header: Actions */}
           <div className="flex justify-between items-center mb-4">
              <button onClick={(e) => {e.stopPropagation(); onBookmark()}} className={`p-2 rounded-full ${word.isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 bg-gray-100'}`}>
                <Bookmark size={20}/>
              </button>
              <button onClick={handlePlayAudio} className="p-2 text-blue-600 bg-blue-50 rounded-full">
                <Volume2 size={20}/>
              </button>
           </div>

           {/* Nghĩa & Ảnh */}
           <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">{word.meaning}</h3>
              {word.imageUrl && (
                <img src={word.imageUrl} alt="illustration" className="h-24 mx-auto object-contain mb-2" />
              )}
           </div>

           {/* Ví dụ */}
           <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
              <p className="text-gray-800 font-medium text-sm mb-1">"{word.exampleSentenceEn}"</p>
              <p className="text-gray-500 text-xs italic">{word.exampleSentenceVi}</p>
           </div>

           {/* Word Family */}
           {word.wordFamilies.length > 0 && (
             <div className="mb-4">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Word Family</p>
               <div className="space-y-1">
                 {word.wordFamilies.map((wf, idx) => (
                   <div key={idx} className="text-sm flex gap-2">
                      <span className="font-bold text-gray-700">{wf.word}</span>
                      <span className="text-gray-500 italic">({wf.type})</span>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* Smart Review Actions (Footer) */}
           <div className="mt-auto flex gap-2 pt-4 border-t">
              <button 
                onClick={(e) => { e.stopPropagation(); onStatusChange('LEARNING'); }}
                className="flex-1 py-2 bg-orange-100 text-orange-700 font-bold rounded-lg text-sm hover:bg-orange-200"
              >
                😓 Khó quá
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onStatusChange('MASTERED'); }}
                className="flex-1 py-2 bg-green-100 text-green-700 font-bold rounded-lg text-sm hover:bg-green-200"
              >
                😎 Đã thuộc
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}