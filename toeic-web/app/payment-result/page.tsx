import { Suspense } from "react";
import PaymentResultContent from "./payment-result-content";
import { Loader } from "lucide-react";

function PaymentLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
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
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentLoadingFallback />}>
      <PaymentResultContent />
    </Suspense>
  );
}
