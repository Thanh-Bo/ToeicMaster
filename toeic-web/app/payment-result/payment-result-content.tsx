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

export default function PaymentResultContent() {
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
        console.error("[PaymentResult] Error checking payment status:", error);
        setStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  useEffect(() => {
    if (status !== "loading" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && status !== "loading") {
      router.push("/");
    }
  }, [countdown, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-6 py-8 bg-white rounded-2xl shadow-lg">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-6">
            <Loader className="w-16 h-16 text-blue-500 animate-spin" />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Processing Payment
            </h2>
            <p className="text-center text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Payment Successful!
            </h2>
            <div className="w-full bg-gray-50 rounded-lg p-4 space-y-3">
              {payment && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction No:</span>
                    <span className="font-semibold text-gray-800">
                      {payment.transactionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-800">
                      ${payment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold text-gray-800">
                      {payment.packageType}
                    </span>
                  </div>
                  {payment.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold text-gray-800">
                        {new Date(payment.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-center text-gray-600">
              Redirecting to home page in {countdown} seconds...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-6">
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Payment Failed
            </h2>
            <div className="w-full bg-red-50 rounded-lg p-4">
              <p className="text-center text-red-700">
                {payment?.message ||
                  "An error occurred while processing your payment. Please try again."}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Try Again
            </button>
            <p className="text-center text-gray-600">
              Redirecting to home page in {countdown} seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
