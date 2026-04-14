"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GrammarTopic } from "@/app/types";
import { grammarService } from "@/app/services/grammarService";
import { ArrowLeft, Loader } from "lucide-react";

export default function GrammarPracticePage() {
  const router = useRouter();
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await grammarService.getTopics();
      setTopics(data);
    } catch (error) {
      console.error("Error loading grammar topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = async (topicId: string) => {
    try {
      setSelectedTopicId(topicId);
      // Get grammars in the topic
      const grammars = await grammarService.getGrammarsByTopic(Number(topicId));
      // Get practice questions
      const response = await grammarService.getQuestionsByTopic(Number(topicId));
      const questions = response.items || [];

      if (!questions || questions.length === 0) {
        alert("Không có câu hỏi cho chủ đề này");
        setSelectedTopicId(null);
        return;
      }

      // Navigate to practice test with questions
      sessionStorage.setItem(
        `grammarPractice_${topicId}`,
        JSON.stringify(questions)
      );
      router.push(`/grammar/practice/${topicId}`);
    } catch (error) {
      console.error("Error starting practice:", error);
      alert("Lỗi khi tải câu hỏi");
      setSelectedTopicId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => router.push("/grammar")}
            className="inline-flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Luyện tập ngữ pháp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Chọn một chủ đề để bắt đầu làm bài kiểm tra
          </p>
        </div>
      </div>

      {/* Topics List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Không có chủ đề ngữ pháp nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-lg border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {topic.category}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {topic.description}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {topic.learnedRules || 0}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          quy tắc
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {topic.ruleCounts?.[3] || 0}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-1">
                          nắm vững
                        </span>
                      </div>
                      {topic.learnedRules && (
                        <div>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {Math.round((topic.learnedRules / topic.totalRules) * 100)}%
                          </span>
                          <span className="text-gray-600 dark:text-gray-400 ml-1">
                            hoàn thành
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartPractice(String(topic.id))}
                    disabled={selectedTopicId === String(topic.id)}
                    className="ml-4 px-6 py-2 rounded-lg font-semibold border-2 border-blue-400 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {selectedTopicId === String(topic.id) ? (
                      <>
                        <Loader className="w-4 h-4 inline mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Bắt đầu"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
