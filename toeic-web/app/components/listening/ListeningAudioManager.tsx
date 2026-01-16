"use client";

import { useState, useEffect } from "react";
import { audioService, 
    
 } from "@/app/services/audioService";
import { Play, Zap, Loader, AlertCircle, CheckCircle, Filter } from "lucide-react";
import { Group } from "@/app/types";

interface ListeningAudioManagerProps {
  testId: number;
}

export default function ListeningAudioManager({
  testId,
}: ListeningAudioManagerProps) {
  const [selectedPart, setSelectedPart] = useState<number>(3);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, [testId, selectedPart]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API lấy groups theo Part
      // Backend: GET /api/v1/questions/groups?testId=...&partNumber=...
      const data = await audioService.getGroupsByPart(testId, selectedPart);
      setGroups(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAudio = async (groupId: number) => {
    try {
      setGenerating(groupId);
      setError(null);
      setSuccessMessage(null);

      const result = await audioService.generateAudioForGroup(groupId);

      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, audioUrl: result.url, hasAudio: true }
            : g
        )
      );

      setSuccessMessage(`✅ Tạo audio thành công cho Group #${groupId}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Lỗi tạo audio");
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateAll = async () => {
    const ungeneratedGroups = groups.filter((g) => !g.hasAudio);
    if (ungeneratedGroups.length === 0) {
      setSuccessMessage("✅ Tất cả các nhóm đã có audio!");
      return;
    }

    for (const group of ungeneratedGroups) {
      await handleGenerateAudio(group.id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-gray-600">Đang tải danh sách Part {selectedPart}...</span>
      </div>
    );
  }

  const hasAudioCount = groups.filter((g) => g.hasAudio).length;
  const needsAudioCount = groups.length - hasAudioCount;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center">
            <Filter size={16} className="mr-1" />
            Xem Part:
          </span>
          {[1, 2, 3, 4].map((partNum) => (
            <button
              key={partNum}
              onClick={() => setSelectedPart(partNum)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedPart === partNum
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-600"
              }`}
            >
              Part {partNum}
            </button>
          ))}
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {selectedPart === 1 && "📸 Part 1: Mô tả tranh"}
            {selectedPart === 2 && "💬 Part 2: Hỏi - Đáp"}
            {selectedPart === 3 && "🗣️ Part 3: Hội thoại"}
            {selectedPart === 4 && "🎙️ Part 4: Bài nói"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Đã có audio: <span className="font-bold text-green-600">{hasAudioCount}</span> / {groups.length} nhóm
          </p>
        </div>
        
        <button
          onClick={handleGenerateAll}
          disabled={needsAudioCount === 0 || generating !== null}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Zap size={18} />
          {generating !== null ? "Đang xử lý..." : `Tạo Audio (${needsAudioCount})`}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <AlertCircle className="flex-shrink-0" size={20} />
          <div>{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          <CheckCircle className="flex-shrink-0" size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      {/* List Groups */}
      <div className="space-y-3">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 rounded">
                    #{group.id}
                  </span>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {selectedPart === 1 ? `Tranh số ${index + 1}` : `Nhóm ${index + 1}`}
                  </h3>
                </div>
                
                {/* Transcript Preview */}
                <div className="text-gray-600 dark:text-gray-400 text-sm font-mono bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-700 max-h-20 overflow-y-auto">
                  {group.transcript ? (
                    <span className="whitespace-pre-wrap">{group.transcript.substring(0, 150)}...</span>
                  ) : (
                    <span className="italic text-gray-400">Không có transcript (Chỉ có câu hỏi)</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0 self-start sm:self-center">
                {group.hasAudio && group.audioUrl ? (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => {
                        const audio = new Audio(group.audioUrl!);
                        audio.play();
                      }}
                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-md font-medium flex items-center gap-1.5 transition-colors text-sm"
                    >
                      <Play size={16} />
                      Nghe thử
                    </button>
                    <span className="text-xs text-green-600 flex items-center">
                      <CheckCircle size={12} className="mr-1" /> Đã có
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleGenerateAudio(group.id)}
                    disabled={generating === group.id}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium flex items-center gap-1.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {generating === group.id ? (
                      <Loader className="animate-spin" size={16} />
                    ) : (
                      <Zap size={16} />
                    )}
                    {generating === group.id ? "Đang tạo..." : "Tạo Audio"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có dữ liệu cho Part {selectedPart}. <br/>
            Vui lòng Import Excel trước.
          </p>
        </div>
      )}
    </div>
  );
}