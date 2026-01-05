"use client";
import { useState, useEffect } from 'react';
import { VocabWord } from '@/app/types';

interface EnglishCard {
  id: string;
  content: string;
  type: 'EN';
  wordId: number;
  status: 'default' | 'selected' | 'matched' | 'wrong';
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

export default function MatchingGame({ words, onComplete }: Props) {
  const [enCards, setEnCards] = useState<EnglishCard[]>([]);
  const [viCards, setViCards] = useState<VietnameseCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<{side: 'en'|'vi', index: number}[]>([]);

  useEffect(() => {
    const english: EnglishCard[] = words.map(w => ({ 
      id: `en-${w.id}`, 
      content: w.word, 
      type: 'EN' as const, 
      wordId: w.id, 
      status: 'default' as const
    }));
    const vietnamese: VietnameseCard[] = words.map(w => ({ 
      id: `vi-${w.id}`, 
      content: w.meaning, 
      type: 'VI' as const, 
      wordId: w.id, 
      status: 'default' as const
    })).sort(() => Math.random() - 0.5);
    
    setEnCards(english);
    setViCards(vietnamese);
  }, [words]);

  const handleCardClick = (side: 'en'|'vi', index: number) => {
    const cardsArray = side === 'en' ? enCards : viCards;
    const card = cardsArray[index];
    if (card.status === 'matched' || card.status === 'selected') return;

    // Chọn thẻ
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

    // Nếu đã chọn 2 thẻ -> Check logic
    if (newSelected.length === 2) {
      const [select1, select2] = newSelected;
      const card1 = select1.side === 'en' ? enCards[select1.index] : viCards[select1.index];
      const card2 = select2.side === 'en' ? enCards[select2.index] : viCards[select2.index];

      // Phải là 1 EN + 1 VI, và cùng wordId
      if (card1.wordId === card2.wordId && card1.type !== card2.type) {
        // MATCH!
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
          
          // Check win
          if (enMatched.every(c => c.status === 'matched')) onComplete();
        }, 500);
      } else {
        // WRONG!
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
          }, 800);
        }, 500);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-center font-bold text-2xl mb-8 text-gray-700 dark:text-white">🎮 Nối từ vựng với nghĩa đúng</h3>
      
      <div className="grid grid-cols-2 gap-8">
        {/* ENGLISH SIDE - LEFT */}
        <div>
          <h4 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4 text-center">📝 Tiếng Anh</h4>
          <div className="space-y-3">
            {enCards.map((card, idx) => {
              let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-700';
              if (card.status === 'selected') bgClass = 'bg-blue-500 text-white border-blue-500 dark:border-blue-400';
              if (card.status === 'matched') bgClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 opacity-50 cursor-default';
              if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick('en', idx)}
                  className={`w-full h-16 p-3 rounded-lg border-2 flex items-center justify-center font-bold text-center text-sm transition-all duration-200 shadow-md ${bgClass}`}
                  disabled={card.status === 'matched'}
                >
                  {card.content}
                </button>
              )
            })}
          </div>
        </div>

        {/* VIETNAMESE SIDE - RIGHT */}
        <div>
          <h4 className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-4 text-center">📖 Tiếng Việt</h4>
          <div className="space-y-3">
            {viCards.map((card, idx) => {
              let bgClass = 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-orange-50 dark:hover:bg-zinc-700';
              if (card.status === 'selected') bgClass = 'bg-orange-500 text-white border-orange-500 dark:border-orange-400';
              if (card.status === 'matched') bgClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 opacity-50 cursor-default';
              if (card.status === 'wrong') bgClass = 'bg-red-500 text-white dark:text-white animate-shake border-red-500';

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick('vi', idx)}
                  className={`w-full h-16 p-3 rounded-lg border-2 flex items-center justify-center font-bold text-center text-sm transition-all duration-200 shadow-md ${bgClass}`}
                  disabled={card.status === 'matched'}
                >
                  {card.content}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}