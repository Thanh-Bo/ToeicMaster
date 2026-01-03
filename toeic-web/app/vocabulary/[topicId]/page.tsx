"use client";
import { useState } from 'react';

import { ArrowRight, CheckCircle, BrainCircuit } from 'lucide-react';
import Flashcard from '@/app/components/vocabulary/Flashcard';
import MatchingGame from '@/app/components/vocabulary/MatchingGame';

// MOCK DATA (Thay bằng API call)
const MOCK_WORDS: VocabWord[] = [
  { 
    id: 1, word: 'Contract', type: 'n', pronunciation: '/ˈkɒntrækt/', meaning: 'Hợp đồng', 
    exampleSentenceEn: 'We signed the contract.', exampleSentenceVi: 'Chúng tôi đã ký hợp đồng.',
    status: 'NEW', isBookmarked: false, wordFamilies: []
  },
  // ... thêm 11 từ nữa
];

type Phase = 'LEARN' | 'PRACTICE_GAME' | 'TEST' | 'COMPLETED';

export default function TopicStudyPage() {
  const [phase, setPhase] = useState<Phase>('LEARN');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState(MOCK_WORDS);

  // --- LOGIC PHASE 1: LEARN ---
  const handleNextCard = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Hết Flashcard -> Chuyển sang Game
      if(confirm("Bạn đã xem hết từ vựng. Chuyển sang phần Luyện tập nhé?")) {
          setPhase('PRACTICE_GAME');
      }
    }
  };

  const handleUpdateStatus = (status: 'LEARNING' | 'MASTERED') => {
      // Gọi API update status ở đây
      console.log(`Word ${words[currentWordIndex].word} marked as ${status}`);
      handleNextCard(); // Tự động chuyển thẻ sau khi đánh giá
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header Process Bar */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
         <div className={`flex items-center gap-2 ${phase === 'LEARN' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">1</span>
            <span>Học từ</span>
         </div>
         <div className="w-10 h-0.5 bg-gray-200"></div>
         <div className={`flex items-center gap-2 ${phase === 'PRACTICE_GAME' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">2</span>
            <span>Ghép thẻ</span>
         </div>
         <div className="w-10 h-0.5 bg-gray-200"></div>
         <div className={`flex items-center gap-2 ${phase === 'TEST' ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center">3</span>
            <span>Kiểm tra</span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto">
        
        {phase === 'LEARN' && (
          <div className="flex flex-col items-center">
            <div className="mb-4 text-gray-500 font-medium">
               Từ {currentWordIndex + 1} / {words.length}
            </div>
            
            <Flashcard 
              word={words[currentWordIndex]} 
              onStatusChange={handleUpdateStatus}
              onBookmark={() => console.log('Bookmark')}
            />

            <div className="mt-8 flex gap-4 w-full max-w-md">
               <button 
                 onClick={() => setCurrentWordIndex(Math.max(0, currentWordIndex - 1))}
                 disabled={currentWordIndex === 0}
                 className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg disabled:opacity-50"
               >
                 Quay lại
               </button>
               <button 
                 onClick={handleNextCard}
                 className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"
               >
                 Tiếp theo <ArrowRight size={20}/>
               </button>
            </div>
          </div>
        )}

        {phase === 'PRACTICE_GAME' && (
           <MatchingGame 
             words={words} 
             onComplete={() => {
                alert("Xuất sắc! Giờ hãy làm bài kiểm tra cuối cùng.");
                setPhase('TEST');
             }} 
           />
        )}

        {phase === 'TEST' && (
           <div className="text-center py-20 bg-white rounded-xl shadow">
              <BrainCircuit size={48} className="mx-auto text-blue-500 mb-4"/>
              <h3 className="text-xl font-bold mb-2">Mini-Test Part 5</h3>
              <p className="text-gray-500 mb-6">Điền từ vào chỗ trống để hoàn thành bài học.</p>
              {/* Insert Component MiniTest của bạn vào đây */}
              <button onClick={() => setPhase('COMPLETED')} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                Giả lập Nộp bài đạt 100%
              </button>
           </div>
        )}

        {phase === 'COMPLETED' && (
            <div className="text-center py-20 animate-fadeIn">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle size={40} />
               </div>
               <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Chúc mừng!</h2>
               <p className="text-gray-600 mb-8">Bạn đã hoàn thành chủ đề <strong>Contracts</strong>.</p>
               <button className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                 Về trang chủ Từ vựng
               </button>
            </div>
        )}

      </div>
    </div>
  );
}