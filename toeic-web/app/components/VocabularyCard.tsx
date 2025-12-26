"use client";

import { VocabularyItem, VocabularyStatus } from "../types";


interface Props {
  vocab: VocabularyItem;
  onClick: () => void;
}

export default function VocabularyCard({ vocab, onClick }: Props) {
  
  // 1. Logic màu sắc cho Badge Loại từ (Pastel Colors)
  const getPartOfSpeechStyle = (pos?: string) => {
    const p = pos?.toLowerCase() || "";
    if (p.includes("danh")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (p.includes("động")) return "bg-orange-100 text-orange-700 border-orange-200";
    if (p.includes("tính")) return "bg-purple-100 text-purple-700 border-purple-200";
    if (p.includes("trạng")) return "bg-teal-100 text-teal-700 border-teal-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  // 2. Logic tính toán thanh tiến độ dựa trên Status
  const getProgressWidth = (status: number) => {
    switch (status) {
      case VocabularyStatus.New: return "w-0";
      case VocabularyStatus.Learning: return "w-[30%]";
      case VocabularyStatus.Review: return "w-[70%]";
      case VocabularyStatus.Mastered: return "w-full";
      default: return "w-0";
    }
  };

  // 3. Xử lý phát âm thanh (Native Browser API)
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // Chặn sự kiện click vào thẻ cha
    
    // Tạo hiệu ứng nút bấm lún xuống
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.transform = "scale(0.9)";
    setTimeout(() => btn.style.transform = "scale(1)", 150);

    if (vocab.audioUrl) {
      new Audio(vocab.audioUrl).play();
    } else {
      // Fallback nếu không có file mp3
      const u = new SpeechSynthesisUtterance(vocab.word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  const isMastered = vocab.status === VocabularyStatus.Mastered;

  return (
    <div 
      onClick={onClick}
      className={`
        group relative bg-white rounded-2xl border border-gray-100 
        shadow-sm hover:shadow-xl transition-all duration-300 ease-out 
        cursor-pointer overflow-hidden transform hover:-translate-y-1
        ${isMastered ? "border-green-200 bg-green-50/30" : ""}
      `}
    >
      {/* --- GAMIFICATION: Con dấu Mastered --- */}
      {isMastered && (
        <div className="absolute -right-4 -top-2 opacity-10 rotate-12 pointer-events-none z-0">
          <span className="text-6xl font-black text-green-600 uppercase border-4 border-green-600 rounded-lg px-4 py-2 tracking-widest">
            PASSED
          </span>
        </div>
      )}

      {/* --- GAMIFICATION: Streak Fire (Góc trái trên) --- */}
      {vocab.status === VocabularyStatus.Review && (
        <div className="absolute top-2 right-2 z-10 animate-pulse" title="Đang trong chuỗi ôn tập">
          🔥
        </div>
      )}

      <div className="p-5 flex items-start gap-4 relative z-10">
        
        {/* --- 1. VISUAL CUE: Icon từ Backend (Thay cho chữ cái đầu) --- */}
        <div className={`
          shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner
          bg-linear-to-br from-indigo-50 to-blue-100 border border-white
        `}>
          {/* Render Emoji từ DB: 🏢, ⏰, 📝... */}
          {vocab.icon || "📘"} 
        </div>

        {/* --- 2. CONTENT: Phân cấp thông tin --- */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Word: To, Đậm, Font Serif hoặc Sans dày */}
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-serif tracking-tight">
              {vocab.word}
            </h3>
            
            {/* Badge Loại từ: Pastel Colors */}
            <span className={`
              text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border 
              ${getPartOfSpeechStyle(vocab.partOfSpeech)}
            `}>
              {vocab.partOfSpeech || "N/A"}
            </span>
          </div>

          {/* Phiên âm: Font Mono (Code) */}
          <p className="text-xs text-slate-400 font-mono mb-2 bg-slate-50 inline-block px-1 rounded">
            {vocab.pronunciation || "/.../"}
          </p>

          {/* Nghĩa: Rõ ràng */}
          <p className="text-sm text-slate-600 font-medium line-clamp-2">
            {vocab.meaning}
          </p>
        </div>

        {/* --- 3. INTERACTION: Nút Loa (Dùng SVG thuần thay lucide) --- */}
        <button 
          onClick={playAudio}
          className="shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm hover:shadow-md active:shadow-inner"
          title="Nghe phát âm"
        >
          {/* SVG Loa đơn giản */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </button>
      </div>

      {/* --- 4. PROGRESS BAR Mini (Dưới đáy) --- */}
      <div className="h-1 w-full bg-gray-100 mt-2 absolute bottom-0 left-0">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${
            isMastered ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: getProgressWidth(vocab.status) }} 
        />
      </div>
    </div>
  );
}