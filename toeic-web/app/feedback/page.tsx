"use client";

import { PageHeader, Footer } from "../components/layout";
import FeedbackForm from "../components/feedback/FeedbackForm";
import FeedbackList from "../components/feedback/FeedbackList";
import { useState } from "react";
import { MessageCircle, List } from "lucide-react";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
      <PageHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Gửi Ý Kiến</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ý kiến của bạn rất quan trọng với chúng tôi. Vui lòng chia sẻ bất kỳ đề xuất hoặc vấn đề
            nào để giúp chúng tôi cải thiện TOEIC Master.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Gửi Ý Kiến Mới
              </h2>
              <FeedbackForm onSuccess={() => setSubmitted(!submitted)} />
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <List className="w-5 h-5" />
                Danh Sách Ý Kiến
              </h2>
              <FeedbackList />
            </div>
          </div>
        </div>
      </main>

      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
          { label: "Luyện đề", href: "/practice" },
        ]}
      />
    </div>
  );
}
