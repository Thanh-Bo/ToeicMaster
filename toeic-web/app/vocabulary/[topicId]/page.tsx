"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowRight, CheckCircle, BrainCircuit, Loader } from 'lucide-react';
import Flashcard from '@/app/components/vocabulary/Flashcard';
import MatchingGame from '@/app/components/vocabulary/MatchingGame';
import { vocabularyService } from '@/app/services/vocabularyService';
import VocabularyTest from '@/app/components/vocabulary/VocabularyTest';

type Phase = 'LEARN' | 'PRACTICE_GAME' | 'TEST' | 'COMPLETED';
type SubPhase = 'FLASHCARD' | 'LISTEN_WRITE' | 'FILL_BLANK';

export default function TopicStudyPage() {
  const params = useParams();
  const topicId = params?.topicId as string;

  const [phase, setPhase] = useState<Phase>('LEARN');
  const [subPhase, setSubPhase] = useState<SubPhase>('FLASHCARD');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<any[]>([]);
  const [topicTitle, setTopicTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [userInput, setUserInput] = useState('');
  const [inputFeedback, setInputFeedback] = useState('');

  // ✅ Fetch từ API thay vì MOCK_WORDS
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await vocabularyService.getWordsByTopic(Number(topicId));
        setWords(data);
        
        // Lấy tên topic
        const topics = await vocabularyService.getTopics();
        const topic = topics.find(t => t.id === Number(topicId));
        setTopicTitle(topic?.title || 'Topic');
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải từ vựng');
      } finally {
        setLoading(false);
      }
    };

    if (topicId) fetchWords();
  }, [topicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Không có từ vựng</p>
      </div>
    );
  }

  const handleNextCard = () => {
    if (subPhase === 'FLASHCARD') {
      setSubPhase('LISTEN_WRITE');
      setUserInput('');
      setInputFeedback('');
    } else if (subPhase === 'LISTEN_WRITE') {
      setSubPhase('FILL_BLANK');
      setUserInput('');
      setInputFeedback('');
    } else if (subPhase === 'FILL_BLANK') {
      // Move to next word
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setSubPhase('FLASHCARD');
        setUserInput('');
        setInputFeedback('');
      } else {
        // All words completed
        if (confirm("Bạn đã hoàn thành tất cả từ vựng. Chuyển sang phần Luyện tập nhé?")) {
          setPhase('PRACTICE_GAME');
          setSubPhase('FLASHCARD');
          setCurrentWordIndex(0);
        }
      }
    }
  };

  const handlePreviousSubPhase = () => {
    if (subPhase === 'LISTEN_WRITE') {
      setSubPhase('FLASHCARD');
      setUserInput('');
      setInputFeedback('');
    } else if (subPhase === 'FILL_BLANK') {
      setSubPhase('LISTEN_WRITE');
      setUserInput('');
      setInputFeedback('');
    }
  };

  const handleUpdateStatus = async (status: 'LEARNING' | 'MASTERED') => {
    try {
      const statusCode = status === 'LEARNING' ? 1 : 3;
      await vocabularyService.updateVocabularyStatus(words[currentWordIndex].id, statusCode);
    } catch (error) {
      console.error('Failed to update status', error);
    }
    handleNextCard();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-4 md:p-8">
      {/* Header Process Bar with better styling */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
          {[
            { phase: 'LEARN', number: '1', label: 'Học từ', icon: '📚' },
            { phase: 'PRACTICE_GAME', number: '2', label: 'Ghép thẻ', icon: '🎮' },
            { phase: 'TEST', number: '3', label: 'Kiểm tra', icon: '✍️' }
          ].map((step, idx) => (
            <React.Fragment key={step.phase}>
              <button
                onClick={() => setPhase(step.phase as Phase)}
                className={`flex flex-col items-center gap-2 transition-all ${phase === step.phase ? 'scale-110' : 'hover:scale-105'} cursor-pointer`}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all ${
                  phase === step.phase 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                    : 'border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500'
                }`}>
                  {step.number}
                </div>
                <span className={`text-xs font-bold text-center transition-colors ${
                  phase === step.phase 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}>{step.label}</span>
              </button>
              {idx < 2 && (
                <div className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                  phase === step.phase || (phase === 'PRACTICE_GAME' && idx === 0) || (phase === 'TEST' && idx < 1)
                    ? 'bg-blue-600' 
                    : 'bg-gray-200 dark:bg-zinc-700'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {phase === 'LEARN' && (
          <div className="flex flex-col items-center">
            {/* Sub-phase indicator */}
            <div className="mb-6 text-center">
              <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg mb-4">
                Từ {currentWordIndex + 1} / {words.length}
              </div>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setSubPhase('FLASHCARD')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${subPhase === 'FLASHCARD' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}>
                  1. Flashcard
                </button>
                <button 
                  onClick={() => setSubPhase('LISTEN_WRITE')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${subPhase === 'LISTEN_WRITE' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}>
                  2. Nghe & Viết
                </button>
                <button 
                  onClick={() => setSubPhase('FILL_BLANK')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${subPhase === 'FILL_BLANK' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-600'}`}>
                  3. Điền từ
                </button>
              </div>
            </div>

            {/* Sub-phase content */}
            {subPhase === 'FLASHCARD' && (
              <div className="w-full">
                <Flashcard 
                  word={words[currentWordIndex]} 
                  onStatusChange={handleUpdateStatus}
                  onBookmark={() => console.log('Bookmark')}
                />
              </div>
            )}

            {subPhase === 'LISTEN_WRITE' && (
              <div className="w-full max-w-3xl">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl shadow-2xl p-10 md:p-12">
                  <h2 className="text-3xl font-bold mb-8 text-center">🎧 Nghe và viết lại</h2>
                  
                  {/* Audio button */}
                  <div className="flex justify-center mb-10">
                    <button 
                      onClick={() => {
                        // Play audio logic here
                        const audio = new Audio(words[currentWordIndex].audioUrl);
                        audio.play().catch(e => console.log('Audio play error:', e));
                      }}
                      className="w-28 h-28 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-xl border-4 border-white/30"
                    >
                      <span className="text-6xl">🔊</span>
                    </button>
                  </div>

                  {/* Instructions */}
                  <p className="text-center text-lg mb-8 font-semibold text-white">
                    Bạn nghe từ ở trên. Gõ lại từ bạn vừa nghe
                  </p>

                  {/* Input field */}
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      setInputFeedback('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const isCorrect = userInput.toLowerCase().trim() === words[currentWordIndex].word.toLowerCase().trim();
                        setInputFeedback(isCorrect ? '✅ Chính xác!' : `❌ Sai rồi! Đáp án là: ${words[currentWordIndex].word}`);
                      }
                    }}
                    placeholder="Nhập từ ở đây..."
                    className="w-full px-6 py-4 rounded-2xl text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 text-center text-xl font-semibold mb-6 focus:outline-none focus:ring-4 focus:ring-yellow-300 placeholder-gray-400"
                  />

                  {/* Feedback */}
                  {inputFeedback && (
                    <p className={`text-center text-lg font-bold mb-4 animate-pulse ${
                      inputFeedback.includes('✅') 
                        ? 'text-green-200' 
                        : 'text-yellow-200'
                    }`}>
                      {inputFeedback}
                    </p>
                  )}

                  {/* Hint */}
                  <p className="text-center text-sm text-white/70">Nhấn Enter hoặc bấm Tiếp theo để kiểm tra</p>
                </div>
              </div>
            )}

            {subPhase === 'FILL_BLANK' && (
              <div className="w-full max-w-3xl">
                <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-2xl p-10 md:p-12">
                  <h2 className="text-3xl font-bold mb-8 text-center">📝 Điền từ</h2>
                  
                  {/* Example sentence */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <p className="text-center text-xl leading-8 font-semibold ">
                      {words[currentWordIndex].exampleTranslation || words[currentWordIndex].example || 
                       'The two companies reached an agreement after hours of discussion.'}
                    </p>
                  </div>

                  {/* Blank representation */}
                  <div className="bg-blackrounded-2xl p-8 mb-8 border-2 ">
                    <div className="text-center">
                      <p className="text-2xl tracking-[12px] font-mono font-bold  mb-2">
                        {words[currentWordIndex].word.split('').map((char, idx) => (
                          <span key={idx} className="inline-block w-8">_</span>
                        ))}
                      </p>
                      <p className="text-sm text-white mt-4">
                        {words[currentWordIndex].word.length} chữ cái
                      </p>
                    </div>
                  </div>

                  {/* Input field */}
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value.toLowerCase());
                      setInputFeedback('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const isCorrect = userInput.toLowerCase().trim() === words[currentWordIndex].word.toLowerCase().trim();
                        setInputFeedback(isCorrect ? '✅ Chính xác!' : `❌ Sai rồi! Đáp án là: ${words[currentWordIndex].word}`);
                      }
                    }}
                    placeholder="Nhập từ ở đây..."
                    className="w-full px-6 py-4 rounded-2xl text-gray-900 text-center text-xl font-semibold mb-6  "
                  />

                  {/* Feedback */}
                  {inputFeedback && (
                    <p className={`text-center text-lg font-bold mb-4 animate-pulse ${
                      inputFeedback.includes('✅') 
                        ? 'text-green-300' 
                        : 'text-yellow-300'
                    }`}>
                      {inputFeedback}
                    </p>
                  )}

                  {/* Hint */}
                  <p className="text-center text-sm text-white/70">Nhấn Enter hoặc bấm Tiếp theo để kiểm tra</p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-10 flex gap-4 w-full max-w-md">
              <button 
                onClick={subPhase === 'FLASHCARD' ? () => {
                  if (currentWordIndex > 0) {
                    setCurrentWordIndex(prev => prev - 1);
                  }
                } : handlePreviousSubPhase}
                disabled={subPhase === 'FLASHCARD' && currentWordIndex === 0}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all border border-gray-300 dark:border-zinc-700"
              >
                ← Quay lại
              </button>
              <button 
                onClick={handleNextCard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all hover:shadow-2xl"
              >
                Tiếp theo <ArrowRight size={20}/>
              </button>
            </div>
          </div>
        )}

        {phase === 'PRACTICE_GAME' && (
          <div className="flex flex-col gap-4">
            <MatchingGame 
              words={words} 
              onComplete={() => {
                alert("Xuất sắc! Giờ hãy làm bài kiểm tra cuối cùng.");
                setPhase('TEST');
              }} 
            />
            <button
              onClick={() => setPhase('TEST')}
              className="w-full max-w-md mx-auto px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl transition-all"
            >
              Bỏ qua và đi kiểm tra
            </button>
          </div>
        )}

        {phase === 'TEST' && (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
            <VocabularyTest 
              topicId={Number(topicId)}
              topicTitle={topicTitle}
              onComplete={() => setPhase('COMPLETED')}
            />
          </div>
        )}

        {phase === 'COMPLETED' && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900  rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Chúc mừng!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Bạn đã hoàn thành chủ đề này.</p>
            <a href="/vocabulary" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg inline-block transition-all">
              Về trang Từ vựng
            </a>
          </div>
        )}
      </div>
    </div>
  );
}