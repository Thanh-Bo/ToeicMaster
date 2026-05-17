"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { useAuth } from "./contexts/AuthContext";
import { testService } from "./services/testService";
import { grammarService } from "./services/grammarService";
import { vocabularyService } from "./services/vocabularyService";
import {
  Sparkles,
  BookOpen,
  Users,
  Brain,
  Trophy,
  FileText,
  BarChart2,
  UserPlus,
  ClipboardList,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  ALargeSmall,
  Library,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [testCount, setTestCount] = useState<number | null>(null);
  const [grammarTopicsCount, setGrammarTopicsCount] = useState<number | null>(null);
  const [grammarQuestionsCount, setGrammarQuestionsCount] = useState<number | null>(null);
  const [vocabTopicsCount, setVocabTopicsCount] = useState<number | null>(null);
  const [vocabCount, setVocabCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchTestCount = async () => {
      try {
        const res = await testService.getList();
        const data = res.data?.data ?? res.data;
        if (Array.isArray(data)) {
          setTestCount(data.length);
        }
      } catch {
        setTestCount(null);
      }
    };
    fetchTestCount();
  }, []);

  // Fetch grammar topics, questions and vocabulary counts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch grammar groups and count topics
        const groups = await grammarService.getAllGroups();
        let totalTopics = 0;
        let totalQuestions = 0;
        
        for (const group of groups) {
          const topics = await grammarService.getTopicsByGroup(group.id);
          totalTopics += topics.length;
          
          // Count questions for each topic
          for (const topic of topics) {
            try {
              const questionsData = await grammarService.getQuestionsByTopic(topic.id, 'easy', 1);
              totalQuestions += questionsData.total || 0;
            } catch {
              // Skip if can't fetch questions
            }
          }
        }
        
        setGrammarTopicsCount(totalTopics);
        setGrammarQuestionsCount(totalQuestions);
      } catch {
        setGrammarTopicsCount(null);
        setGrammarQuestionsCount(null);
      }

      try {
        // Fetch vocabulary topics and count total words
        const vocabTopics = await vocabularyService.getTopics();
        setVocabTopicsCount(vocabTopics.length);
        
        let totalVocab = 0;
        
        for (const topic of vocabTopics) {
          const words = await vocabularyService.getWordsByTopic(topic.topicGuid);
          totalVocab += words.length;
        }
        
        setVocabCount(totalVocab);
      } catch {
        setVocabTopicsCount(null);
        setVocabCount(null);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      value: testCount !== null ? `${testCount}+` : "...",
      label: "Đề thi",
    },
    {
      icon: <Library className="w-5 h-5" />,
      value: grammarTopicsCount !== null ? `${grammarTopicsCount}+` : "...",
      label: "Chủ đề Grammar",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      value: grammarQuestionsCount !== null ? `${grammarQuestionsCount}+` : "...",
      label: "Câu hỏi Grammar",
    },
    {
      icon: <ALargeSmall className="w-5 h-5" />,
      value: vocabTopicsCount !== null ? `${vocabTopicsCount}+` : "...",
      label: "Chủ đề Từ vựng",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      value: vocabCount !== null ? `${vocabCount}+` : "...",
      label: "Từ vựng",
    },
  ];

  const features = [
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Luyện đề Full Test",
      description:
        "200 câu mỗi đề, đầy đủ 7 parts TOEIC, chấm điểm tự động sau khi nộp bài.",
      href: "/practice",
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Giải thích Chi tiết",
      description:
        "Mỗi câu sai đều có giải thích rõ ràng  — hiểu sâu, không chỉ nhớ đáp án.",
      href: "/practice",
    },
    {
      icon: <BarChart2 className="w-7 h-7" />,
      title: "Theo dõi Tiến độ",
      description:
        "Xem lịch sử làm bài, điểm số theo từng part và streak học tập hằng ngày.",
      href: "/practice",
    },
  ];

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      step: "01",
      title: "Đăng ký miễn phí",
      description: "Tạo tài khoản nhanh chóng, không cần thẻ tín dụng.",
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      step: "02",
      title: "Chọn đề và làm bài",
      description: "Chọn từ kho đề thi đa dạng, thi thử như thi thật.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      step: "03",
      title: "Xem kết quả & Giải thích",
      description: "Phân tích chi tiết từng câu, nắm điểm yếu để cải thiện.",
    },
  ];

  const mainSections = [
    {
      icon: <Library className="w-7 h-7" />,
      title: "Grammar",
      description: "Học ngữ pháp TOEIC với hệ thống SRS thông minh.",
      href: "/grammar",
    },
    {
      icon: <ALargeSmall className="w-7 h-7" />,
      title: "Vocabulary",
      description: "Học từ vựng theo chủ đề với phương pháp spaced repetition.",
      href: "/vocabulary",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Practice",
      description: "Luyện đề TOEIC full test với chấm điểm tự động.",
      href: "/practice",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
      {/* HEADER */}
      <PageHeader
        navLinks={[
          { href: "/grammar", label: "Grammar", icon: Library },
          { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
          { href: "/practice", label: "Practice", icon: FileText },
          // { href: "/vocabulary", label: "Vocab", icon: BookOpen },
          // { href: "/practice", label: "Practice", icon: FileText },
        ]}
      />

      {/* ── 1. HERO SECTION ── */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-blue-200 dark:border-blue-900 rounded-full px-4 py-1.5 text-sm text-blue-500 dark:text-blue-400 mb-8 bg-blue-50 dark:bg-blue-950/30">
          <Sparkles className="w-4 h-4" />
          <span>Nền tảng luyện TOEIC thông minh</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-blue-500 dark:text-blue-400 leading-tight mb-4">
          Luyện TOEIC hiệu quả
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Đạt mục tiêu điểm số nhanh hơn
        </h2>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">
          Luyện đề full test, chấm điểm tự động và giải thích chi tiết từng câu.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-1 active:scale-95"
          >
            Bắt đầu luyện thi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold border border-blue-300 dark:border-blue-700 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 hover:shadow-md"
          >
            Xem danh sách đề
          </Link>
          {user?.role?.toLowerCase() === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold border border-gray-200 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200"
            >
              Admin Panel
            </Link>
          )}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-4 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainSections.map((section, i) => (
            <Link
              key={i}
              href={section.href}
              className="group flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0">
                  {section.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 border-b-2 border-transparent group-hover:border-blue-500 pt-1">
                  {section.title}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      {/* ── 2. STATS BAR ── */}
      <section className="py-10 border-t border-gray-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Thống kê 
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Số liệu về nền tảng TOEIC Master
          </p>
        </div>
        <div className="flex justify-center">
          <div className="inline-flex divide-x divide-gray-200 dark:divide-zinc-700 border-2 border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-1.5 px-10 py-6"
            >
              <div className="text-gray-900 dark:text-white mb-1">
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURE CARDS ── */}
      <section className="w-full border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Tất cả những gì bạn cần
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Công cụ đầy đủ để luyện TOEIC hiệu quả nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                className="group flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Icon and Title in same row */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className=" font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 border-b-2 border-transparent group-hover:border-blue-500 pt-1">
                    {feature.title}
                  </h3>
                </div>
                {/* Description */}
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. GRAMMAR SECTION ── */}

      <section className="border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Nắm vững Ngữ Pháp Tiếng Anh
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Học quy tắc ngữ pháp bằng hệ thống lặp lại ngắt quãng (SRS)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* // Grammar Feature 1 */}
            <Link
              href="/grammar"
              className="group flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Hệ thống SRS
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Ôn tập quy tắc đúng lúc với hệ thống lặp lại ngắt quãng, giúp
                ghi nhớ lâu dài.
              </p>
            </Link>

            {/* // Grammar Feature 2 */}
            <Link
              href="/grammar"
              className="group flex flex-col gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Bài kiểm tra
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Làm bài kiểm tra từng chủ đề để kiểm tra hiểu biết và cải thiện
                kỹ năng.
              </p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              Bắt đầu học Ngữ Pháp
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Bắt đầu chỉ trong 3 bước
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Đơn giản, nhanh chóng và hoàn toàn miễn phí
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
            {steps.map((step, i) => (
              <div key={i} className="flex md:flex-1 items-center w-full">
                {/* Step Card */}
                <div className="flex-1 flex flex-col items-center text-center gap-3 px-4 group hover:scale-105 transition-transform duration-200">
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow duration-200 border border-blue-600 dark:border-blue-900">
                    <div className="text-white">{step.icon}</div>
                  </div>
                  <span className="text-lg font-mono font-bold text-blue-500 dark:text-blue-400">
                    {step.step}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[180px]">
                    {step.description}
                  </p>
                </div>

                {/* Divider Arrow */}
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block w-5 h-5 text-blue-400 dark:text-blue-700 flex-shrink-0 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CTA SECTION ── */}
      <section className="border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sẵn sàng chinh phục TOEIC?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Đăng ký miễn phí và bắt đầu luyện tập ngay hôm nay.
          </p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            Bắt đầu ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
          { label: "Luyện đề", href: "/practice" },
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Ngữ Pháp", href: "/grammar" },
        ]}
      />
    </div>
  );
}
