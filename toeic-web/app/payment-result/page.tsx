"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentService } from "@/app/services/paymentService";
import { CheckCircle, XCircle, Loader } from "lucide-react";

type PaymentStatus = "loading" | "success" | "failed";

interface PaymentInfo {
  paymentId: number;
  transactionNo: string;
  status: string;
  message: string;
  amount: number;
  packageType: string;
  paidAt?: string;
}

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const orderId = searchParams.get("orderId");
      const paymentStatus = searchParams.get("status");

      console.log("[PaymentResult] orderId:", orderId, "status:", paymentStatus);

      if (!orderId) {
        console.error("[PaymentResult] No orderId found");
        setStatus("failed");
        return;
      }

      try {
        const data = await paymentService.getPaymentStatus(parseInt(orderId));
        console.log("[PaymentResult] Payment data:", data);
        setPayment(data);

        if (data.status === "SUCCESS") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("[PaymentResult] Error checking payment:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  // Countdown for auto-redirect
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        {status === "loading" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Loader className="animate-spin text-blue-600" size={48} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Đang kiểm tra trạng thái thanh toán...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Vui lòng đợi
            </p>
          </div>
        )}

        {status === "success" && payment && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle className="text-green-600 dark:text-green-400" size={48} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              ✅ Thanh Toán Thành Công!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Cảm ơn bạn đã nâng cấp lên Premium
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gói:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {payment.packageType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(payment.amount / 1000).toLocaleString("vi-VN")}k₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">
                  {payment.transactionNo}
                </span>
              </div>
              {payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(payment.paidAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Đang chuyển hướng trong <span className="font-bold text-blue-600">{countdown}</span> giây...
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Quay Về Dashboard Ngay
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
                <XCircle className="text-red-600 dark:text-red-400" size={48} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              ❌ Thanh Toán Thất Bại
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {payment?.message || "Vui lòng thử lại hoặc liên hệ hỗ trợ"}
            </p>

            {payment && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Mã lỗi:</span> {payment.status}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => router.push("/premium")}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              >
                Thử Lại
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-all"
              >
                Về Dashboard
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                💬 Nếu bạn cần trợ giúp, vui lòng <span className="font-semibold">liên hệ hỗ trợ</span> hoặc gửi email đến <span className="font-mono">support@toeicmaster.com</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
