"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Copy, CheckCircle, XCircle, Loader, Clock, Check,
  ArrowLeft, X, Crown, Lightbulb, CreditCard, Zap, Shield, Star
} from "lucide-react";
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
  popular?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    duration: 1,
    durationLabel: "1 Tháng",
    basePrice: 30000,
    originalPrice: 30000,
    discount: 0,
    description: "Dùng thử",
  },
  {
    duration: 3,
    durationLabel: "3 Tháng",
    basePrice: 79000,
    originalPrice: 90000,
    discount: 12,
    description: "Phổ biến nhất",
    popular: true,
  },
  {
    duration: 6,
    durationLabel: "6 Tháng",
    basePrice: 149000,
    originalPrice: 180000,
    discount: 17,
    description: "Tiết kiệm nhất",
  },
];

const premiumBenefits = [
  { icon: <Zap className="w-4 h-4" />, text: "Mở khoá tất cả nội dung bài học" },
  { icon: <Star className="w-4 h-4" />, text: "Hỏi AI không giới hạn" },
  { icon: <Shield className="w-4 h-4" />, text: "Không quảng cáo" },
  { icon: <Crown className="w-4 h-4" />, text: "Ưu tiên hỗ trợ 24/7" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "Theo dõi tiến độ toàn hệ thống" },
];

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/login");
    }
  }, [user, router]);

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(subscriptionTiers[1]);
  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("PENDING");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const initiatePayment = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) { toast.error("Vui lòng đăng nhập"); router.push("/login"); return; }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: selectedTier.basePrice, description: `Premium ${selectedTier.durationLabel}`, duration: selectedTier.duration }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Lỗi tạo thanh toán");
        return;
      }

      const data = await response.json();
      setQrUrl(data.qrUrl);
      setBankInfo(data.bankInfo);
      setTransactionId(data.transactionId);
      setPaymentStatus("PENDING");
      toast.success("Mã QR đã sẵn sàng! 🎉");
      startStatusPolling(data.transactionId);
    } catch (error) {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/status/${txId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setPaymentStatus(data.status);
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const resetPayment = () => {
    setQrUrl("");
    setBankInfo(null);
    setTransactionId(null);
    setPaymentStatus("PENDING");
    if (statusCheckInterval) clearInterval(statusCheckInterval);
  };

  useEffect(() => {
    return () => { if (statusCheckInterval) clearInterval(statusCheckInterval); };
  }, [statusCheckInterval]);

  useEffect(() => {
    if (paymentStatus === "COMPLETED") {
      const timer = setTimeout(() => router.push("/"), 2500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, router]);

  // ─── PAYMENT COMPLETED ────────────────────────────────────
  if (paymentStatus === "COMPLETED") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto border-4 border-green-500">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Thanh toán thành công!</h2>
          <p className="text-zinc-400">Tài khoản Premium của bạn đã được kích hoạt 🎉</p>
          <div className="animate-pulse text-zinc-500 text-sm">Đang chuyển về trang chủ...</div>
        </div>
      </div>
    );
  }

  // ─── QR PAYMENT VIEW ─────────────────────────────────────
  if (qrUrl) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
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
          {/* Status banner */}
          <div className={`rounded-2xl p-4 flex items-center gap-3 border ${
            paymentStatus === "PENDING"
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-red-500/10 border-red-500/30"
          }`}>
            {paymentStatus === "PENDING" ? (
              <>
                <div className="relative">
                  <Clock className="w-5 h-5 text-amber-400" />
                  {checkingStatus && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-amber-300 text-sm">Đang chờ xác nhận</p>
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

          {/* QR Card */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6 text-center border-b border-zinc-800">
              <p className="text-zinc-400 text-sm mb-4">Quét mã để thanh toán</p>
              <div className="inline-block bg-white rounded-2xl p-3 shadow-2xl shadow-blue-500/20">
                <img src={qrUrl} alt="VietQR" className="w-52 h-52 rounded-xl" />
              </div>
              <p className="text-zinc-500 text-xs mt-3">Hỗ trợ tất cả ứng dụng ngân hàng Việt Nam</p>
            </div>

            {/* Bank Details */}
            {bankInfo && (
              <div className="p-5 space-y-3">
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">Thông tin chuyển khoản</p>

                {[
                  { label: "Ngân hàng", value: bankInfo.bankName },
                  { label: "Số tài khoản", value: bankInfo.accountNumber, mono: true },
                  { label: "Chủ tài khoản", value: bankInfo.accountHolder },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex items-center justify-between bg-zinc-800/60 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-zinc-500 text-xs">{label}</p>
                      <p className={`text-white font-semibold text-sm mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
                    </div>
                    <button onClick={() => copyToClipboard(value, label)} className="p-2 rounded-lg hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Amount highlight */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-blue-400/70 text-xs">Số tiền</p>
                    <p className="text-blue-300 font-bold text-lg">₫{selectedTier.basePrice.toLocaleString("vi-VN")}</p>
                  </div>
                  <button onClick={() => copyToClipboard(selectedTier.basePrice.toString(), "Số tiền")} className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors text-blue-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Guide */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4">
            <p className="text-zinc-400 text-xs font-semibold flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-blue-400" /> Hướng dẫn
            </p>
            <ol className="space-y-2">
              {[
                "Mở ứng dụng ngân hàng của bạn",
                "Chọn Chuyển tiền → Quét mã QR",
                "Hoặc nhập thủ công thông tin trên",
                "Xác nhận giao dịch"
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // ─── TIER SELECTION VIEW ────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
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
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full px-4 py-1.5 text-sm font-semibold">
            <Crown className="w-4 h-4" /> Premium
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Học TOEIC không giới hạn
          </h1>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            Mở khoá toàn bộ tính năng và tăng tốc hành trình đạt điểm cao
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {premiumBenefits.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-700 transition-colors">
              <span className="text-blue-400">{icon}</span>
              <span className="text-zinc-300 text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div>
          <p className="text-zinc-400 text-sm font-semibold mb-4 uppercase tracking-wider">Chọn gói của bạn</p>
          <div className="grid grid-cols-3 gap-3">
            {subscriptionTiers.map((tier) => {
              const isSelected = selectedTier.duration === tier.duration;
              return (
                <button
                  key={tier.duration}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Phổ biến
                    </span>
                  )}

                  <p className="font-bold text-white text-base mt-1">{tier.durationLabel}</p>

                  <p className="text-2xl font-extrabold text-blue-400 mt-2">
                    ₫{tier.basePrice.toLocaleString("vi-VN")}
                  </p>

                  {tier.discount > 0 ? (
                    <>
                      <p className="text-xs text-zinc-600 line-through mt-0.5">
                        ₫{tier.originalPrice.toLocaleString("vi-VN")}
                      </p>
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

        {/* Price summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm">Tổng thanh toán</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              ₫{selectedTier.basePrice.toLocaleString("vi-VN")}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">Premium {selectedTier.durationLabel} · Thanh toán một lần</p>
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

        {/* CTA */}
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <><Loader className="w-5 h-5 animate-spin" /> Đang tạo mã QR...</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Thanh toán ngay · ₫{selectedTier.basePrice.toLocaleString("vi-VN")}</>
          )}
        </button>

        <p className="text-center text-zinc-600 text-xs">
          🔒 Thanh toán an toàn qua VietQR · Xác nhận tự động trong vài phút
        </p>
      </div>
    </div>
  );
}
