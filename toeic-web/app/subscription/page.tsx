"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Crown,
  ExternalLink,
  Loader,
  Shield,
  Star,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/app/contexts/AuthContext";

interface SubscriptionTier {
  planId: string;
  durationLabel: string;
  basePrice: number;
  originalPrice: number;
  discount: number;
  description: string;
  popular?: boolean;
}

interface PaymentSession {
  transactionId: number;
  description: string;
  qrUrl?: string;
  qrCode?: string;
  checkoutUrl?: string;
  paymentLinkId?: string;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    planId: "premium_1m",
    durationLabel: "1 Tháng",
    basePrice: 30000,
    originalPrice: 30000,
    discount: 0,
    description: "Dùng thử",
  },
  {
    planId: "premium_3m",
    durationLabel: "3 Tháng",
    basePrice: 79000,
    originalPrice: 90000,
    discount: 12,
    description: "Phổ biến nhất",
    popular: true,
  },
  {
    planId: "premium_6m",
    durationLabel: "6 Tháng",
    basePrice: 149000,
    originalPrice: 180000,
    discount: 17,
    description: "Tiết kiệm nhất",
  },
];

const premiumBenefits = [
  { icon: <Zap className="w-4 h-4" />, text: "Mở khóa tất cả nội dung bài học" },
  { icon: <Star className="w-4 h-4" />, text: "Hỏi AI không giới hạn" },
  { icon: <Shield className="w-4 h-4" />, text: "Không quảng cáo" },
  { icon: <Crown className="w-4 h-4" />, text: "Ưu tiên hỗ trợ 24/7" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Theo dõi tiến độ toàn hệ thống" },
];

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5298").replace(/\/api\/v1\/?$/, "");

export default function PaymentPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(subscriptionTiers[1]);
  const [loading, setLoading] = useState(false);
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, [statusCheckInterval]);

  useEffect(() => {
    if (paymentStatus === "COMPLETED") {
      const timer = setTimeout(() => router.push("/"), 2500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, router]);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId: selectedTier.planId }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Lỗi tạo thanh toán PayOS");
        return;
      }

      const data = await response.json();
      setPaymentSession({
        transactionId: data.transactionId,
        description: data.description,
        qrUrl: data.qrUrl,
        qrCode: data.qrCode,
        checkoutUrl: data.checkoutUrl,
        paymentLinkId: data.paymentLinkId,
      });
      setPaymentStatus("PENDING");
      toast.success("Mã thanh toán PayOS đã sẵn sàng");
      startStatusPolling(data.transactionId);
    } catch {
      toast.error("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = (txId: number) => {
    if (statusCheckInterval) clearInterval(statusCheckInterval);
    checkPaymentStatus(txId);
    const interval = setInterval(() => checkPaymentStatus(txId), 5000);
    setStatusCheckInterval(interval);
  };

  const checkPaymentStatus = async (txId: number) => {
    try {
      setCheckingStatus(true);
      const token = Cookies.get("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/v1/payment/status/${txId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;

      const data = await response.json();
      setPaymentStatus(data.status);
      if (data.isPaid) {
        if (statusCheckInterval) clearInterval(statusCheckInterval);
        toast.success("Thanh toán thành công");
        await refreshUser();
        setPaymentStatus("COMPLETED");
      }
    } catch (error) {
      console.error("Status check error:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  const resetPayment = () => {
    setPaymentSession(null);
    setPaymentStatus("PENDING");
    if (statusCheckInterval) clearInterval(statusCheckInterval);
  };

  if (paymentStatus === "COMPLETED") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border-4 border-green-500">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Thanh toán thành công</h2>
          <p className="text-zinc-400">Tài khoản Premium của bạn đã được kích hoạt.</p>
          <div className="animate-pulse text-zinc-500 text-sm">Đang chuyển về trang chủ...</div>
        </div>
      </div>
    );
  }

  if (paymentSession) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <button onClick={resetPayment} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Chọn gói khác
          </button>
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Crown className="w-5 h-5" /> Premium {selectedTier.durationLabel}
          </div>
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
          <div className={`rounded-2xl p-4 flex items-center gap-3 border ${
            paymentStatus === "PENDING" ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30"
          }`}>
            {paymentStatus === "PENDING" ? (
              <>
                <div className="relative">
                  <Clock className="w-5 h-5 text-amber-400" />
                  {checkingStatus && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />}
                </div>
                <div>
                  <p className="font-semibold text-amber-300 text-sm">Đang chờ xác nhận PayOS</p>
                  <p className="text-amber-400/70 text-xs">Hệ thống tự động kiểm tra mỗi 5 giây</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-400" />
                <p className="font-semibold text-red-300 text-sm">Thanh toán thất bại. Vui lòng thử lại.</p>
              </>
            )}
          </div>

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
            <div className="bg-zinc-800 p-6 text-center border-b border-zinc-800">
              <p className="text-zinc-400 text-sm mb-4">Quét mã PayOS để thanh toán</p>
              {paymentSession.qrUrl ? (
                <div className="inline-block bg-white rounded-2xl p-3 shadow-2xl shadow-blue-500/20">
                  <img src={paymentSession.qrUrl} alt="PayOS QR" className="w-52 h-52 rounded-xl" />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-8 text-sm text-zinc-400">
                  Không có QR. Mở trang thanh toán PayOS bên dưới.
                </div>
              )}
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-4 py-3">
                <div>
                  <p className="text-zinc-500 text-xs">Mã đơn hàng</p>
                  <p className="text-white font-semibold text-sm mt-0.5">{paymentSession.description}</p>
                </div>
                <button onClick={() => copyToClipboard(paymentSession.description, "mã đơn hàng")} className="p-2 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3">
                <div>
                  <p className="text-blue-400/70 text-xs">Số tiền</p>
                  <p className="text-blue-300 font-bold text-lg">₫{selectedTier.basePrice.toLocaleString("vi-VN")}</p>
                </div>
                <button onClick={() => copyToClipboard(selectedTier.basePrice.toString(), "số tiền")} className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors text-blue-400">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {paymentSession.checkoutUrl && (
                <a
                  href={paymentSession.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Mở trang thanh toán PayOS
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span>Nâng cấp Premium</span>
        </div>
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors">
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full px-4 py-1.5 text-sm font-semibold">
            <Crown className="w-4 h-4" /> Premium
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Học TOEIC không giới hạn
          </h1>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            Mở khóa toàn bộ tính năng và tăng tốc hành trình đạt điểm cao
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {premiumBenefits.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-700 transition-colors">
              <span className="text-blue-400">{icon}</span>
              <span className="text-zinc-300 text-sm">{text}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-zinc-400 text-sm font-semibold mb-4 uppercase tracking-wider">Chọn gói của bạn</p>
          <div className="grid grid-cols-3 gap-3">
            {subscriptionTiers.map((tier) => {
              const isSelected = selectedTier.planId === tier.planId;
              return (
                <button
                  key={tier.planId}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10" : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Phổ biến
                    </span>
                  )}
                  <p className="font-bold text-white text-base mt-1">{tier.durationLabel}</p>
                  <p className="text-2xl font-extrabold text-blue-400 mt-2">₫{tier.basePrice.toLocaleString("vi-VN")}</p>

                  {tier.discount > 0 ? (
                    <>
                      <p className="text-xs text-zinc-600 line-through mt-0.5">₫{tier.originalPrice.toLocaleString("vi-VN")}</p>
                      <span className="mt-2 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                        -{tier.discount}%
                      </span>
                    </>
                  ) : (
                    <p className="text-xs text-zinc-500 mt-1">{tier.description}</p>
                  )}

                  {isSelected && (
                    <div className="mt-3 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-white mt-0.5">₫{selectedTier.basePrice.toLocaleString("vi-VN")}</p>
            <p className="text-zinc-500 text-xs mt-0.5">Premium {selectedTier.durationLabel} · Thanh toán qua PayOS</p>
          </div>
          {selectedTier.discount > 0 && (
            <div className="text-right">
              <p className="text-zinc-600 text-xs line-through">₫{selectedTier.originalPrice.toLocaleString("vi-VN")}</p>
              <p className="text-green-400 font-bold text-sm mt-0.5">
                Tiết kiệm ₫{(selectedTier.originalPrice - selectedTier.basePrice).toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={initiatePayment}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <><Loader className="w-5 h-5 animate-spin" /> Đang tạo thanh toán PayOS...</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Thanh toán ngay · ₫{selectedTier.basePrice.toLocaleString("vi-VN")}</>
          )}
        </button>

        <p className="text-center text-zinc-600 text-xs">
          Thanh toán an toàn qua PayOS · Xác nhận tự động bằng webhook
        </p>
      </div>
    </div>
  );
}
