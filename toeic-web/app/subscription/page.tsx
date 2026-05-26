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
  averagePriceLabel: string;
  badgeLabel?: string;
  savingsLabel?: string;
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
    durationLabel: "1 tháng",
    basePrice: 50000,
    originalPrice: 50000,
    averagePriceLabel: "50.000đ/tháng",
    badgeLabel: "Linh hoạt",
  },
  {
    planId: "premium_3m",
    durationLabel: "3 tháng",
    basePrice: 120000,
    originalPrice: 150000,
    averagePriceLabel: "40.000đ/tháng",
    badgeLabel: "Phổ biến",
    savingsLabel: "Tiết kiệm 30.000đ",
    popular: true,
  },
  {
    planId: "premium_12m",
    durationLabel: "12 tháng",
    basePrice: 360000,
    originalPrice: 600000,
    averagePriceLabel: "30.000đ/tháng",
    badgeLabel: "Tiết kiệm nhất",
    savingsLabel: "Tiết kiệm 240.000đ",
  },
];

const freeFeatures = [
  "Làm bài test TOEIC",
  "Xem điểm và đáp án",
  "Học ngữ pháp cơ bản",
  "Luyện từ vựng và luyện đọc",
  "Làm bài không giới hạn",
];

const proFeatures = [
  "Xem giải thích bài test chi tiết hơn",
  "Mở giải thích từ vựng đầy đủ hơn",
  "Mở giải thích ngữ pháp chi tiết hơn",
  "Theo dõi tiến độ học rõ hơn",
  "Hỗ trợ AI khi học bài",
  "Không có quảng cáo",
];

const comparisonRows = [
  { label: "Làm bài TOEIC", free: "Có", pro: "Có" },
  { label: "Xem điểm và đáp án", free: "Có", pro: "Có" },
  { label: "Giải thích bài test", free: "Một phần", pro: "Đầy đủ hơn" },
  { label: "Giải thích từ vựng", free: "Một phần", pro: "Chi tiết hơn" },
  { label: "Giải thích ngữ pháp", free: "Một phần", pro: "Chi tiết hơn" },
  { label: "Theo dõi tiến độ", free: "Cơ bản", pro: "Đầy đủ hơn" },
  { label: "Quảng cáo", free: "Có thể hiển thị", pro: "Không có" },
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
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-5 pointer-events-none" />

        <div className="text-center space-y-6 max-w-md p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/30 backdrop-blur-md shadow-sm relative z-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border-2 border-emerald-500 dark:border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <CheckCircle className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Thanh toán thành công</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Tài khoản PRO của bạn đã được kích hoạt. Bạn có thể quay lại luyện tập và xem các phần giải thích chi tiết hơn.
            </p>
          </div>
          <div className="pt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-500 text-xs bg-zinc-100 dark:bg-zinc-950/60 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800/80">
              <Loader className="w-3.5 h-3.5 animate-spin text-emerald-500 dark:text-emerald-400" />
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
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-10 pointer-events-none" />

        <div className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 flex items-center justify-between">
          <button
            onClick={resetPayment}
            className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all text-sm font-medium hover:-translate-x-0.5 duration-200"
          >
            <ArrowLeft className="w-4 h-4" /> Thay đổi gói
          </button>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm tracking-wide bg-amber-500/10 dark:bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-200 dark:border-amber-400/20">
            <Crown className="w-4 h-4" />
            PRO {selectedTier.durationLabel}
          </div>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Payment statuses & Details */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Custom status alerts */}
              <div className={`rounded-2xl p-5 flex items-start gap-4 border backdrop-blur-sm transition-all duration-300 ${
                paymentStatus === "PENDING"
                  ? "bg-amber-50/40 dark:bg-amber-500/[0.04] border-amber-200 dark:border-amber-500/20"
                  : "bg-red-50/40 dark:bg-red-500/[0.04] border-red-200 dark:border-red-500/20"
              }`}>
                {paymentStatus === "PENDING" ? (
                  <>
                    <div className="relative mt-0.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-950 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-amber-700 dark:text-amber-300 text-sm tracking-wide uppercase">Đang chờ xác nhận giao dịch</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                        Hệ thống PayOS đang theo dõi thanh toán tự động (Cập nhật sau mỗi 5 giây). Vui lòng không tắt trình duyệt này.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mt-0.5">
                      <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-red-700 dark:text-red-300 text-sm tracking-wide uppercase">Thanh toán thất bại</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                        Không thể xác nhận giao dịch. Vui lòng kiểm tra số tiền chuyển hoặc nhấn nút bên dưới để thử lại.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Steps guidelines */}
              <div className="bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight">Hướng dẫn thanh toán</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                      Mở ứng dụng Ngân hàng (Mobile Banking) hoặc Ví điện tử để quét mã QR code.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                      Quét mã QR PayOS hiển thị bên cạnh. Hệ thống sẽ tự động điền đúng số tiền và nội dung chuyển khoản.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                      Xác nhận thanh toán trên ứng dụng ngân hàng. Sau khi thành công, tài khoản PRO sẽ tự động được kích hoạt ngay lập tức.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction billing list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-zinc-50/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl px-5 py-4 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/60">
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Mã nội dung (Đơn hàng)</span>
                    <p className="text-zinc-900 dark:text-white font-mono font-bold text-base mt-0.5">{paymentSession.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentSession.description, "mã đơn hàng")}
                    className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-zinc-50/40 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl px-5 py-4 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-900/60">
                  <div>
                    <span className="text-amber-600 dark:text-amber-400/80 text-xs font-semibold uppercase tracking-wider">Số tiền chuyển khoản</span>
                    <p className="text-amber-600 dark:text-amber-400 font-extrabold text-xl mt-0.5">{selectedTier.basePrice.toLocaleString("vi-VN")}đ</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedTier.basePrice.toString(), "số tiền")}
                    className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 transition-all text-amber-600 dark:text-amber-400 hover:scale-105 active:scale-95"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {paymentSession.checkoutUrl && (
                  <a
                    href={paymentSession.checkoutUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full mt-4 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-zinc-950 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" /> Mở trang thanh toán PayOS
                  </a>
                )}
              </div>
            </div>

            {/* Right side: QR code card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
                <p className="text-zinc-600 dark:text-zinc-300 text-sm font-semibold mb-6">Quét mã QR dưới đây</p>

                {paymentSession.qrUrl ? (
                  <div className="relative inline-block bg-white rounded-2xl p-4 shadow-sm overflow-hidden border border-zinc-200 w-56 h-56">
                    <img src={paymentSession.qrUrl} alt="PayOS QR" className="w-full h-full rounded-xl relative z-10" />
                  </div>
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Mã QR chưa được khởi tạo. Vui lòng bấm vào nút thanh toán chi tiết.
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full text-xs">
                    <Shield className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    <span>PayOS bảo mật 256-bit</span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-[11px] leading-relaxed max-w-[220px]">
                    Đặt camera điện thoại song song với mã QR để hệ thống nhận diện nhanh hơn.
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
  const renderComparisonValue = (val: string, isPro: boolean) => {
    if (val === "Có" || val === "Không có") {
      return (
        <div className="flex items-center justify-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isPro 
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" 
              : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400"
          }`}>
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (val === "Có thể hiển thị" || val === "Một phần" || val === "Cơ bản") {
      return (
        <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium">
          {val}
        </span>
      );
    }
    if (val === "Đầy đủ hơn" || val === "Chi tiết hơn") {
      return (
        <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">
          {val}
        </span>
      );
    }
    return <span className="text-zinc-500 dark:text-zinc-400 text-xs">{val}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white relative overflow-hidden font-sans">
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-10 pointer-events-none" />

      {/* Sticky top-navigation */}
      <PageHeader/>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 relative z-10">
        
        {/* Header Hero Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" /> 
            TOEIC Masters PRO
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-sans">
            Mở thêm giải thích chi tiết khi luyện TOEIC
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tài khoản thường vẫn có thể luyện tập. <strong className="text-amber-600 dark:text-amber-400 font-semibold">PRO</strong> phù hợp khi bạn muốn xem giải thích đầy đủ hơn, học kỹ từng câu và theo dõi quá trình học rõ hơn.
          </p>
        </div>

        {/* Feature Overview side-by-side cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Free Card */}
          <section className="bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 font-semibold uppercase tracking-wider">Tài khoản thường</p>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">Free</h2>
                </div>
                <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-4 py-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400">Miễn phí</div>
              </div>
              <div className="space-y-3.5">
                {freeFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Check className="h-4 w-4 text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PRO Card */}
          <section className="relative rounded-2xl border border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.03] p-6 shadow-sm overflow-hidden transition-all duration-300">
            <div className="absolute right-6 top-6 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
              Khuyên dùng
            </div>
            
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-300/80 font-bold uppercase tracking-wider">Tài khoản nâng cao</p>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">PRO</h2>
              </div>
            </div>
            
            <div className="grid gap-3.5 sm:grid-cols-1">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-100 font-medium">
                  <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Detailed comparison grid */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20 backdrop-blur-sm overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr] border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <div>So sánh tính năng</div>
            <div className="text-center">Free</div>
            <div className="text-center text-amber-600 dark:text-amber-400">PRO</div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.5fr_0.8fr_0.8fr] px-6 py-4 text-sm transition-colors hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10">
                <div className="text-zinc-700 dark:text-zinc-300 font-medium">{row.label}</div>
                <div className="text-center">{renderComparisonValue(row.free, false)}</div>
                <div className="text-center font-bold">{renderComparisonValue(row.pro, true)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing selector Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-amber-600 dark:text-amber-400/80 text-xs font-bold uppercase tracking-widest">Bước 1: Chọn gói PRO</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Chọn thời hạn phù hợp. Sau khi thanh toán qua PayOS, tài khoản sẽ được kích hoạt tự động.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Shield className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              PayOS QR Code
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {subscriptionTiers.map((tier) => {
              const isSelected = selectedTier.planId === tier.planId;
              const isThreeMonths = tier.planId === "premium_3m";
              return (
                <button
                  key={tier.planId}
                  onClick={() => setSelectedTier(tier)}
                  className={`relative flex min-h-[200px] flex-col items-center justify-between rounded-2xl border-2 p-6 transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? isThreeMonths
                        ? "border-amber-500 dark:border-amber-400 bg-amber-500/[0.03] dark:bg-amber-400/[0.03] shadow-sm"
                        : "border-zinc-800 dark:border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/40"
                      : "border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  {tier.badgeLabel && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full whitespace-nowrap shadow-xs ${
                      isThreeMonths
                        ? "bg-amber-500 text-white dark:bg-amber-400 dark:text-zinc-950"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                    }`}>
                      {tier.badgeLabel}
                    </span>
                  )}
                  
                  <div className="text-center mt-2">
                    <p className="font-extrabold text-zinc-900 dark:text-white text-base tracking-wide">{tier.durationLabel}</p>
                  </div>
                  
                  <div className="my-3 flex flex-col items-center">
                    <div className="flex items-baseline gap-1.5 justify-center">
                      {tier.originalPrice > tier.basePrice && (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                          {tier.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                        {tier.basePrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                      {tier.averagePriceLabel}
                    </p>
                  </div>

                  <div className="text-center w-full">
                    {tier.savingsLabel ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        {tier.savingsLabel}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        Linh hoạt
                      </p>
                    )}
                  </div>

                  <div className={`mt-4 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? isThreeMonths
                        ? "bg-amber-500 dark:bg-amber-400 text-white dark:text-zinc-950"
                        : "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-950"
                      : "border border-zinc-300 dark:border-zinc-700"
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Order Payment Summary Card */}
        <section className="bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/5 blur-[80px] pointer-events-none" />
 
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between relative z-10">
            <div className="space-y-1">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Thanh toán hôm nay</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">{selectedTier.basePrice.toLocaleString("vi-VN")}đ</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">/ {selectedTier.durationLabel}</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Gói PRO {selectedTier.durationLabel} · Kích hoạt tự động qua PayOS
              </p>
            </div>
            {selectedTier.originalPrice > selectedTier.basePrice && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 shrink-0 self-start sm:self-center">
                <p className="text-zinc-500 text-xs line-through text-left sm:text-right">{selectedTier.originalPrice.toLocaleString("vi-VN")}đ</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mt-0.5">
                  Tiết kiệm ngay {(selectedTier.originalPrice - selectedTier.basePrice).toLocaleString("vi-VN")}đ
                </p>
              </div>
            )}
          </div>
 
          <button
            onClick={initiatePayment}
            disabled={loading}
            className="mt-6 w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-zinc-950 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Đang khởi tạo liên kết PayOS...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán {selectedTier.basePrice.toLocaleString("vi-VN")}đ</span>
              </>
            )}
          </button>
 
          <div className="mt-5 border-t border-zinc-200 dark:border-zinc-800/80 pt-5 grid gap-3 text-xs text-zinc-500 dark:text-zinc-400 sm:grid-cols-3">
            <div className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Cổng thanh toán PayOS</div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Kích hoạt tự động instant</div>
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Mở toàn bộ giải thích chi tiết</div>
          </div>
        </section>
 
        {/* Footer features listing info */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-500 pt-4 border-t border-zinc-200 dark:border-zinc-900">
          <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Giải thích bài test</span>
          <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" /> Từ vựng chi tiết</span>
          <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-4 w-4" /> Ngữ pháp Premium</span>
        </div>
      </div>
    </div>
  );
}
