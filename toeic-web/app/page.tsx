"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { testService } from "./services/testService";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// 1. Định nghĩa kiểu dữ liệu cho gọn gàng
interface TestSummary {
  id: number;
  title: string;
  duration: number;
  totalQuestions: number;
}

export default function HomePage() {
  const router = useRouter();
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // 2. Thêm state để quản lý Loading và Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check User
    const userCookie = Cookies.get("user");
    if (userCookie) setUser(JSON.parse(userCookie));

    // Gọi API
    testService.getList()
      .then((res) => {
        // Giả sử API trả về { data: [...] }
        setTests(res.data.data || []); 
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
      })
      .finally(() => {
        // Dù thành công hay thất bại thì cũng tắt loading
        setLoading(false);
      });
  }, []);

  // 3. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // Xóa cookie
    Cookies.remove("token");
    Cookies.remove("user");
    
    // Xóa state user hiện tại
    setUser(null);
    
    // Tải lại trang để reset mọi thứ sạch sẽ
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* HEADER */}
      <header className="bg-white shadow p-4 mb-8 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700 hover:opacity-80">
            TOEIC Master
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Xin chào,</p>
                <p className="font-bold text-gray-800">{user.fullName}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-sm bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-200 transition font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="space-x-3">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                Đăng nhập
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thư viện đề thi</h2>
            <p className="text-gray-500">Chọn một đề thi để bắt đầu luyện tập ngay.</p>
        </div>

        {/* 4. Xử lý hiển thị theo trạng thái */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
             ⏳ Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg border border-red-200">
             ❌ {error}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-lg shadow">
             📭 Hiện chưa có đề thi nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2" title={test.title}>
                    {test.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            ⏱ {test.duration}p
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            📝 {test.totalQuestions} câu
                        </span>
                    </div>
                </div>
                
                <Link 
                  href={`/tests/${test.id}`} 
                  className="block w-full text-center bg-blue-50 text-blue-700 font-bold py-2.5 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Làm bài ngay →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}