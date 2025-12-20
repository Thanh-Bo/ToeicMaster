"use client";

import { useState } from "react";
import { vocabularyService, SaveVocabFromQuestionRequest } from "../services/vocabularyService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionId?: number;
  initialWord?: string;
  initialExample?: string;
}

export default function SaveVocabularyModal({ isOpen, onClose, questionId, initialWord = "", initialExample = "" }: Props) {
  const [word, setWord] = useState(initialWord);
  const [pronunciation, setPronunciation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState(initialExample);
  const [exampleTranslation, setExampleTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim() || !meaning.trim()) {
      setError("Vui lòng nhập từ vựng và nghĩa");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data: SaveVocabFromQuestionRequest = {
        word: word.trim(),
        pronunciation: pronunciation.trim() || undefined,
        partOfSpeech: partOfSpeech || undefined,
        meaning: meaning.trim(),
        example: example.trim() || undefined,
        exampleTranslation: exampleTranslation.trim() || undefined,
        questionId,
        category: "user-saved",
        difficulty: 2
      };

      const result = await vocabularyService.saveFromQuestion(data);
      
      if (result.alreadySaved) {
        setError("Từ vựng này đã được lưu trước đó!");
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setWord("");
          setPronunciation("");
          setPartOfSpeech("");
          setMeaning("");
          setExample("");
          setExampleTranslation("");
          setSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Lưu từ vựng thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-green-500 to-teal-600 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <h2 className="text-xl font-bold">Lưu từ vựng</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-green-100 text-sm mt-1">Thêm vào danh sách học để ôn tập sau</p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Đã lưu thành công!</h3>
            <p className="text-gray-500 mt-2">Từ vựng đã được thêm vào danh sách học</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Từ vựng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ vựng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Nhập từ tiếng Anh..."
                autoFocus
              />
            </div>

            {/* Phát âm & Loại từ */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phát âm</label>
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="/prəˌnʌnsiˈeɪʃn/"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại từ</label>
                <select
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">-- Chọn --</option>
                  <option value="noun">Danh từ (n)</option>
                  <option value="verb">Động từ (v)</option>
                  <option value="adjective">Tính từ (adj)</option>
                  <option value="adverb">Trạng từ (adv)</option>
                  <option value="preposition">Giới từ (prep)</option>
                  <option value="conjunction">Liên từ (conj)</option>
                  <option value="phrase">Cụm từ</option>
                </select>
              </div>
            </div>

            {/* Nghĩa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nghĩa tiếng Việt <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="Nhập nghĩa tiếng Việt..."
              />
            </div>

            {/* Ví dụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Câu ví dụ</label>
              <textarea
                value={example}
                onChange={(e) => setExample(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                placeholder="Nhập câu ví dụ tiếng Anh..."
              />
            </div>

            {/* Dịch ví dụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dịch câu ví dụ</label>
              <textarea
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                placeholder="Dịch nghĩa câu ví dụ..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-linear-to-r from-green-500 to-teal-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span>💾</span> Lưu từ vựng
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
