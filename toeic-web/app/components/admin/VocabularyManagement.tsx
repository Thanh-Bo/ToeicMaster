"use client";

import { useEffect, useState } from "react";
import { vocabularyService } from "@/app/services/vocabularyService";
import { Zap, Loader } from "lucide-react";

interface VocabularyTopic {
  id: number;
  title: string;
  totalWords?: number;
}

export default function VocabularyManagement() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch topics on mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const data = await vocabularyService.getTopics();
        setTopics(data);
      } catch (err) {
        setError("Failed to load topics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Vocabulary Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Generate AI explanations for vocabulary questions
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Topics List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader className="animate-spin mx-auto mb-2" />
          Loading topics...
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No topics found. Create some topics first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>
                  {topic.totalWords && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.totalWords} words
                    </p>
                  )}
                </div>
              </div>

              {/* <button
                onClick={() => handleGenerateExplanations(topic.id)}
                disabled={generatingId === topic.id}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded transition-colors"
              >
                {generatingId === topic.id ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Generate AI Explanations
                  </>
                )}
              </button> */}
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          How it works:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>✓ Click the button to generate AI explanations for all questions in the topic</li>
          <li>✓ AI generates both short (1-sentence) and long (detailed) explanations</li>
          <li>✓ Explanations are saved to the database automatically</li>
          <li>✓ Users will see explanations when reviewing test results</li>
        </ul>
      </div>
    </div>
  );
}
