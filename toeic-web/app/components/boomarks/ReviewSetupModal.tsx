"use client";

import { useState, useEffect, useMemo } from "react";
import { X, CheckSquare, Square, PlayCircle, AlertCircle, ChevronDown, ChevronRight, CheckCircle } from "lucide-react"; // Thêm icon Chevron
import { BookmarkItem } from "@/app/types";
import { bookmarkService } from "@/app/services/bookmarkService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Các filter hiện tại từ trang cha
  currentPart: number | null;
  currentSort: string;
  fromDate?: string;
  toDate?: string;
  onStartReview: (selectedQuestions: BookmarkItem[]) => void;
}

export default function ReviewSetupModal({ 
  isOpen, onClose, currentPart, currentSort, fromDate, toDate, onStartReview 
}: Props) {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<BookmarkItem[]>([]); 
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // State mới để quản lý việc mở rộng Part
  const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());

  // 1. Fetch dữ liệu
  useEffect(() => {
    if (isOpen) {
      const fetchCandidates = async () => {
        setLoading(true);
        try {
          // Gọi API lấy TẤT CẢ (pageSize lớn)
          const data = await bookmarkService.getBookmarks(1, 1000, currentPart, currentSort, fromDate, toDate);
          setCandidates(data.items);
          setSelectedIds(new Set()); // Mặc định rỗng
          setExpandedParts(new Set()); // Mặc định đóng hết
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchCandidates();
    }
  }, [isOpen, currentPart, currentSort, fromDate, toDate]);

  // 2. Group câu hỏi
  const groupedByPart = useMemo(() => {
    const groups: Record<number, BookmarkItem[]> = {};
    candidates.forEach(c => {
      const p = c.question.partNumber;
      if (!groups[p]) groups[p] = [];
      groups[p].push(c);
    });
    return groups;
  }, [candidates]);

  // --- HANDLERS ---

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const togglePartSelection = (partNum: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Chặn click lan ra header (tránh mở rộng/thu gọn nhầm)
    const questions = groupedByPart[partNum] || [];
    const allSelected = questions.every(q => selectedIds.has(q.questionId));
    
    const next = new Set(selectedIds);
    questions.forEach(q => {
      if (allSelected) next.delete(q.questionId);
      else next.add(q.questionId);
    });
    setSelectedIds(next);
  };

  const togglePartExpansion = (partNum: number) => {
    const next = new Set(expandedParts);
    if (next.has(partNum)) next.delete(partNum);
    else next.add(partNum);
    setExpandedParts(next);
  };

  // Handler Chọn tất cả / Bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedIds.size === candidates.length) {
      setSelectedIds(new Set()); // Bỏ chọn hết
    } else {
      setSelectedIds(new Set(candidates.map(c => c.questionId))); // Chọn hết
    }
  };

  const handleStart = () => {
    const selectedQuestions = candidates.filter(c => selectedIds.has(c.questionId));
    onStartReview(selectedQuestions);
  };

  if (!isOpen) return null;

  const isAllSelected = candidates.length > 0 && selectedIds.size === candidates.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b dark:border-zinc-700 flex justify-between items-center bg-white dark:bg-zinc-800 rounded-t-2xl z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">🎯 Thiết lập bài ôn tập</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tìm thấy <strong className="text-blue-600 dark:text-blue-400">{candidates.length}</strong> câu hỏi khớp bộ lọc.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Nút Chọn Tất Cả */}
            <button 
              onClick={toggleSelectAll}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 px-3 py-1.5 rounded-lg transition flex items-center gap-2"
            >
              {isAllSelected ? <CheckCircle size={16} /> : <Square size={16} />}
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>

            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full text-gray-500 dark:text-gray-400 transition"><X size={20}/></button>
          </div>
        </div>

        {/* Body List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-zinc-900">
          {loading ? (
            <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 dark:border-blue-400 border-t-transparent"></div></div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Không có câu hỏi nào khớp với bộ lọc hiện tại.</div>
          ) : (
            <div className="space-y-4">
              {/* Render từng Group Part */}
              {Object.entries(groupedByPart).sort().map(([partNum, items]) => {
                const pNum = Number(partNum);
                const isPartAllSelected = items.every(i => selectedIds.has(i.questionId));
                const isExpanded = expandedParts.has(pNum);
                const selectedCountInPart = items.filter(i => selectedIds.has(i.questionId)).length;
                
                return (
                  <div key={pNum} className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden shadow-sm transition-all">
                    {/* Header Part - Click để MỞ RỘNG */}
                    <div 
                      onClick={() => togglePartExpansion(pNum)}
                      className="px-4 py-3 bg-white dark:bg-zinc-800 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition select-none"
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Mũi tên đóng/mở */}
                        <div className="text-gray-400 dark:text-gray-500">
                           {isExpanded ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                        </div>
                        
                        <div>
                            <span className="font-bold text-gray-700 dark:text-white block">Part {pNum}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {selectedCountInPart}/{items.length} câu đã chọn
                            </span>
                        </div>
                      </div>

                      {/* Checkbox chọn cả Part */}
                      <div 
                        onClick={(e) => togglePartSelection(pNum, e)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-full transition"
                      >
                        {isPartAllSelected 
                            ? <CheckSquare size={20} className="text-blue-600 dark:text-blue-400"/> 
                            : <Square size={20} className="text-gray-300 dark:text-gray-600"/>
                        }
                      </div>
                    </div>
                    
                    {/* List câu hỏi trong Part (Chỉ hiện khi Expanded) */}
                    {isExpanded && (
                        <div className="divide-y dark:divide-zinc-700 border-t dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 animate-fadeIn">
                        {items.map(item => (
                            <div 
                            key={item.id} 
                            onClick={() => toggleSelect(item.questionId)}
                            className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-white dark:hover:bg-zinc-700 transition pl-10
                                ${selectedIds.has(item.questionId) ? "bg-blue-50 dark:bg-blue-900" : ""}`}
                            >
                            <div className="pt-1">
                                {selectedIds.has(item.questionId) 
                                ? <CheckSquare size={16} className="text-blue-600 dark:text-blue-400"/> 
                                : <Square size={16} className="text-gray-300 dark:text-gray-600"/>}
                            </div>
                            <div>
                                <p className="text-sm text-gray-800 dark:text-white line-clamp-1 font-medium">{item.question.content || `Câu hỏi ${item.question.questionNo}`}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                                    {item.note ? <span className="text-yellow-600 dark:text-yellow-400">📝 {item.note}</span> : "Không có note"}
                                </p>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-b-2xl flex justify-between items-center z-10">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Đã chọn: <strong className="text-blue-600 dark:text-blue-400">{selectedIds.size}</strong> câu
            {selectedIds.size > 0 && selectedIds.size < 5 && (
              <span className="ml-2 text-orange-500 dark:text-orange-400 flex items-center gap-1 inline-flex text-xs font-medium bg-orange-50 dark:bg-orange-900 px-2 py-1 rounded">
                <AlertCircle size={12}/> Ít nhất 5 câu để ôn hiệu quả
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition">Hủy</button>
            <button 
              onClick={handleStart}
              disabled={selectedIds.size === 0}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
            >
              <PlayCircle size={18}/> Bắt đầu ôn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}