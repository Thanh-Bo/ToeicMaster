"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Footer } from "./components/layout";
import { useAuth } from "./contexts/AuthContext";
import { overallStatsService } from "./services/overallStatsService";
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

export default function HomePage() {
  const { user } = useAuth();
  const [testCount, setTestCount] = useState<number | null>(null);
  const [grammarTopicsCount, setGrammarTopicsCount] = useState<number | null>(null);
  const [grammarQuestionsCount, setGrammarQuestionsCount] = useState<number | null>(null);
  const [vocabTopicsCount, setVocabTopicsCount] = useState<number | null>(null);
  const [vocabCount, setVocabCount] = useState<number | null>(null);

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
      stat: grammarTopicsCount !== null ? `${grammarTopicsCount}+ chuyên đề` : "Đang cập nhật",
      color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
    },
    {
      icon: ALargeSmall,
      title: "Từ vựng",
      description: "Học từ theo nhóm nội dung quen thuộc trong môi trường TOEIC.",
      href: "/vocabulary",
      stat: vocabCount !== null ? `${vocabCount}+ từ vựng` : "Đang cập nhật",
      color: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/40",
    },
    {
      icon: BookOpen,
      title: "Luyện đọc",
      description: "Làm quen đoạn văn, câu hỏi và cách xử lý thông tin.",
      href: "/reading",
      stat: "Part 6 & Part 7",
      color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40",
    },
    {
      icon: FileText,
      title: "Luyện đề",
      description: "Làm bài test TOEIC, xem kết quả và quay lại luyện thêm.",
      href: "/practice",
      stat: testCount !== null ? `${testCount}+ bài test` : "Đang cập nhật",
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
    },
  ];

  const workflow = [
    {
      icon: PlayCircle,
      title: "Làm bài test TOEIC",
      description: "Bắt đầu bằng bài luyện đề để kiểm tra mức độ quen với cấu trúc đề.",
    },
    {
      icon: Search,
      title: "Xem phần cần cải thiện",
      description: "Dựa trên kết quả để chọn lại phần Ngữ pháp, Từ vựng, Luyện đọc hoặc Luyện đề.",
    },
    {
      icon: LineChart,
      title: "Theo dõi tiến độ học",
      description: "Xem lịch sử làm bài và tiếp tục luyện tập theo nhịp học của bạn.",
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
      value: grammarQuestionsCount !== null ? `${grammarQuestionsCount}+` : "...",
    },
    {
      label: "Nhóm từ vựng",
      value: vocabTopicsCount !== null ? `${vocabTopicsCount}+` : "...",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-zinc-950 dark:text-zinc-300">
      <PageHeader navLinks={navLinks} />

      <main>
        <section className="border-b border-slate-200/80 bg-white dark:border-zinc-900 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-28">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                <CheckCircle2 className="h-4 w-4" />
                Hệ thống tự học TOEIC Masters
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                TOEIC Masters
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-zinc-400 sm:text-lg">
                Luyện TOEIC theo từng phần: Ngữ pháp, Từ vựng, Luyện đọc và Luyện đề trong cùng một hệ thống.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/practice"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Luyện đề miễn phí
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#practice-areas"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  Tìm phần cần luyện
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-sm text-slate-600 dark:text-zinc-400 sm:grid-cols-3">
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
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-xl shadow-slate-200/70 dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-black/20">
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 dark:border-zinc-900">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                      Bảng học tập
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950 dark:text-white">
                      Hôm nay nên luyện gì?
                    </h2>
                  </div>
                  <div className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">
                    TOEIC
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {practiceAreas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <div
                        key={area.title}
                        className="rounded-lg border border-slate-200 p-4 dark:border-zinc-800"
                      >
                        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${area.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="font-bold text-slate-950 dark:text-white">{area.title}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{area.stat}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-950 dark:text-white">Bài test gần đây</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                        Xem kết quả, quay lại câu sai và luyện tiếp.
                      </p>
                    </div>
                    <BarChart2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-zinc-800">
                    <div className="h-2 w-2/3 rounded-full bg-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="practice-areas" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Các phần luyện tập
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              Chọn đúng phần bạn cần luyện
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-zinc-400">
              TOEIC Masters đặt các phần học chính vào cùng một hệ thống để bạn dễ quay lại và tiếp tục.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {practiceAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Link
                  key={area.title}
                  href={area.href}
                  className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-900 dark:hover:shadow-black/20"
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${area.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-extrabold text-slate-950 dark:text-white">{area.title}</h3>
                    <ChevronIcon />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">{area.description}</p>
                  <p className="mt-4 text-xs font-bold text-slate-500 dark:text-zinc-500">{area.stat}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Bài test TOEIC
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Làm bài, xem kết quả, luyện lại khi cần
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                Người dùng thường có thể làm bài không giới hạn. Khi cần học kỹ từng câu, tài khoản PRO có thể xem phần giải thích chi tiết hơn.
              </p>
              <Link
                href="/practice"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Bắt đầu luyện tập
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">0{index + 1}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Học trong một hệ thống
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Không cần tách nhiều nơi học khác nhau
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-zinc-400">
                Bạn có thể ôn nền tảng, luyện đọc, làm bài test và xem lại tiến độ trong cùng một tài khoản.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <ClipboardList className="mb-4 h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">Lịch sử làm bài</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Xem lại các bài đã hoàn thành và tiếp tục luyện theo nhu cầu.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <BarChart2 className="mb-4 h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-slate-950 dark:text-white">Theo dõi tiến độ</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Nhìn lại kết quả học tập để biết phần nào nên luyện tiếp.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Số liệu học tập trên TOEIC Masters
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Nội dung đang có trên hệ thống
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-2xl font-extrabold text-slate-950 dark:text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            Bắt đầu học
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Bắt đầu với phần bạn cần luyện hôm nay
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-zinc-400">
            Chọn một bài test TOEIC hoặc quay lại phần Ngữ pháp, Từ vựng, Luyện đọc khi bạn cần ôn kỹ hơn.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Luyện đề miễn phí
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#practice-areas"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              Xem các phần luyện tập
            </Link>
          </div>
        </section>
      </main>

      <Footer
        links={[
          { label: "Trang chủ", href: "/" },
          { label: "Luyện đề", href: "/practice" },
          { label: "Luyện đọc", href: "/reading" },
          { label: "Từ vựng", href: "/vocabulary" },
          { label: "Ngữ pháp", href: "/grammar" },
        ]}
      />
    </div>
  );
}

function ChevronIcon() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition group-hover:border-blue-200 group-hover:text-blue-600 dark:border-zinc-800 dark:group-hover:border-blue-900 dark:group-hover:text-blue-300">
      <ArrowRight className="h-3.5 w-3.5" />
    </span>
  );
}
