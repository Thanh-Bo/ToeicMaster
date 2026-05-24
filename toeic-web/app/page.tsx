"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { useAuth } from "./contexts/AuthContext";
import { overallStatsService } from "./services/overallStatsService";
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

  // Fetch all stats in a single API call
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await overallStatsService.getOverallStats();
        setTestCount(stats.testCount);
        setGrammarTopicsCount(stats.grammarTopicsCount);
        setGrammarQuestionsCount(stats.grammarQuestionsCount);
        setVocabTopicsCount(stats.vocabTopicsCount);
        setVocabCount(stats.vocabCount);
      } catch {
        setTestCount(null);
        setGrammarTopicsCount(null);
        setGrammarQuestionsCount(null);
        setVocabTopicsCount(null);
        setVocabCount(null);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      icon: <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      value: testCount !== null ? `${testCount}+` : "...",
      label: "Đề thi",
    },
    {
      icon: <Library className="w-5 h-5 text-purple-500 dark:text-purple-400" />,
      value: grammarTopicsCount !== null ? `${grammarTopicsCount}+` : "...",
      label: "Chủ đề Grammar",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-pink-500 dark:text-pink-400" />,
      value: grammarQuestionsCount !== null ? `${grammarQuestionsCount}+` : "...",
      label: "Câu hỏi Grammar",
    },
    {
      icon: <ALargeSmall className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      value: vocabTopicsCount !== null ? `${vocabTopicsCount}+` : "...",
      label: "Chủ đề Từ vựng",
    },
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />,
      value: vocabCount !== null ? `${vocabCount}+` : "...",
      label: "Từ vựng",
    },
  ];

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Luyện đề Full Test",
      description:
        "200 câu hỏi mỗi đề, đầy đủ 7 parts chuẩn cấu trúc TOEIC, chấm điểm tự động chính xác ngay sau khi nộp.",
      href: "/practice",
      iconBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Giải thích Chi tiết",
      description:
        "Mỗi câu hỏi đều được phân tích đáp án chi tiết và từ vựng mở rộng — hiểu sâu bản chất, nói không với học vẹt.",
      href: "/practice",
      iconBg: "bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Theo dõi Tiến độ",
      description:
        "Đo lường chi tiết điểm số theo từng phần thi, phân tích điểm yếu và duy trì streak học tập hằng ngày.",
      href: "/practice",
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20",
    },
  ];

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      step: "01",
      title: "Tạo tài khoản",
      description: "Đăng ký nhanh chóng hoàn toàn miễn phí chỉ trong 5 giây.",
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      step: "02",
      title: "Luyện đề & Ngữ pháp",
      description: "Lựa chọn các bài thi thử hoặc học lý thuyết theo chủ điểm.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      step: "03",
      title: "Xem giải đáp & Tiến bộ",
      description: "Đối chiếu đáp án, học từ lỗi sai để tối ưu điểm số.",
    },
  ];

  const mainSections = [
    {
      icon: <Library className="w-6 h-6" />,
      title: "Ngữ pháp TOEIC",
      description: "Học ngữ pháp trọng tâm kèm ví dụ thực tế bài bản.",
      href: "/grammar",
      badge: "Grammar",
      accentColor: "group-hover:border-blue-500/40 dark:group-hover:bg-blue-500/[0.02]",
      iconWrapper: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
    },
    {
      icon: <ALargeSmall className="w-6 h-6" />,
      title: "Từ vựng TOEIC",
      description: "Ghi nhớ từ vựng theo chủ đề qua phương pháp Spaced Repetition.",
      href: "/vocabulary",
      badge: "Vocabulary",
      accentColor: "group-hover:border-purple-500/40 dark:group-hover:bg-purple-500/[0.02]",
      iconWrapper: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Thi thử Online",
      description: "Hệ thống đề thi đa dạng chuẩn format thực tế, chấm điểm tự động.",
      href: "/practice",
      badge: "Practice",
      accentColor: "group-hover:border-emerald-500/40 dark:group-hover:bg-emerald-500/[0.02]",
      iconWrapper: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Reading Part 6 & 7",
      description: "Luyen doc theo passage rieng, cham dap an va xem giai thich sau moi phien.",
      href: "/reading",
      badge: "Reading",
      accentColor: "group-hover:border-amber-500/40 dark:group-hover:bg-amber-500/[0.02]",
      iconWrapper: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
    },
  ];

  // Dynamic Navigation bar links builder
  const navLinks = [
    { href: "/grammar", label: "Grammar", icon: Library },
    { href: "/vocabulary", label: "Vocab", icon: ALargeSmall },
    { href: "/practice", label: "Practice", icon: FileText },
    { href: "/reading", label: "Reading", icon: BookOpen },
  ];
  if (user?.role?.toLowerCase() === "admin") {
    navLinks.push({ href: "/admin", label: "Admin Panel", icon: Users });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-700 dark:text-gray-300 relative overflow-hidden font-sans">
      
      {/* Visual Ambient Backdrops (Dark mode only) */}
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-600/[0.03] blur-[130px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[50%] h-[35%] rounded-full bg-purple-500/5 dark:bg-purple-600/[0.03] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-emerald-500/5 dark:bg-emerald-600/[0.02] blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.07] pointer-events-none" />

      {/* HEADER */}
      <PageHeader navLinks={navLinks} />

      {/* ── 1. HERO SECTION ── */}
      <section className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center relative z-10">
        
        {/* Subtle Tech Badge */}
        <div className="inline-flex items-center gap-1.5 border border-blue-200 dark:border-blue-500/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-8 bg-blue-50/50 dark:bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 animate-pulse" />
          <span>Nền tảng luyện TOEIC thông minh</span>
        </div>

        {/* Dynamic Titles */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-blue-600 dark:text-blue-400 leading-tight mb-4">
          Luyện TOEIC Hiệu Quả
        </h1>
        <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Đạt mục tiêu điểm số nhanh hơn
        </h2>

        {/* Small Intro Paragraph */}
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Trải nghiệm thi thử với kho đề thi cập nhật liên tục, hệ thống tự động tính điểm và gợi ý giải thích chi tiết giúp bạn nhanh chóng cải thiện kỹ năng.
        </p>

        {/* Refined primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/practice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Bắt đầu luyện thi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/practice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Xem danh sách đề
          </Link>
        </div>
      </section>

      {/* ── 2. CORE SECTIONS NAV TILES ── */}
      <section className="max-w-5xl mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainSections.map((section, i) => (
            <Link
              key={i}
              href={section.href}
              className={`group flex flex-col gap-4 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/20 backdrop-blur-md hover:shadow-xl hover:shadow-blue-500/[0.02] hover:-translate-y-1 transition-all duration-300 ${section.accentColor}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${section.iconWrapper} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  {section.icon}
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{section.badge}</span>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base mt-0.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {section.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. BORDERLESS METRICS / STATS BAR ── */}
      <section className="py-12 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
              Hệ Thống Thống Kê
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
              Số liệu thực tế hoạt động trên nền tảng TOEIC Master
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 w-full max-w-4xl">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center px-2 py-4">
                  <div className="mb-3 p-2.5 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 shadow-sm border border-gray-100 dark:border-zinc-800/40">
                    {stat.icon}
                  </div>
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-1.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. VISUAL FEATURES SECTION ── */}
      <section className="border-t border-gray-100 dark:border-zinc-900/60 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
              Tất Cả Những Gì Bạn Cần
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Công cụ toàn diện giúp tối ưu quá trình ôn thi và đạt mục tiêu cao nhất
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link
                key={i}
                href={feature.href}
                className="group flex flex-col gap-4 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/10 hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                  {feature.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. GRAMMAR TOPIC BANNER ── */}
      <section className="border-t border-gray-100 dark:border-zinc-900/60 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
              Nắm Vững Ngữ Pháp Tiếng Anh
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Học ngữ pháp bài bản theo hệ thống chuyên sâu và các chuyên đề trọng tâm
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Grammar block 1 */}
            <Link
              href="/grammar"
              className="group flex flex-col gap-4 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/10 hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                  Lý thuyết trọng tâm
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                Tổng hợp đầy đủ các chuyên đề ngữ pháp thường gặp trong đề thi TOEIC thực tế, hệ thống hoá lý thuyết dễ hiểu kèm ví dụ sinh động.
              </p>
            </Link>

            {/* Grammar block 2 */}
            <Link
              href="/grammar"
              className="group flex flex-col gap-4 p-6 rounded-3xl border border-gray-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/10 hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                  Bài tập vận dụng
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                Luyện tập trực tiếp ngay sau bài học để củng cố lý thuyết. Nhận kết quả và đáp án chi tiết giải thích rõ ràng giúp khắc sâu kiến thức.
              </p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/grammar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Bắt đầu học Ngữ Pháp</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. STEPS WORKFLOW ── */}
      <section className="border-t border-gray-100 dark:border-zinc-900/60 relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
              Bắt Đầu Chỉ Trong 3 Bước
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              Quy trình ôn luyện đơn giản, tinh gọn và hoàn toàn miễn phí
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-6 sm:gap-4 lg:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col sm:items-center text-left sm:text-center p-6 rounded-3xl border border-gray-100 dark:border-zinc-900/60 bg-white dark:bg-zinc-900/10 group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300 mb-4">
                  {step.icon}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 block mb-1">
                    Bước {step.step}
                  </span>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA CALL SECTION ── */}
      <section className="border-t border-gray-100 dark:border-zinc-900/60 relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-blue-50/50 dark:bg-zinc-900/40 border border-blue-500/10 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Sẵn Sàng Chinh Phục TOEIC?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
              Tạo tài khoản học tập miễn phí ngay hôm nay để khám phá kho tài liệu ôn luyện chất lượng từ TOEIC Master.
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/10 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span>Bắt đầu thi thử ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
          { label: "Luyện đề", href: "/practice" },
          { label: "Reading", href: "/reading" },
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Ngữ Pháp", href: "/grammar" },
        ]}
      />
    </div>
  );
}
