import { useState, useEffect } from "react";
import { X, Volume2, Sparkles } from "lucide-react";
import { VocabularyItem } from "../types";

interface Props {
  vocab: VocabularyItem;
  isOpen: boolean;
  onClose: () => void;
  allVocabs: VocabularyItem[]; // Truyền vào để lấy đáp án nhiễu cho Quiz
}

export default function VocabularyModal({ vocab, isOpen, onClose, allVocabs }: Props) {
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Tạo Quiz ngẫu nhiên mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsCorrect(null);
      
      // Lấy 2 nghĩa sai ngẫu nhiên từ danh sách
      const wrongAnswers = allVocabs
        .filter(v => v.id !== vocab.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(v => v.meaning);
      
      // Trộn với nghĩa đúng
      const options = [...wrongAnswers, vocab.meaning].sort(() => 0.5 - Math.random());
      setQuizOptions(options);
    }
  }, [isOpen, vocab, allVocabs]);

  if (!isOpen) return null;

  const handleQuizAnswer = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(option === vocab.meaning);
  };

  const playAudio = () => {
    if (vocab.audioUrl) new Audio(vocab.audioUrl).play();
    else {
        const u = new SpeechSynthesisUtterance(vocab.word);
        u.lang = 'en-US';
        window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-scaleUp">
        
        {/* Header Color */}
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-700 relative flex items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1 rounded-full transition">
                <X size={20} />
            </button>
            <div className="text-white text-center">
                <h2 className="text-4xl font-bold mb-1">{vocab.word}</h2>
                <div className="flex items-center justify-center gap-2 opacity-90">
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">{vocab.partOfSpeech}</span>
                    <span className="text-sm">{vocab.pronunciation}</span>
                </div>
            </div>
            <button onClick={playAudio} className="absolute bottom-[-20px] bg-white text-blue-600 p-3 rounded-full shadow-lg hover:scale-110 transition">
                <Volume2 size={24} />
            </button>
        </div>

        <div className="pt-8 px-6 pb-6">
            {/* Meaning & Example */}
            <div className="text-center mb-6">
                <p className="text-xl font-medium text-gray-800 mb-2">{vocab.meaning}</p>
                {vocab.example && (
                    <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 italic border border-gray-100">
                        "{vocab.example}"
                        {vocab.exampleTranslation && <div className="not-italic text-gray-400 mt-1 text-xs">{vocab.exampleTranslation}</div>}
                    </div>
                )}
            </div>

            {/* Quick Quiz Section */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} className="text-yellow-500"/> Quick Quiz
                </div>
                <p className="text-sm font-medium text-gray-700 mb-3">Nghĩa của "{vocab.word}" là gì?</p>
                
                <div className="space-y-2">
                    {quizOptions.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuizAnswer(opt)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all border
                                ${selectedOption === null 
                                    ? "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700" 
                                    : opt === vocab.meaning 
                                        ? "bg-green-100 border-green-500 text-green-800 font-bold" 
                                        : selectedOption === opt 
                                            ? "bg-red-100 border-red-500 text-red-800"
                                            : "bg-gray-50 border-gray-100 text-gray-400 opacity-50"
                                }
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                
                {isCorrect === true && (
                    <div className="mt-3 text-center text-green-600 text-sm font-bold animate-bounce">
                        🎉 Chính xác! Bạn rất giỏi!
                    </div>
                )}
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-500">
            <span>Difficulty: {"⭐".repeat(vocab.difficulty)}</span>
            <button className="text-blue-600 font-bold hover:underline">Báo lỗi từ vựng</button>
        </div>
      </div>
    </div>
  );
}