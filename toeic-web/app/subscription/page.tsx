"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, CheckCircle, XCircle, Loader, Clock, Check, ArrowLeft, X, Crown, Lightbulb, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/app/contexts/AuthContext";

interface SubscriptionTier {
  duration: number;
  durationLabel: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  description: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/login");
    }
  }, [user, router]);
  // Subscription tiers
  const subscriptionTiers: SubscriptionTier[] = [
    {
      duration: 1,
      durationLabel: "1 Tháng",
      basePrice: 30000,
      originalPrice: 30000,
      discount: 0,
      description: "Unlimited Access",
    },
    {
      duration: 3,
      durationLabel: "3 Tháng",
      basePrice: 79000,
      originalPrice: 90000,
      discount: 12,
      description: "~12% tiết kiệm",
    },
    {
      duration: 6,
      durationLabel: "6 Tháng",
      basePrice: 149000,
      originalPrice: 180000,
      discount: 17,
      description: "~17% tiết kiệm",
    },
  ];

  const premiumBenefits = [
    "Mở khoá tất cả nội dung bài học",
    "Mở khoá tính năng nâng cao (trà từ điển, hỏi AI...)",
    "Không quảng cáo",
    "Ưu tiên hỗ trợ",
    "Trạng theo dõi tiếng độ học toàn hệ thống",
  ];

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(
    subscriptionTiers[0]
  );
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<
    NodeJS.Timeout | null
  >(null);

  // Step 1: Initiate payment and get QR code
  const initiatePayment = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/login");
        return;
      }

      console.log("Token:", token.substring(0, 20) + "..."); // Log first 20 chars of token

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: selectedTier.basePrice,
            description: `Premium ${selectedTier.durationLabel}`,
            duration: selectedTier.duration,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to initiate payment");
        return;
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setBankInfo(data.bankInfo);
      setTransactionId(data.transactionId);
      setPaymentStatus("PENDING");

      toast.success("Mã QR được tạo! Vui lòng hoàn tất chuyển khoản.");

      // Start polling for payment status
      startStatusPolling(data.transactionId);
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Poll for payment status
  const startStatusPolling = (txId: number) => {
    // Clear existing interval if any
    if (statusCheckInterval) clearInterval(statusCheckInterval);

    // Check immediately
    checkPaymentStatus(txId);

    // Then check every 5 seconds
    const interval = setInterval(() => {
      checkPaymentStatus(txId);
    }, 5000);

    setStatusCheckInterval(interval);
  };

  const checkPaymentStatus = async (txId: number) => {
    try {
      setCheckingStatus(true);
      const token = Cookies.get("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/status/${txId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to check status");
        return;
      }

      const data = await response.json();
      setPaymentStatus(data.status);

      // If payment is completed, stop polling and show success
      if (data.isPaid) {
        if (statusCheckInterval) clearInterval(statusCheckInterval);
        toast.success("Thanh toán thành công! ✅");
        setPaymentStatus("COMPLETED");
      }
    } catch (error) {
      console.error("Status check error:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // Reset payment to go back to tier selection
  const resetPayment = () => {
    setQrCode("");
    setBankInfo(null);
    setTransactionId(null);
    setPaymentStatus("PENDING");
    if (statusCheckInterval) clearInterval(statusCheckInterval);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, [statusCheckInterval]);

  // Handle success - redirect after payment confirmation
  useEffect(() => {
    if (paymentStatus === "COMPLETED") {
      const timer = setTimeout(() => {
        window.location.reload(); // Refresh user data
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-40">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Crown size={24} className="text-yellow-500" /> Thanh toán PRO Trọn đời
        </h2>
        <button
          onClick={handleGoBack}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-6">
          {!qrCode ? (
            <div className="space-y-6">
              {/* Benefits Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Crown size={20} className="text-yellow-500" /> Premium Benefits
                </h3>
                <ul className="space-y-3">
                  {premiumBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check
                        size={20}
                        className="text-green-500 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subscription Tiers */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Chọn gói của bạn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionTiers.map((tier) => (
                    <button
                      key={tier.duration}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        selectedTier.duration === tier.duration
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-800 hover:border-blue-300"
                      }`}
                    >
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {tier.durationLabel}
                        </h4>

                        {/* Price */}
                        <div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ₫{tier.basePrice.toLocaleString("vi-VN")}
                          </div>
                          {tier.discount > 0 && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 line-through">
                              ₫{tier.originalPrice.toLocaleString("vi-VN")}
                            </div>
                          )}
                        </div>

                        {/* Discount Badge */}
                        {tier.discount > 0 && (
                          <div className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Tiết kiệm ~{tier.discount}%
                          </div>
                        )}

                        {/* Check mark */}
                        {selectedTier.duration === tier.duration && (
                          <div className="flex justify-center">
                            <CheckCircle
                              size={24}
                              className="text-blue-500"
                            />
                          </div>
                        )}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} /> Tiếp tục thanh toán ₫
                    {selectedTier.basePrice.toLocaleString("vi-VN")}
                  </>
                )}
              </button>
            </div>
          ) : (
            // Step 2: Show QR and payment details
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={resetPayment}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center gap-2 text-sm mb-4"
              >
                <ArrowLeft size={16} /> Quay lại & chọn gói khác
              </button>
              {/* QR Code */}
              <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-xl text-center">
                <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
                  Quét mã QR hoặc nhập thông tin chuyển khoản
                </h3>
                {qrCode && (
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto border-2 border-gray-200 dark:border-zinc-700 rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  Nội dung chuyển khoản sẽ được điền tự động
                </p>
              </div>

              {/* Bank Info */}
              {bankInfo && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Thông tin chuyển khoản
                  </h3>

                  {/* Bank Name */}
                  <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Ngân hàng
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {bankInfo.bankName}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(bankInfo.bankName, "Bank name")
                        }
                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Số tài khoản
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                        {bankInfo.accountNumber}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            bankInfo.accountNumber,
                            "Account number"
                          )
                        }
                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Account Holder */}
                  <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Chủ tài khoản
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {bankInfo.accountHolder}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            bankInfo.accountHolder,
                            "Account holder"
                          )
                        }
                        className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <label className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      Số tiền
                    </label>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        ₫{selectedTier.basePrice.toLocaleString("vi-VN")}
                      </p>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedTier.basePrice.toString(), "Amount")
                        }
                        className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Section */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {paymentStatus === "PENDING" && (
                    <>
                      <Clock className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-yellow-700 dark:text-yellow-300">
                          Đang chờ xác nhận thanh toán
                        </h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                          Vui lòng hoàn tất chuyển khoản. Chúng tôi sẽ tự động
                          xác nhận trong vài phút.
                        </p>
                        {checkingStatus && (
                          <div className="flex items-center gap-2 mt-2 text-yellow-600 dark:text-yellow-400">
                            <Loader size={16} className="animate-spin" />
                            <span className="text-xs">Đang kiểm tra...</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {paymentStatus === "COMPLETED" && (
                    <>
                      <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-green-700 dark:text-green-300">
                          Thanh toán thành công! ✅
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Bạn đã nâng cấp lên tài khoản PRO. Tận hưởng tất cả
                          các tính năng!
                        </p>
                      </div>
                    </>
                  )}

                  {paymentStatus === "FAILED" && (
                    <>
                      <XCircle className="text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-red-700">
                          Thanh toán thất bại
                        </h4>
                        <p className="text-sm text-red-600">
                          Vui lòng thử lại hoặc liên hệ hỗ trợ.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Help Text */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <p className="font-semibold flex items-center gap-2"><Lightbulb size={16} className="text-blue-500" /> Hướng dẫn:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Mở ứng dụng ngân hàng của bạn</li>
                  <li>Chọn Chuyển tiền → Quét mã QR</li>
                  <li>Hoặc nhập thông tin tài khoản ở trên</li>
                  <li>Xác nhận giao dịch</li>
                </ol>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
