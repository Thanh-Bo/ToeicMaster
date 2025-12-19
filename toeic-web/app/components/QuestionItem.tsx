"use client";

interface Answer {
  label: string;
  content: string;
}

interface QuestionData {
  id: number;
  questionId: number;
  questionNo: number;
  content: string;
  isCorrect: boolean;
  userSelected?: string;
  correctOption?: string;
  explanation?: string;
  shortExplanation?: string;
  fullExplanation?: string;
  answers?: Answer[];
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
}

interface Props {
  q: QuestionData; 
  onExplain: (id: number) => void;
  isExplaining: boolean;
}

export const QuestionItem = ({ q, onExplain, isExplaining }: Props) => {
  const options = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      
      {/* 1. Tiêu đề câu hỏi */}
      <div className="flex gap-4 mb-4">
        {/* Badge số thứ tự: Nếu đúng màu xanh, sai/bỏ qua màu đỏ */}
        <span className={`shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center text-sm shadow-sm
          ${q.isCorrect 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-600 border border-red-200'        
          }`}>
          {q.questionNo}
        </span>
        <div className="flex-1 pt-1">
           <p className="font-medium text-gray-800 text-lg leading-relaxed whitespace-pre-line">
             {q.content}
           </p>
        </div>
      </div>

      {/* 2. Danh sách đáp án */}
      <div className="grid grid-cols-1 gap-3 ml-12 mb-5">
        {options.map((label) => {
           // Lấy nội dung đáp án (An toàn cho cả 2 dạng dữ liệu)
           let content = "";
           if (q.answers && Array.isArray(q.answers)) {
              const ansObj = q.answers.find((a) => a.label === label);
              content = ansObj ? ansObj.content : "";
           } else {
              const optionKey = `option${label}` as keyof QuestionData;
              content = (q[optionKey] as string) || ""; 
           }

           // --- SỬA LỖI Ở ĐÂY: SO SÁNH AN TOÀN (CASE INSENSITIVE) ---
           // Ép về chuỗi và uppercase để đảm bảo 'a' == 'A'
           const userSelected = (q.userSelected || "").toString().toUpperCase();
           const isUserSelected = userSelected === label;

           const correctOpt = (q.correctOption || "").toString().toUpperCase();
           const isCorrect = correctOpt === label;
           
           // Logic style
           let containerClass = "border-gray-200 bg-white opacity-70"; 
           let badgeClass = "bg-gray-100 text-gray-500 border-gray-200";
           let statusText = null;

           if (isCorrect) {
             // Đáp án ĐÚNG (Ưu tiên cao nhất - Luôn xanh)
             containerClass = "border-green-500 bg-green-50 ring-1 ring-green-500 opacity-100 shadow-sm";
             badgeClass = "bg-green-600 text-white border-green-600";
             statusText = <span className="text-green-700 text-xs font-bold ml-auto uppercase tracking-wider">✔ Chính xác</span>;
           } else if (isUserSelected) {
             // Đáp án SAI mà user chọn (Nếu không đúng mà được chọn -> Chắc chắn là sai -> Đỏ)
             containerClass = "border-red-500 bg-red-50 ring-1 ring-red-500 opacity-100 shadow-sm";
             badgeClass = "bg-red-600 text-white border-red-600";
             statusText = <span className="text-red-600 text-xs font-bold ml-auto uppercase tracking-wider">✖ Bạn chọn</span>;
           } else {
             // Các đáp án sai còn lại (Không chọn)
             containerClass += " hover:bg-gray-50 hover:border-gray-300";
           }

           return (
             <div key={label} className={`flex items-center px-4 py-3 border rounded-xl transition-all ${containerClass}`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mr-3 border shrink-0 ${badgeClass}`}>
                   {label}
                </span>
                <span className={`text-base ${isCorrect || isUserSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                   {content}
                </span>
                {statusText}
             </div>
           );
        })}
      </div>

      {/* 3. Phần Giải thích chi tiết */}
      <div className="ml-12">
        {!q.shortExplanation && !q.fullExplanation ? (
           <button 
             onClick={() => onExplain(q.questionId)}
             disabled={isExplaining}
             className="inline-flex items-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors bg-blue-50 px-4 py-2 rounded-lg"
           >
             {isExplaining ? (
               <>
                 <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Đang phân tích...
               </>
             ) : (
               <>✨ Xem giải thích chi tiết & Dịch nghĩa</>
             )}
           </button>
        ) : (
           <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 text-gray-800 shadow-inner animate-fadeIn">
              {q.shortExplanation && (
                 <div className="mb-3 pb-3 border-b border-blue-200">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">GỢI Ý</span>
                    <span className="font-medium text-blue-900">{q.shortExplanation}</span>
                 </div>
              )}
              {q.fullExplanation && (
                 <div className="prose prose-sm prose-blue max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: q.fullExplanation }}
                 />
              )}
           </div>
        )}
      </div>
    </div>
  );
};