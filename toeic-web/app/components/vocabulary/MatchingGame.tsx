"use client";
import { useState, useEffect } from 'react';

interface Props {
  words: VocabWord[];
  onComplete: () => void;
}

export default function MatchingGame({ words, onComplete }: Props) {
  // Tạo danh sách thẻ gồm cả Anh và Việt, shuffle lên
  const [cards, setCards] = useState<{id: string, content: string, type: 'EN'|'VI', wordId: number, status: 'default'|'selected'|'matched'|'wrong'}[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]); // Lưu index

  useEffect(() => {
    const list = [
      ...words.map(w => ({ id: `en-${w.id}`, content: w.word, type: 'EN' as const, wordId: w.id, status: 'default' as const })),
      ...words.map(w => ({ id: `vi-${w.id}`, content: w.meaning, type: 'VI' as const, wordId: w.id, status: 'default' as const }))
    ];
    setCards(list.sort(() => Math.random() - 0.5));
  }, [words]);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.status === 'matched' || card.status === 'selected') return;
    if (selectedCards.length === 2) return; // Đang xử lý lượt cũ

    // Chọn thẻ
    const newCards = [...cards];
    newCards[index].status = 'selected';
    setCards(newCards);
    
    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    // Nếu đã chọn 2 thẻ -> Check logic
    if (newSelected.length === 2) {
      const idx1 = newSelected[0];
      const idx2 = newSelected[1];
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.wordId === card2.wordId && card1.type !== card2.type) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[idx1].status = 'matched';
          matchedCards[idx2].status = 'matched';
          setCards(matchedCards);
          setSelectedCards([]);
          
          // Check win
          if (matchedCards.every(c => c.status === 'matched')) onComplete();
        }, 500);
      } else {
        // WRONG!
        setTimeout(() => {
            const resetCards = [...cards];
            resetCards[idx1].status = 'wrong'; // Có thể thêm hiệu ứng đỏ
            resetCards[idx2].status = 'wrong';
            setCards(resetCards);
            
            setTimeout(() => {
                resetCards[idx1].status = 'default';
                resetCards[idx2].status = 'default';
                setCards([...resetCards]); // Force re-render
                setSelectedCards([]);
            }, 800);
        }, 500);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-center font-bold text-xl mb-6 text-gray-700">🎮 Nối từ vựng với nghĩa đúng</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          let bgClass = 'bg-white border-gray-200 hover:bg-blue-50';
          if (card.status === 'selected') bgClass = 'bg-blue-500 text-white border-blue-500';
          if (card.status === 'matched') bgClass = 'bg-green-100 text-green-700 border-green-200 opacity-50 cursor-default';
          if (card.status === 'wrong') bgClass = 'bg-red-500 text-white animate-shake';

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-24 p-2 rounded-xl border-2 flex items-center justify-center font-bold text-center text-sm transition-all duration-200 shadow-sm ${bgClass}`}
            >
              {card.content}
            </button>
          )
        })}
      </div>
    </div>
  );
}