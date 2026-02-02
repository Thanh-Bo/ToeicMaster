"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import momoService from "@/app/services/momoService";
import { Check, Loader, Zap, QrCode } from "lucide-react";

interface Package {
  name: string;
  price: number;
  duration: number;
  pricePerMonth: number;
}

export default function PremiumPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadPackages();
  }, [authLoading, user, router]);

  const loadPackages = async () => {
    try {
      setLoadingPackages(true);
      setError(null);
      const data = await momoService.getPackages();
      setPackages(data);
    } catch (err) {
      console.error("Error loading packages:", err);
      setError("Không thể tải danh sách gói. Vui lòng thử lại.");
    } finally {
      setLoadingPackages(false);
    }
  };

  const handlePayment = async (packageType: string) => {
    try {
      setProcessingPayment(packageType);
      setError(null);
      console.log(`[Premium] Creating payment for: ${packageType}`);

      const response = await momoService.createPayment(packageType);

      if (response.success && response.paymentUrl) {
        console.log(`[Premium] Redirecting to MoMo: ${response.paymentUrl}`);
        
        // Nếu có QR code, hiển thị QR
        if (response.qrCode) {
          setQrCodeUrl(response.qrCode);
          setShowQR(true);
          // Lưu orderId
          sessionStorage.setItem("lastOrderId", response.orderId.toString());
        } else {
          // Chuyển hướng trực tiếp
          window.location.href = response.paymentUrl;
        }
      } else {
        setError("Không thể tạo link thanh toán");
      }
    } catch (err: any) {
      console.error("Error creating payment:", err);
      const errorMsg = err.response?.data?.message || "Lỗi tạo thanh toán";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setProcessingPayment(null);
    }
  };

  if (authLoading || loadingPackages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nâng Cấp Premium
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Truy cập đầy đủ tất cả các bài tập TOEIC, AI explanations, và tính năng nâng cao
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg, idx) => {
            const isBestValue = pkg.name === "Pro";
            const isMaster = pkg.name === "Master";

            return (
              <div
                key={idx}
                className={`rounded-xl shadow-lg transition-all hover:shadow-2xl hover:scale-105 overflow-hidden ${
                  isBestValue
                    ? "lg:scale-110 bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-blue-600"
                    : isMaster
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <div className="p-8">
                  {/* Package Name */}
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>

                  {/* Duration */}
                  <p className={`text-sm mb-4 ${isBestValue || isMaster ? "opacity-90" : "opacity-75"}`}>
                    {pkg.duration} tháng
                  </p>

                  {/* Badge */}
                  {isBestValue && (
                    <div className="mb-4 inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">
                      ⭐ BEST VALUE
                    </div>
                  )}
                  {isMaster && (
                    <div className="mb-4 inline-block px-3 py-1 bg-gold text-white text-sm font-semibold rounded-full">
                      👑 BEST FOR LONG TERM
                    </div>
                  )}

                  {/* Price */}
                  <div className={`${isBestValue || isMaster ? "" : "bg-gray-50 dark:bg-gray-700"} rounded-lg p-4 mb-6`}>
                    <div className="text-4xl font-bold mb-1">
                      {(pkg.price / 1000).toLocaleString("vi-VN")}k
                    </div>
                    <p className={`text-sm ${isBestValue || isMaster ? "opacity-90" : "opacity-75"}`}>
                      {(pkg.pricePerMonth / 1000).toLocaleString("vi-VN")}k/tháng
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePayment(pkg.name)}
                    disabled={processingPayment !== null}
                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 flex items-center justify-center gap-2 ${
                      isBestValue || isMaster
                        ? "bg-white text-blue-600 hover:bg-gray-100"
                        : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processingPayment === pkg.name ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      `Nâng Cấp Ngay`
                    )}
                  </button>

                  {/* Features */}
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Truy cập đầy đủ all tests</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 mt-0.5" />
                      <span>AI explanation unlimited</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Phân tích chi tiết từng câu</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Hỗ trợ 24/7</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Không quảng cáo</span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Câu Hỏi Thường Gặp
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                💳 Những phương thức thanh toán nào được hỗ trợ?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi hỗ trợ thanh toán qua VNPAY với các thẻ tín dụng/ghi nợ từ tất cả các ngân hàng tại Việt Nam.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔄 Tôi có thể hủy gói đăng ký bất cứ lúc nào không?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Có, bạn có thể hủy gói Premium bất cứ lúc nào. Bạn sẽ vẫn có quyền truy cập cho đến hết thời gian đã thanh toán.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ↩️ Có chính sách hoàn tiền không?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nếu bạn không hài lòng, liên hệ với team hỗ trợ trong 7 ngày đầu để yêu cầu hoàn tiền.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                👥 Ai sẽ giúp tôi nếu tôi có vấn đề?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Team hỗ trợ của chúng tôi sẵn sàng giúp đỡ 24/7. Liên hệ qua email hoặc chat support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
