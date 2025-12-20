"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { testService } from "../../services/testService";
import { TestDetail, Part } from "@/app/types";
import ExamRightSidebar from "@/app/components/ExamRightSidebar";
import AnswerOption from "@/app/components/AnswerOption";
import { CommentSection } from "@/app/components/comments/CommentSection";
import { PlayCircle, Clock, ListChecks, FileText, CheckSquare, Square } from "lucide-react";

// ==================================================================
//  komponen con: Giao diện làm bài thi
// ==================================================================
function ExamTakingComponent({ 
    testData, 
    onForceSubmit, 
    isSubmitting,
    initialTimeLeft
}: { 
    testData: TestDetail, 
    onForceSubmit: (answers: Record<number, string>) => void,
    isSubmitting: boolean,
    initialTimeLeft: number
}) {
    const router = useRouter();
    const BASE_URL = "http://localhost:5298";
    
    // --- STATE ---
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hasAutoSubmitted = useRef(false);

    const totalQuestions = useMemo(() => testData?.parts.reduce(
        (sum, part) => sum + part.groups.reduce((s, g) => s + g.questions.length, 0), 0
    ) || 0, [testData]);
    const answeredCount = Object.keys(userAnswers).length;

    // --- EFFECT: Timer ---
    useEffect(() => {
        if (initialTimeLeft === 0) return; // No timer if set to unlimited
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

    // --- EFFECT: Auto submit ---
    useEffect(() => {
        if (initialTimeLeft > 0 && timeLeft === 0 && !hasAutoSubmitted.current && testData) {
            hasAutoSubmitted.current = true;
            alert("⏰ Hết giờ! Bài thi sẽ được nộp tự động.");
            onForceSubmit(userAnswers);
        }
    }, [timeLeft, testData, onForceSubmit, userAnswers, initialTimeLeft]);

    // --- Format time ---
    const formatTime = (seconds: number) => {
        if (seconds === 0 && initialTimeLeft === 0) return "Không giới hạn";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // --- HANDLERS ---
    const handleSelectAnswer = (questionId: number, option: string) => setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
    const handleScrollToQuestion = (qId: number) => {
        const element = document.getElementById(`question-${qId}`);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setCurrentQuestionId(qId);
            setShowMobileNav(false);
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

    // --- Scroll & Keyboard Effects ---
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

    // Main render
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

// ==================================================================
// komponen cha: Trang "phòng chờ" của bài thi
// ==================================================================
export default function ExamLobbyPage() {
    const params = useParams();
    const testId = Number(params.id);
    const router = useRouter();

    const [testData, setTestData] = useState<TestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [testState, setTestState] = useState<'lobby' | 'taking'>('lobby');
    const [partsForPractice, setPartsForPractice] = useState<Part[]>([]);
    const [submitting, setSubmitting] = useState(false);
    
    // New states for refined selection
    const [selectedPartIds, setSelectedPartIds] = useState<Set<number>>(new Set());
    const [timeSetting, setTimeSetting] = useState<number | null>(null); // null for default, 0 for unlimited

    useEffect(() => {
        if (testId) {
            testService.getDetail(testId).then((res) => {
                const data = res.data.data;
                setTestData(data);
                setTimeSetting(data.duration || 120);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                alert("Lỗi tải đề thi!");
                setLoading(false);
            });
        }
    }, [testId]);

    const handlePartSelectionChange = (partId: number) => {
        setSelectedPartIds(prev => {
            const next = new Set(prev);
            if (next.has(partId)) {
                next.delete(partId);
            } else {
                next.add(partId);
            }
            return next;
        });
    };

    const handleStart = (mode: 'full' | 'practice') => {
        if (!testData) return;
        
        let partsToTake: Part[] = [];
        if (mode === 'full') {
            partsToTake = testData.parts;
        } else if (mode === 'practice') {
            if (selectedPartIds.size === 0) {
                alert("Vui lòng chọn ít nhất một phần để luyện tập.");
                return;
            }
            partsToTake = testData.parts.filter(p => selectedPartIds.has(p.id));
        }

        setPartsForPractice(partsToTake);
        setTestState('taking');
    };
    
    const handleForceSubmit = async (answers: Record<number, string>) => {
        const user = Cookies.get("user");
        if (!user) {
            router.push("/login");
            return;
        }
        setSubmitting(true);
        try {
            const payload = { testId, answers: Object.entries(answers).map(([qId, opt]) => ({ questionId: Number(qId), selectedOption: opt })) };
            const res = await testService.submit(payload);
            router.push(`/results/${res.data.attemptId}`);
        } catch (error: any) {
            console.error(error);
            alert("Nộp bài thất bại!");
            setTestState('lobby');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div></div>;
    if (!testData) return <div className="p-10 text-center text-red-500">Không tìm thấy đề thi.</div>;

    if (testState === 'taking') {
        const testDataForTaking = { ...testData, parts: partsForPractice };
        const finalTime = timeSetting === null ? (testData.duration || 120) : timeSetting;
        return <ExamTakingComponent testData={testDataForTaking} onForceSubmit={handleForceSubmit} isSubmitting={submitting} initialTimeLeft={finalTime * 60} />;
    }

    const totalQuestions = testData.parts.reduce((acc, p) => acc + p.groups.reduce((a, g) => a + g.questions.length, 0), 0);
    const timeOptions = [30, 60, 90, 120, 0]; // 0 for unlimited

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link href="/" className="text-sm text-gray-500 hover:text-blue-600">&larr; Quay lại trang chủ</Link>
                    <h1 className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight">{testData.title}</h1>
                    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2"><Clock size={16}/> <span>{testData.duration} phút</span></div>
                        <div className="flex items-center gap-2"><ListChecks size={16}/> <span>{totalQuestions} câu hỏi</span></div>
                        <div className="flex items-center gap-2"><FileText size={16}/> <span>{testData.parts.length} phần</span></div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border">
                        <h2 className="text-xl font-bold text-gray-800">Tùy chọn làm bài</h2>
                        <div className="mt-6">
                            <button onClick={() => handleStart('full')} className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                                <PlayCircle size={24}/>
                                Bắt đầu làm bài thi đầy đủ ({testData.duration} phút)
                            </button>
                        </div>
                        <div className="mt-8">
                            <h3 className="font-bold text-gray-700">Hoặc, luyện tập các phần tùy chọn:</h3>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {testData.parts.map(part => (
                                    <div key={part.id} onClick={() => handlePartSelectionChange(part.id)}
                                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPartIds.has(part.id) ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                        <div className="flex items-center">
                                            {selectedPartIds.has(part.id) ? <CheckSquare className="text-blue-600 mr-3" /> : <Square className="text-gray-400 mr-3" />}
                                            <div>
                                                <p className="font-bold text-gray-800">{part.name}</p>
                                                <p className="text-sm text-gray-500">{part.groups.reduce((acc, g) => acc + g.questions.length, 0)} câu hỏi</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             {selectedPartIds.size > 0 && (
                                <div className="mt-6">
                                    <button onClick={() => handleStart('practice')} className="w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors">
                                        <PlayCircle size={20}/>
                                        Bắt đầu luyện tập ({selectedPartIds.size} phần đã chọn)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-md border sticky top-8">
                            <h3 className="font-bold text-gray-800">Cài đặt thời gian</h3>
                            <div className="mt-4 space-y-2 text-sm">
                                {timeOptions.map(time => (
                                    <label key={time} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                        <input type="radio" name="timer" className="form-radio h-4 w-4 text-blue-600"
                                            value={time}
                                            checked={time === (timeSetting === null ? testData.duration : timeSetting)}
                                            onChange={() => setTimeSetting(time)} />
                                        <span className="ml-3 text-gray-700">{time === 0 ? 'Không giới hạn thời gian' : `${time} phút`}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-gray-500">Lưu ý: Áp dụng cho chế độ "Luyện tập tùy chọn". Chế độ "Làm bài thi đầy đủ" sẽ dùng thời gian chuẩn của đề.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                     <CommentSection testId={testId} defaultSort="mostLiked" />
                </div>
            </main>
        </div>
    );
}
