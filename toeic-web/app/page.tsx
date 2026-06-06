"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { useAuth } from "./contexts/AuthContext";
import { overallStatsService } from "./services/overallStatsService";
import { motion, Variants } from "framer-motion";
import {
  ALargeSmall,
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  Library,
  LineChart,
  PlayCircle,
  Search,
  Users,
} from "lucide-react";

const MotionLink = motion(Link);

// Animation configurations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function HomePage() {
  const { user } = useAuth();
  const [testCount, setTestCount] = useState<number | null>(null);
  const [grammarTopicsCount, setGrammarTopicsCount] = useState<number | null>(
    null,
  );
  const [grammarQuestionsCount, setGrammarQuestionsCount] = useState<
    number | null
  >(null);
  const [vocabTopicsCount, setVocabTopicsCount] = useState<number | null>(null);
  const [vocabCount, setVocabCount] = useState<number | null>(null);
  const [readingTopicCount, setReadingTopicCount] = useState<number | null>(null);
  const [readingPassageCount, setReadingPassageCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await overallStatsService.getOverallStats();
        setTestCount(stats.testCount);
        setGrammarTopicsCount(stats.grammarTopicsCount);
        setGrammarQuestionsCount(stats.grammarQuestionsCount);
        setVocabTopicsCount(stats.vocabTopicsCount);
        setVocabCount(stats.vocabCount);
        setReadingTopicCount(stats.readingTopicCount);
        setReadingPassageCount(stats.readingPassageCount);
      } catch {
        setTestCount(null);
        setGrammarTopicsCount(null);
        setGrammarQuestionsCount(null);
        setVocabTopicsCount(null);
        setVocabCount(null);
        setReadingTopicCount(null);
        setReadingPassageCount(null);
      }
    };

    fetchStats();
  }, []);

  const navLinks = [
    { href: "/grammar", label: "Ngữ pháp", icon: Library },
    { href: "/vocabulary", label: "Từ vựng", icon: ALargeSmall },
    { href: "/practice", label: "Luyện đề", icon: FileText },
    { href: "/reading", label: "Luyện đọc", icon: BookOpen },
  ];

  if (user?.role?.toLowerCase() === "admin") {
    navLinks.push({ href: "/admin", label: "Admin Panel", icon: Users });
  }

  const practiceAreas = [
    {
      icon: Library,
      title: "Ngữ pháp",
      description: "Ôn các điểm ngữ pháp thường gặp trong bài thi TOEIC.",
      href: "/grammar",
      stat:
        grammarTopicsCount !== null
          ? `${grammarTopicsCount}+ chuyên đề`
          : "Đang cập nhật",
      color: "text-blue-600 bg-blue-50/80 dark:text-blue-300 dark:bg-blue-950/40",
      hoverBorderColor: "hover:border-blue-500/40 dark:hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]",
    },
    {
      icon: ALargeSmall,
      title: "Từ vựng",
      description:
        "Học từ theo nhóm nội dung quen thuộc trong môi trường TOEIC.",
      href: "/vocabulary",
      stat: vocabCount !== null ? `${vocabCount}+ từ vựng` : "Đang cập nhật",
      color:
        "text-violet-600 bg-violet-50/80 dark:text-violet-300 dark:bg-violet-950/40",
      hoverBorderColor: "hover:border-violet-500/40 dark:hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]",
    },
    {
      icon: BookOpen,
      title: "Luyện đọc",
      description: "Làm quen đoạn văn, câu hỏi và cách xử lý thông tin.",
      href: "/reading",
      stat:
        readingPassageCount != null
          ? `${readingPassageCount}+ bài đọc`
          : "Đang cập nhật",
      color:
        "text-amber-600 bg-amber-50/80 dark:text-amber-300 dark:bg-amber-950/40",
      hoverBorderColor: "hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    },
    {
      icon: FileText,
      title: "Luyện đề",
      description: "Làm bài test TOEIC, xem kết quả và quay lại luyện thêm.",
      href: "/practice",
      stat: testCount !== null ? `${testCount}+ bài test` : "Đang cập nhật",
      color:
        "text-emerald-600 bg-emerald-50/80 dark:text-emerald-300 dark:bg-emerald-950/40",
      hoverBorderColor: "hover:border-emerald-500/40 dark:hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    },
  ];

  const workflow = [
    {
      icon: PlayCircle,
      title: "Làm bài test TOEIC",
      description:
        "Bắt đầu bằng bài luyện đề để kiểm tra mức độ quen với cấu trúc đề.",
    },
    {
      icon: Search,
      title: "Xem phần cần cải thiện",
      description:
        "Dựa trên kết quả để chọn lại phần Ngữ pháp, Từ vựng, Luyện đọc hoặc Luyện đề.",
    },
    {
      icon: LineChart,
      title: "Theo dõi tiến độ học",
      description:
        "Xem lịch sử làm bài và tiếp tục luyện tập theo nhịp học của bạn.",
    },
  ];

  const stats = [
    {
      label: "Bài test TOEIC",
      value: testCount !== null ? `${testCount}+` : "...",
    },
    {
      label: "Chuyên đề ngữ pháp",
      value: grammarTopicsCount !== null ? `${grammarTopicsCount}+` : "...",
    },
    {
      label: "Câu hỏi ngữ pháp",
      value:
        grammarQuestionsCount !== null ? `${grammarQuestionsCount}+` : "...",
    },
    {
      label: "Nhóm từ vựng",
      value: vocabTopicsCount !== null ? `${vocabTopicsCount}+` : "...",
    },
    {
      label: "Chủ đề bài đọc",
      value: readingTopicCount != null ? `${readingTopicCount}+` : "...",
    },
    {
      label: "Bài đọc",
      value: readingPassageCount != null ? `${readingPassageCount}+` : "...",
    },
  ];

  const statColors = [
    "text-blue-600 dark:text-blue-450",
    "text-violet-600 dark:text-violet-450",
    "text-indigo-600 dark:text-indigo-450",
    "text-pink-600 dark:text-pink-450",
    "text-amber-600 dark:text-amber-455",
    "text-emerald-600 dark:text-emerald-450",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-zinc-950 dark:text-zinc-300 overflow-x-hidden bg-dot-grid">
      <PageHeader navLinks={navLinks} />

      <main>
        {/* Hero Section */}
        <section className="relative border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-zinc-900/60 dark:bg-zinc-950/70">
          {/* Faint, giant lighting glow blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="absolute -top-60 right-10 h-[600px] w-[600px] rounded-full bg-blue-500/4 blur-[120px] dark:bg-blue-600/4"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                x: [0, -15, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-40 left-10 h-[500px] w-[500px] rounded-full bg-violet-500/4 blur-[120px] dark:bg-violet-600/4"
            />
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-28">
            {/* Left Hero Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start"
            >
              <motion.div
                variants={fadeInUp}
                className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-100/80 bg-blue-50/80 px-3 py-2 text-sm font-semibold text-blue-750 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300"
              >
                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Hệ thống tự học TOEIC Masters
              </motion.div>

              {/* Classy Light-Source Text Gradient */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-700 dark:from-white dark:to-zinc-400"
              >
                TOEIC Masters
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-zinc-400 sm:text-lg"
              >
                Luyện TOEIC theo từng phần: Ngữ pháp, Từ vựng, Luyện đọc và
                Luyện đề trong cùng một hệ thống.
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row w-full sm:w-auto"
              >
                <MotionLink
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.99 }}
                  href="/practice"
                  className="relative group inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition hover:bg-blue-700 hover:shadow-blue-600/20"
                >
                  Luyện đề miễn phí
                  <ArrowRight className="h-4 w-4" />
                </MotionLink>
                <MotionLink
                  whileHover={{ scale: 1.01, y: -0.5 }}
                  whileTap={{ scale: 0.99 }}
                  href="#practice-areas"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300/80 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  Tìm phần cần luyện
                </MotionLink>
              </motion.div>

              {/* Mini Features Checklist */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-600 dark:text-zinc-400 sm:grid-cols-3 w-full"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Có bài test TOEIC
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Làm bài không giới hạn
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Theo dõi tiến độ
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Content - Floating Glass Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
              className="relative w-full rounded-2xl border border-slate-200/40 bg-white/40 dark:border-zinc-800/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-2xl"
            >
              {/* Floating Container Animation */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-2xl border border-slate-200/50 bg-white/80 p-5 dark:border-zinc-800/50 dark:bg-zinc-950/80 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center justify-between border-b border-slate-100/60 pb-4 dark:border-zinc-900/60">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                      Bảng học tập
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                      Hôm nay nên luyện gì?
                    </h2>
                  </div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {practiceAreas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <motion.div
                        variants={popIn}
                        key={area.title}
                        className="rounded-xl border border-slate-200/40 p-4 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-900/25 backdrop-blur-sm shadow-sm"
                      >
                        <div
                          className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${area.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="font-bold text-slate-950 dark:text-white">
                          {area.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                          {area.stat}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Practice Areas Grid Section */}
        <section
          id="practice-areas"
          className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mb-8 max-w-2xl"
          >

            <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Các phần luyện tập
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-800 dark:from-white dark:to-zinc-300">
              Chọn đúng phần bạn cần luyện
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-400">
              TOEIC Masters đặt các phần học chính vào cùng một hệ thống để bạn
              dễ quay lại và tiếp tục.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {practiceAreas.map((area) => {
              const Icon = area.icon;
              return (
                <MotionLink
                  variants={fadeInUp}
                  whileHover={{
                    y: -5,
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                  key={area.title}
                  href={area.href}
                  className={`group rounded-xl border border-slate-200/50 bg-white/70 p-5 transition-all dark:border-zinc-800/50 dark:bg-zinc-950/70 backdrop-blur-md hover:shadow-xl hover:shadow-slate-200/30 dark:hover:shadow-black/20 ${area.hoverBorderColor}`}
                >
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${area.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {area.title}
                    </h3>
                    <ChevronIcon />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                    {area.description}
                  </p>
                  <p className="mt-4 text-xs font-bold text-slate-500 dark:text-zinc-500">
                    {area.stat}
                  </p>
                </MotionLink>
              );
            })}
          </motion.div>
        </section>

        {/* Stats Grid Section */}
        <section className="border-y border-slate-200/60 bg-white/40 backdrop-blur-md dark:border-zinc-900/60 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 max-w-2xl"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Số liệu học tập trên TOEIC Masters
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-800 dark:from-white dark:to-zinc-300">
                Nội dung đang có trên hệ thống
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {stats.map((item, index) => (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={item.label}
                  className="rounded-xl border border-slate-200/40 bg-white/60 p-5 dark:border-zinc-800/40 dark:bg-zinc-950/30 backdrop-blur-sm shadow-sm"
                >
                  <p className={`text-3xl font-black tracking-tight ${statColors[index] || "text-slate-950 dark:text-white"}`}>
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="border-y border-slate-200/60 bg-white/40 backdrop-blur-md dark:border-zinc-900/60 dark:bg-zinc-950/40">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Bài test TOEIC
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-800 dark:from-white dark:to-zinc-300">
                Làm bài, xem kết quả, luyện lại khi cần
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                Người dùng thường có thể làm bài không giới hạn. Khi cần học kỹ
                từng câu, tài khoản PRO có thể xem phần giải thích chi tiết hơn.
              </p>
              <MotionLink
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/practice"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Bắt đầu luyện tập
                <ArrowRight className="h-4 w-4" />
              </MotionLink>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    key={item.title}
                    className="rounded-xl border border-slate-200/50 bg-white/60 p-5 dark:border-zinc-800/50 dark:bg-zinc-900/20 backdrop-blur-sm shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Học trong một hệ thống
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-800 dark:from-white dark:to-zinc-300">
                Không cần tách nhiều nơi học khác nhau
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                Bạn có thể ôn nền tảng, luyện đọc, làm bài test và xem lại tiến
                độ trong cùng một tài khoản.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-slate-200/50 bg-white/60 p-5 dark:border-zinc-800/50 dark:bg-zinc-950/30 backdrop-blur-sm shadow-sm"
              >
                <ClipboardList className="mb-4 h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">
                  Lịch sử làm bài
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Xem lại các bài đã hoàn thành và tiếp tục luyện theo nhu cầu.
                </p>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-slate-200/50 bg-white/60 p-5 dark:border-zinc-800/50 dark:bg-zinc-950/30 backdrop-blur-sm shadow-sm"
              >
                <BarChart2 className="mb-4 h-6 w-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">
                  Theo dõi tiến độ
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Nhìn lại kết quả học tập để biết phần nào nên luyện tiếp.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>



        {/* Footer Bento Call-to-Action - Theme-aware subtle gradient */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100/60 dark:from-zinc-900 dark:via-zinc-950 dark:to-slate-950 border border-slate-200/60 dark:border-zinc-800/80 px-8 py-16 text-center shadow-xl dark:shadow-2xl"
          >
            {/* Dot Grid overlay inside bento card */}
            <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />
            
            {/* Extremely subtle ambient spot light */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-[200px] w-[400px] rounded-full bg-blue-500/5 blur-[60px] pointer-events-none" />

            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Bắt đầu học
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-b from-slate-950 to-slate-800 dark:from-white dark:to-zinc-300">
                Bắt đầu với phần bạn cần luyện hôm nay
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-zinc-400">
                Chọn một bài test TOEIC hoặc quay lại phần Ngữ pháp, Từ vựng, Luyện
                đọc khi bạn cần ôn kỹ hơn.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <MotionLink
                  whileHover={{ scale: 1.02, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-md shadow-blue-650/20"
                >
                  Luyện đề miễn phí
                  <ArrowRight className="h-4 w-4" />
                </MotionLink>
                <MotionLink
                  whileHover={{ scale: 1.02, y: -0.5 }}
                  whileTap={{ scale: 0.98 }}
                  href="#practice-areas"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-350 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-450 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
                >
                  Xem các phần luyện tập
                </MotionLink>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <PWAInstallBanner />
      <Footer className="mt-0" />
    </div>
  );
}

function ChevronIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition group-hover:border-blue-200 group-hover:text-blue-600 dark:border-zinc-800 dark:group-hover:border-blue-900 dark:group-hover:text-blue-300">
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </span>
  );
}



