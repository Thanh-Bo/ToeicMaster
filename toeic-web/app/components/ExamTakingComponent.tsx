"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { TestDetail } from "@/app/types";
import ExamRightSidebar from "@/app/components/ExamRightSidebar";
import AnswerOption from "@/app/components/AnswerOption";

type Props = {
    testData: TestDetail,
    onForceSubmit: (answers: Record<number, string>) => void,
    isSubmitting: boolean,
    initialTimeLeft: number
};

export default function ExamTakingComponent({ testData, onForceSubmit, isSubmitting, initialTimeLeft }: Props) {
    const router = useRouter();

    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasAutoSubmitted = useRef(false);

    const totalQuestions = useMemo(() => testData?.parts.reduce(
        (sum, part) => sum + part.groups.reduce((s, g) => s + g.questions.length, 0), 0
    ) || 0, [testData]);
    const answeredCount = Object.keys(userAnswers).length;

    useEffect(() => {
        if (initialTimeLeft === 0) return;
        if (timeLeft <= 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [initialTimeLeft, timeLeft]);

    useEffect(() => {
        if (initialTimeLeft > 0 && timeLeft === 0 && !hasAutoSubmitted.current && testData) {
            hasAutoSubmitted.current = true;
            alert("⏰ Hết giờ! Bài thi sẽ được nộp tự động.");
            onForceSubmit(userAnswers);
        }
    }, [timeLeft, testData, onForceSubmit, userAnswers, initialTimeLeft]);

    const formatTime = (seconds: number) => {
        if (seconds === 0 && initialTimeLeft === 0) return "Không giới hạn";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleSelectAnswer = (questionId: number, option: string) => setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
    const handleScrollToQuestion = (qId: number) => {
        const element = document.getElementById(`question-${qId}`);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setCurrentQuestionId(qId);
        }
    };
    const handleSubmit = async () => {
        const user = Cookies.get("user");
        if (!user) {
            alert("Bạn cần đăng nhập để nộp bài!");
            router.push("/login");
            return;
        }
        const unanswered = totalQuestions - answeredCount;
        const confirmMsg = unanswered > 0 ? `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?` : "Bạn có chắc chắn muốn nộp bài?";
        if (window.confirm(confirmMsg)) {
            onForceSubmit(userAnswers);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const questions = document.querySelectorAll('[id^="question-"]');
            let closestId: number | null = null, closestDistance = Infinity;
            questions.forEach((el) => {
                const rect = el.getBoundingClientRect();
                const distance = Math.abs(rect.top - 120);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestId = Number(el.id.replace('question-', ''));
                }
            });
            if (closestId) setCurrentQuestionId(closestId);
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentQuestionId && ['A', 'B', 'C', 'D'].includes(e.key.toUpperCase())) {
                handleSelectAnswer(currentQuestionId, e.key.toUpperCase());
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentQuestionId, testData]);

    return (
        <main className="min-h-screen bg-gray-50 pb-24 lg:pb-20 font-sans">
             <header className="bg-white shadow-sm border-b border-gray-200 p-3 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                    <Link href={`/tests/${testData.id}`} className="text-gray-500 hover:text-blue-600 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span className="hidden sm:inline">Thoát</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-800 truncate max-w-37.5 md:max-w-md">{testData.title}</h1>
                        <div className={`lg:hidden px-3 py-1 rounded-full font-bold text-sm ${timeLeft <= 300 && initialTimeLeft > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                            ⏱️ {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-bold text-blue-600">{answeredCount}</span>
                            <span>/</span>
                            <span>{totalQuestions}</span>
                        </div>
                        <button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                            {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                        </button>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}></div>
                    </div>
                </div>
            </header>
            <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-3/4">
                    {testData.parts.map((part) => (
                        <div key={part.id} className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{part.name}</h2>
                                <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-8">
                                {part.groups.map((group) => (
                                    <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                        <div className="lg:w-full p-6 space-y-6">
                                            {group.questions.map((q) => (
                                                <div key={q.id} id={`question-${q.id}`} className={`p-4 rounded-xl transition-colors ${currentQuestionId === q.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''}`}>
                                                    <div className="flex gap-3 mb-3">
                                                        <span className={`shrink-0 w-9 h-9 font-bold rounded-full flex items-center justify-center text-sm ${userAnswers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 border'}`}>{q.questionNo}</span>
                                                        <p className="font-medium text-gray-800 pt-1">{q.content}</p>
                                                    </div>
                                                    <div className="space-y-2 ml-12">
                                                        {q.answers.map((ans) => <AnswerOption key={ans.label} q={q} ans={ans} isSelected={userAnswers[q.id] === ans.label} onSelect={() => handleSelectAnswer(q.id, ans.label)} />)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden lg:block lg:w-1/4">
                    <ExamRightSidebar parts={testData.parts} userAnswers={userAnswers} onScrollToQuestion={handleScrollToQuestion} onSubmit={handleSubmit} isSubmitting={isSubmitting} timeLeft={timeLeft} currentQuestionId={currentQuestionId} />
                </div>
            </div>
        </main>
    );
}