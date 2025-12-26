"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { vocabularyService, VocabularyItem } from "../services/vocabularyService";

import { Search, Filter, Layers } from "lucide-react";
import VocabularyCard from "../components/VocabularyCard";
import VocabularyModal from "../components/VocabularyModal";

export default function VocabularyPage() {
  const [allVocabs, setAllVocabs] = useState<VocabularyItem[]>([]);
  const [filteredVocabs, setFilteredVocabs] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  
  // Modal State
  const [selectedVocab, setSelectedVocab] = useState<VocabularyItem | null>(null);

  // Stats
  const [stats, setStats] = useState({ learned: 0, total: 0, percent: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Gọi API lấy hết (hoặc phân trang lớn) để làm Client-side filtering cho mượt
      // Trong thực tế nếu > 1000 từ nên server-side filtering
      const data = await vocabularyService.getVocabularies({ pageSize: 1000 });
      setAllVocabs(data.items);
      setFilteredVocabs(data.items);

      // Extract Categories
      const cats = Array.from(new Set(data.items.map((v: VocabularyItem) => v.category || "Uncategorized"))) as string[];
      setCategories(["All", ...cats]);

      // Calculate Stats (Fake stats if API not ready, or use API stats)
      const learned = data.items.filter((v: any) => v.status === 3).length;
      setStats({
        learned,
        total: data.items.length,
        percent: data.items.length > 0 ? Math.round((learned / data.items.length) * 100) : 0
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let result = allVocabs;

    if (activeCategory !== "All") {
      result = result.filter(v => v.category === activeCategory);
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(v => 
        v.word.toLowerCase().includes(lower) || 
        v.meaning.toLowerCase().includes(lower)
      );
    }

    setFilteredVocabs(result);
  }, [search, activeCategory, allVocabs]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Background */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-800 text-white pt-10 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Từ vựng TOEIC</h1>
              <p className="text-blue-100 opacity-80">Chinh phục 600+ từ vựng cốt lõi</p>
            </div>
            <Link href="/vocabulary/flashcards" className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition flex items-center gap-2">
               <Layers size={18}/> Học Flashcards
            </Link>
            <Link href="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Quay lại trang chủ
          </Link>
          </div>

          {/* Progress Bar (Phong cách Dashboard) */}
          <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-xs border border-white/10">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-blue-100">Tiến độ thành thạo</span>
                <span className="text-2xl font-bold">{stats.learned} <span className="text-sm text-blue-200 font-normal">/ {stats.total} từ</span></span>
            </div>
            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-linear-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${stats.percent}%` }}
                ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        
      

        {/* Filters & Search */}
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 mb-8 flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm từ vựng..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-gray-800 placeholder-gray-500"
                />
            </div>
            {/* Category Pills (Mobile scrollable) */}
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar max-w-full md:max-w-2xl">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                            ${activeCategory === cat 
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }
                        `}
                    >
                        {cat === "All" ? "⭐ Tất cả" : cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="text-center py-20">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
        )}

        {/* Vocabulary Grid */}
        {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVocabs.map((vocab) => (
                    <VocabularyCard 
                        key={vocab.id} 
                        vocab={vocab} 
                        onClick={() => setSelectedVocab(vocab)}
                    />
                ))}
            </div>
        )}

        {/* Empty State */}
        {!loading && filteredVocabs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-xl font-bold text-gray-800">Không tìm thấy kết quả</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa hoặc bộ lọc danh mục</p>
            </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedVocab && (
        <VocabularyModal 
            vocab={selectedVocab} 
            isOpen={!!selectedVocab} 
            onClose={() => setSelectedVocab(null)}
            allVocabs={allVocabs}
        />
      )}
    </div>
  );
}