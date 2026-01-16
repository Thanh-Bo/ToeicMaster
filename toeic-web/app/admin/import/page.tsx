"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminService } from "@/app/services/adminService";
import { useAuth } from "@/app/contexts/AuthContext";
import { Upload, FileUp, Settings, ArrowLeft, Filter } from "lucide-react";
import { AdminTest } from "@/app/types";
import ListeningAudioManager from "@/app/components/listening/ListeningAudioManager";

export default function ImportManagementPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState<AdminTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  
  // State mới: Chọn Part để Import
  const [selectedPart, setSelectedPart] = useState<number>(3); // Mặc định Part 3

  const [pageLoading, setPageLoading] = useState(true);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Chờ AuthContext load xong mới check auth
    if (loading) return;

    const isAdmin = user && user.role && user.role.toLowerCase() === "admin";
    if (!user || !isAdmin) {
      router.push("/");
      return;
    }
    
    setPageLoading(false);
    loadTests();
  }, [user, loading, router]);

  const loadTests = async () => {
    try {
      setPageLoading(true);
      const data = await adminService.getTests();
      setTests(data);
    } catch (error) {
      console.error("Lỗi tải danh sách đề:", error);
      setTests([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setUploadMessage(null);
    }
  };

  const handleUploadExcel = async () => {
    if (!excelFile || !selectedTestId) {
      setUploadMessage({
        type: "error",
        text: "Vui lòng chọn file Excel và đề thi",
      });
      return;
    }

    try {
      setUploading(true);
      const response = await adminService.importPartData(
        selectedTestId,
        selectedPart,
        excelFile
      );

      setUploadMessage({
        type: "success",
        text: response.message || `✅ Import Part ${selectedPart} thành công!`,
      });

      setExcelFile(null);
      const fileInput = document.getElementById("excelFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setUploadMessage({
        type: "error",
        text: error.response?.data?.error || error.message || "Lỗi upload file",
      });
    } finally {
      setUploading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin mb-4 text-blue-600">
             <Settings size={32} />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Import & Tạo Audio (Listening)
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Hỗ trợ Part 1, 2, 3, 4
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI: UPLOAD SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-t-4 border-blue-500 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Upload size={24} className="text-blue-500" />
                Bước 1: Import Excel
              </h2>

              <div className="space-y-4">
                {/* 1. Chọn Đề thi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn đề thi
                  </label>
                  <select
                    value={selectedTestId || ""}
                    onChange={(e) => setSelectedTestId(parseInt(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Chọn đề thi --</option>
                    {tests.map((test) => (
                      <option key={test.id} value={test.id}>
                        {test.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Chọn Part (MỚI THÊM) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn phần thi (Part)
                  </label>
                  <select
                    value={selectedPart}
                    onChange={(e) => setSelectedPart(parseInt(e.target.value))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={1}>Part 1: Photographs (Mô tả tranh)</option>
                    <option value={2}>Part 2: Question-Response (Hỏi đáp)</option>
                    <option value={3}>Part 3: Conversations (Hội thoại)</option>
                    <option value={4}>Part 4: Talks (Bài nói)</option>
                  </select>
                </div>

                {/* 3. Chọn File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn file Excel
                  </label>
                  <input
                    id="excelFile"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lưu ý: Format Excel mỗi Part có thể khác nhau.
                  </p>
                </div>

                {/* Nút Upload */}
                <button
                  onClick={handleUploadExcel}
                  disabled={!excelFile || !selectedTestId || uploading}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FileUp size={20} />
                  {uploading ? "Đang upload..." : `Import Part ${selectedPart}`}
                </button>

                {/* Thông báo */}
                {uploadMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm font-medium ${
                      uploadMessage.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {uploadMessage.text}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: QUẢN LÝ AUDIO */}
          <div className="lg:col-span-2">
            {selectedTestId ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FileUp size={24} className="text-green-500" />
                  Bước 2: Tạo Audio & Quản lý
                </h2>
                {/* Gọi Component quản lý chung cho các Part */}
                <ListeningAudioManager testId={selectedTestId} />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <Settings size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">
                  Vui lòng chọn đề thi từ cột bên trái
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}