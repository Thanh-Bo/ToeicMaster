"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Crown,
  ExternalLink,
  Loader,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  X,
  XCircle,
  Lock,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/app/contexts/AuthContext";
import { PageHeader } from "../components";

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
    description: "Gói dùng thử",
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
    description: "Tiết kiệm tối đa",
  },
];

const freeFeatures = [
  "Làm bài test miễn phí",
  "Xem điểm và đáp án",
  "Học grammar lesson",
  "Luyện tập grammar cơ bản",
  "Một số phần giải thích bị khóa",
];

const premiumFeatures = [
  "Mở khóa toàn bộ giải thích bài test",
  "Mở khóa chi tiết Vocabulary",
  "Mở khóa giải thích Grammar Premium",
  "Hỏi trợ lý AI không giới hạn",
  "Hoàn toàn không có quảng cáo",
  "Theo dõi tiến trình học chi tiết",
];

const comparisonRows = [
  { label: "Làm bài thi thử TOEIC", free: "Có", premium: "Có" },
  { label: "Xem đáp án đúng/sai", free: "Có", premium: "Có" },
  { label: "Giải thích chi tiết bài thi", free: "Một phần", premium: "Không giới hạn" },
  { label: "Giải thích Từ vựng chuyên sâu", free: "Một phần", premium: "Không giới hạn" },
  { label: "Giải thích Ngữ pháp nâng cao", free: "Một phần", premium: "Không giới hạn" },
  { label: "Trợ lý học tập AI", free: "Giới hạn", premium: "Không giới hạn" },
  { label: "Quảng cáo hiển thị", free: "Có", premium: "Không" },
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

  // Modern success screen
  if (paymentStatus === "COMPLETED") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        <div className="text-center space-y-6 max-w-md p-8 rounded-3xl border border-emerald-500/20 bg-zinc-900/30 backdrop-blur-md shadow-2xl relative z-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Thanh toán thành công</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tài khoản Premium của bạn đã được kích hoạt. Hãy trải nghiệm toàn bộ tính năng độc quyền để bứt phá điểm số TOEIC ngay hôm nay!
            </p>
          </div>
          <div className="pt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-500 text-xs bg-zinc-950/60 px-4 py-2 rounded-full border border-zinc-800/80">
              <Loader className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Đang chuyển hướng về trang chủ...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern QR / payment screen
  if (paymentSession) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
        {/* Background glow animations */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Custom scanner keyframe styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0%, 100% { transform: translateY(0); opacity: 0.6; }
            50% { transform: translateY(198px); opacity: 0.6; }
          }
          .scanner-line {
            animation: scan 2.5s ease-in-out infinite;
          }
        ` }} />

        <div className="sticky top-0 z-40 bg-zinc-950/70 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between">
          <button
            onClick={resetPayment}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-sm font-medium hover:-translate-x-0.5 duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Thay đổi gói
          </button>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm tracking-wide bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <Crown className="w-4 h-4 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
            Premium {selectedTier.durationLabel}
          </div>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Payment statuses & Details */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Custom status alerts */}
              <div className={`rounded-3xl p-5 flex items-start gap-4 border backdrop-blur-sm transition-all duration-300 ${
                paymentStatus === "PENDING"
                  ? "bg-amber-500/[0.04] border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.02)]"
                  : "bg-red-500/[0.04] border-red-500/20"
              }`}>
                {paymentStatus === "PENDING" ? (
                  <>
                    <div className="relative mt-0.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-zinc-950 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-amber-300 text-sm tracking-wide uppercase">Đang chờ xác nhận giao dịch</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Hệ thống PayOS đang theo dõi thanh toán tự động (Cập nhật sau mỗi 5 giây). Vui lòng không tắt trình duyệt này.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center mt-0.5">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-red-300 text-sm tracking-wide uppercase">Thanh toán thất bại</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed">
                        Không thể xác nhận giao dịch. Vui lòng kiểm tra số tiền chuyển hoặc nhấn nút bên dưới để thử lại.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Steps guidelines */}
              <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-6 space-y-5">
                <h3 className="font-bold text-white text-base tracking-tight">Hướng dẫn thanh toán nhanh</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Mở ứng dụng Ngân hàng (Mobile Banking) hoặc Ví điện tử hỗ trợ quét mã QR code.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Quét mã QR PayOS hiển thị ở khung bên cạnh. Hệ thống sẽ tự điền đúng số tiền và nội dung chuyển khoản.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      Xác nhận thanh toán trên ứng dụng ngân hàng. Sau khi thành công, tài khoản Premium sẽ tự động kích hoạt ngay lập tức.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction billing list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/60 rounded-2xl px-5 py-4 transition-colors hover:bg-zinc-900/60">
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Mã nội dung (Đơn hàng)</span>
                    <p className="text-white font-mono font-bold text-base mt-0.5">{paymentSession.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentSession.description, "mã đơn hàng")}
                    className="p-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 hover:text-white transition-all text-zinc-400 hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/60 rounded-2xl px-5 py-4 transition-colors hover:bg-zinc-900/60">
                  <div>
                    <span className="text-amber-400/80 text-xs font-semibold uppercase tracking-wider">Số tiền chuyển khoản</span>
                    <p className="text-amber-400 font-extrabold text-xl mt-0.5">₫{selectedTier.basePrice.toLocaleString("vi-VN")}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedTier.basePrice.toString(), "số tiền")}
                    className="p-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 transition-all text-amber-400 hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {paymentSession.checkoutUrl && (
                  <a
                    href={paymentSession.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                  className="w-full mt-4 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide shadow-lg active:scale-[0.99]"
                  >
                    <ExternalLink className="w-4 h-4" /> HOẶC MỞ TRANG THANH TOÁN PAYOS
                  </a>
                )}
              </div>
            </div>

            {/* Right side: QR code card with modern visuals */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                <p className="text-zinc-300 text-sm font-semibold mb-6">Quét mã QR dưới đây</p>

                {paymentSession.qrUrl ? (
                  <div className="relative inline-block bg-white rounded-3xl p-4 shadow-2xl overflow-hidden border border-zinc-200 w-56 h-56">
                    {/* Glowing scanner red laser line */}
                    <div className="absolute left-0 right-0 h-0.5 bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.8)] scanner-line pointer-events-none z-20" />
                    <img src={paymentSession.qrUrl} alt="PayOS QR" className="w-full h-full rounded-2xl relative z-10" />
                  </div>
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 text-xs text-zinc-500 leading-relaxed">
                    Mã QR chưa được khởi tạo. Vui lòng bấm vào nút thanh toán chi tiết.
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-zinc-950/60 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-xs">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>PayOS bảo mật 256-bit</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] leading-relaxed max-w-[220px]">
                    Đặt máy ảnh vuông góc để hệ thống nhận diện nhanh hơn.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Visual Helper function to render status values inside Comparison Table
  const renderComparisonValue = (val: string, isPremium: boolean) => {
    if (val === "Có") {
      return (
        <div className="flex items-center justify-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isPremium ? "bg-amber-400/10 text-amber-400" : "bg-zinc-800 text-zinc-400"}`}>
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (val === "Không giới hạn") {
      return (
        <div className="flex items-center justify-center gap-1">
          <span className="text-amber-400 font-semibold tracking-wide text-xs">Vô hạn</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        </div>
      );
    }
    if (val === "Không") {
      return (
        <div className="flex items-center justify-center">
          {/* Muted indicator showing No ads */}
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (val === "Một phần" || val === "Giới hạn") {
      return (
        <div className="flex items-center justify-center gap-1 text-zinc-500 text-xs">
          <Lock className="w-3 h-3" />
          <span>{val}</span>
        </div>
      );
    }
    return <span className="text-zinc-500">{val}</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden font-sans">
      {/* Decorative Radial Shadows */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[35%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[45%] h-[40%] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Sticky top-navigation */}
      <PageHeader/>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">
        
        {/* Header Hero Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider mb-2 shadow-md">
            <Crown className="w-3.5 h-3.5 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /> 
            Trải nghiệm hoàn hảo
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
            Học TOEIC Không Giới Hạn
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Free để xây dựng nền tảng ban đầu. <strong className="text-amber-400 font-semibold">Premium</strong> để mở toàn bộ giải thích chi tiết, mở khóa AI hỗ trợ và tăng tốc cán mốc điểm mục tiêu.
          </p>
        </div>

        {/* Feature Overview side-by-side cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Free Card */}
          <section className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-800">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Gói cơ bản</p>
                  <h2 className="text-2xl font-bold text-white mt-0.5">Free</h2>
                </div>
                <div className="rounded-2xl bg-zinc-800/50 border border-zinc-800 px-4 py-1.5 text-sm font-semibold text-zinc-400">₫0</div>
              </div>
              <div className="space-y-3.5">
                {freeFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Premium Card with Golden Glow */}
          <section className="relative rounded-3xl border border-amber-500/30 bg-amber-500/[0.04] p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-amber-400/50">
            <div className="absolute right-6 top-6 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-black px-3 py-1 uppercase tracking-wider shadow-md">
              Khuyên dùng
            </div>
            
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Đầy đủ quyền lợi</p>
                <h2 className="text-2xl font-black text-white">Premium</h2>
              </div>
            </div>
            
            <div className="grid gap-3.5 sm:grid-cols-2">
              {premiumFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-sm text-zinc-100 font-medium">
                  <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Detailed comparison grid */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm overflow-hidden shadow-lg">
          <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr] border-b border-zinc-800 bg-zinc-900/60 px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <div>So sánh tính năng</div>
            <div className="text-center">Free</div>
            <div className="text-center text-amber-400">Premium</div>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.5fr_0.8fr_0.8fr] px-6 py-4 text-sm transition-colors hover:bg-zinc-900/10">
                <div className="text-zinc-300 font-medium">{row.label}</div>
                <div className="text-center">{renderComparisonValue(row.free, false)}</div>
                <div className="text-center font-bold">{renderComparisonValue(row.premium, true)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing selector Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-amber-400/80 text-xs font-black uppercase tracking-widest">Bước 1: Chọn gói đăng ký</p>
              <p className="text-sm text-zinc-400">Mua một lần sử dụng, tự động kích hoạt siêu tốc sau khi xác nhận chuyển khoản.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              PayOS QR Code
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {subscriptionTiers.map((tier) => {
              const isSelected = selectedTier.planId === tier.planId;
              return (
                <button
                  key={tier.planId}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative flex min-h-[190px] flex-col items-center justify-center rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/[0.04] shadow-lg shadow-amber-500/5"
                      : "border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full whitespace-nowrap shadow-md">
                      Phổ biến
                    </span>
                  )}
                  <p className="font-extrabold text-white text-base tracking-wide">{tier.durationLabel}</p>
                  
                  <p className="text-3xl font-black text-amber-400 mt-3">
                    ₫{tier.basePrice.toLocaleString("vi-VN")}
                  </p>

                  {tier.discount > 0 ? (
                    <div className="mt-2 flex flex-col items-center gap-1.5">
                      <p className="text-[11px] text-zinc-500 line-through">₫{tier.originalPrice.toLocaleString("vi-VN")}</p>
                      <span className="bg-emerald-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Tiết kiệm {tier.discount}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 mt-2 font-medium">{tier.description}</p>
                  )}

                  {isSelected && (
                    <div className="mt-4 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Order Payment Summary Card */}
        <section className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Tổng giá trị thanh toán</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">₫{selectedTier.basePrice.toLocaleString("vi-VN")}</span>
                <span className="text-xs text-zinc-400 font-medium">/ {selectedTier.durationLabel}</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Gói Premium {selectedTier.durationLabel} · Kích hoạt qua cổng PayOS
              </p>
            </div>
            {selectedTier.discount > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3 shrink-0 self-start sm:self-center">
                <p className="text-zinc-500 text-xs line-through text-left sm:text-right">₫{selectedTier.originalPrice.toLocaleString("vi-VN")}</p>
                <p className="text-emerald-400 font-bold text-sm mt-0.5">
                  Tiết kiệm ngay ₫{(selectedTier.originalPrice - selectedTier.basePrice).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={initiatePayment}
            disabled={loading}
            className="mt-6 w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-zinc-950 font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Đang khởi tạo liên kết PayOS...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Mở khóa Premium · ₫{selectedTier.basePrice.toLocaleString("vi-VN")}</span>
              </>
            )}
          </button>

          <div className="mt-5 border-t border-zinc-800/80 pt-5 grid gap-3 text-xs text-zinc-400 sm:grid-cols-3">
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-amber-400" /> Cổng thanh toán PayOS</div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /> Kích hoạt tự động instant</div>
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400" /> Mở toàn bộ giải đáp chi tiết</div>
          </div>
        </section>

        {/* Footer features listing info */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Giải thích bài test</span>
          <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" /> Từ vựng chi tiết</span>
          <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> Ngữ pháp Premium</span>
        </div>
      </div>
    </div>
  );
}
