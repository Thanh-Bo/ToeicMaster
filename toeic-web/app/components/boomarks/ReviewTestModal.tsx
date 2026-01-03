"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronUp,
  PlayCircle,
} from "lucide-react";
import { BookmarkItem } from "@/app/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: BookmarkItem[];
}

// Interface nội bộ để quản lý nhóm câu hỏi
interface ReviewGroup {
  groupId: number;
  partNumber: number;
  textContent?: string;
  imageUrl?: string;
  audioUrl?: string;
  questions: BookmarkItem[];
}

const BASE_URL = "http://localhost:5298"; // URL backend của bạn

export default function ReviewTestModal({ isOpen, onClose, questions }: Props) {
  // --- STATE ---
  const [reviewGroups, setReviewGroups] = useState<ReviewGroup[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({}); // { questionId: "A" }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // --- 1. LOGIC GOM NHÓM & SHUFFLE (Sửa lỗi Part 6,7 rời rạc) ---
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      // B1: Gom nhóm các câu bookmark theo GroupId
      const groupsMap = new Map<number, ReviewGroup>();

      questions.forEach((item) => {
        const gId = item.question.groupId || item.questionId; // Fallback nếu không có groupId

        if (!groupsMap.has(gId)) {
          // Lấy thông tin ngữ cảnh từ câu hỏi đầu tiên tìm thấy
          // (Giả sử backend trả về nested: item.question.group.textContent...)
          // Dựa vào code backend bạn cung cấp, cấu trúc là item.question.group.*
          // Tuy nhiên ở frontend model BookmarkItem bạn định nghĩa phẳng,
          // nên tôi sẽ lấy từ item.question (nếu bạn đã map ở service) hoặc item (tùy API).
          // Dưới đây tôi map theo đúng dữ liệu API bạn cung cấp trước đó:

          groupsMap.set(gId, {
            groupId: gId,
            partNumber: item.question.partNumber,
            // Lưu ý: Cần đảm bảo API trả về các trường này trong object question hoặc group
            textContent: item.question.textContent,
            imageUrl: item.question.imageUrl,
            audioUrl: item.question.audioUrl,
            questions: [],
          });
        }
        groupsMap.get(gId)?.questions.push(item);
      });

      // B2: Chuyển sang mảng và Shuffle các nhóm (chứ không shuffle câu lẻ)
      const groupArray = Array.from(groupsMap.values());
      const shuffled = groupArray.sort(() => 0.5 - Math.random());

      // B3: Sắp xếp lại câu hỏi trong nhóm theo thứ tự (QuestionNo) để logic hơn
      shuffled.forEach((g) => {
        g.questions.sort(
          (a, b) => a.question.questionNo - b.question.questionNo
        );
      });

      setReviewGroups(shuffled);

      // Reset
      setUserAnswers({});
      setIsSubmitted(false);
      setElapsedTime(0);
    }
  }, [isOpen, questions]);

  // --- TIMER ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !isSubmitted) {
      timer = setInterval(() => setElapsedTime((p) => p + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- HANDLERS ---
  const handleSelectAnswer = (qId: number, answerLabel: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: answerLabel }));
  };

  const handleSubmit = () => {
    // Check nếu chưa làm hết
    const totalQ = questions.length;
    const answeredQ = Object.keys(userAnswers).length;
    if (answeredQ < totalQ) {
      if (!confirm(`Bạn mới làm ${answeredQ}/${totalQ} câu. Nộp luôn chứ?`))
        return;
    } else {
      if (!confirm("Xác nhận nộp bài?")) return;
    }

    setIsSubmitted(true);
    document
      .getElementById("review-top")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRetry = () => {
    // Trigger lại useEffect bằng cách đóng mở hoặc set state nội bộ (ở đây làm đơn giản là reload logic group)
    const reshuffled = [...reviewGroups].sort(() => 0.5 - Math.random());
    setReviewGroups(reshuffled);
    setUserAnswers({});
    setIsSubmitted(false);
    setElapsedTime(0);
  };

  const scrollToGroup = (gId: number) => {
    document
      .getElementById(`group-${gId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Tính điểm tổng
  const totalQuestionsCount = questions.length;
  const correctCount = questions.filter(
    (q) => userAnswers[q.questionId] === q.question.correctOption
  ).length;

  const flatQuestions = reviewGroups.flatMap((group) => group.questions);

  // Hàm scroll mới (scroll chính xác đến từng câu hỏi thay vì index)
  const scrollToQuestionId = (qId: number) => {
    const el = document.getElementById(`q-${qId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Thêm hiệu ứng nháy nhẹ để user biết đang ở câu nào
      el.classList.add("ring-2", "ring-blue-400");
      setTimeout(() => el.classList.remove("ring-2", "ring-blue-400"), 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-zinc-900 flex flex-col animate-fadeIn overflow-hidden">
      {/* HEADER */}
      <div
        id="review-top"
        className="bg-white  dark:bg-zinc-900   text-white shadow-sm border-b  border-gray-100 dark:border-zinc-700 x-6 py-3 flex justify-between items-center shrink-0 z-20"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-300 flex items-center gap-2">
            📝 Mini-Test ({totalQuestionsCount} câu)
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
              isSubmitted
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <Clock size={16} /> {formatTime(elapsedTime)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* --- LEFT: CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* KẾT QUẢ (Chỉ hiện khi Submit) */}
            {isSubmitted && (
              <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8 text-center animate-slideDown">
                <p className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-2">
                  Kết quả của bạn
                </p>
                <div className="text-5xl font-extrabold text-blue-600 mb-2">
                  {correctCount}{" "}
                  <span className="text-2xl text-gray-400">
                    / {totalQuestionsCount}
                  </span>
                </div>
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold inline-flex items-center gap-2 shadow-lg transition mt-4"
                >
                  <RefreshCw size={18} /> Làm đề khác
                </button>
              </div>
            )}

            {/* DANH SÁCH GROUP CÂU HỎI */}
            {reviewGroups.map((group, gIndex) => (
              <div
                key={group.groupId}
                id={`group-${group.groupId}`}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden scroll-mt-24"
              >
                {/* 1. NGỨ CẢNH (Audio/Image/Text) - Sửa lỗi Part 1, LC, RC */}
                <div className="bg-gray-50 dark:bg-zinc-900 p-5  dark:border-zinc-700 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-800 dark:bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded uppercase">
                      Part {group.partNumber}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                      Nhóm câu hỏi {gIndex + 1}
                    </span>
                  </div>

                  {/* Audio (Listening) */}
                  {group.audioUrl && (
                    <div className="sticky top-24 z-30 mb-4">
                      <div className="bg-gray-900 dark:bg-zinc-900 text-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                        <PlayCircle className="text-blue-400 shrink-0" />
                        <span className="text-sm font-medium">
                          Part {group.partNumber} Audio
                        </span>
                        <audio
                          controls
                          className="h-8 flex-1"
                          src={`${BASE_URL}${group.audioUrl}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Image (Part 1, 3, 4, 7) */}
                  {group.imageUrl && (
                    <div className="flex justify-center">
                      <img
                        src={`${BASE_URL}${group.imageUrl}`}
                        alt="Context"
                        className="max-h-96 rounded-lg border shadow-sm"
                      />
                    </div>
                  )}

                  {/* Text Passage (Part 6, 7) */}
                  {group.textContent && (
                    <div
                      className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-600 text-sm leading-relaxed text-gray-800 dark:text-gray-100 max-h-60 overflow-y-auto shadow-inner"
                      dangerouslySetInnerHTML={{ __html: group.textContent }}
                    />
                  )}
                </div>

                {/* 2. DANH SÁCH CÂU HỎI TRONG GROUP */}
                <div className=" ">
                  {group.questions.map((item, qIndex) => {
                    const q = item.question;
                    const uAns = userAnswers[item.questionId];
                    const isCorrect = uAns === q.correctOption;

                    return (
                      <div
                        key={item.questionId}
                        id={`q-${item.questionId}`}
                        className="p-6"
                      >
                        <div className="flex gap-4">
                          <div className="shrink-0 pt-1">
                            <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-100 dark:border-blue-700">
                              {q.questionNo}
                            </span>
                          </div>
                          <div className="flex-1">
                            {/* Nội dung câu hỏi */}
                            <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-lg">
                              {q.content}
                            </h4>

                            {/* Grid Đáp Án - Sửa lỗi hiện màu trước khi submit */}
                            <div className="grid grid-cols-1 gap-3">
                              {q.answers.map((ans) => {
                                const isSelected = uAns === ans.label;

                                // --- LOGIC MÀU SẮC (QUAN TRỌNG) ---
                                let btnClass =
                                  "border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-900 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300"; // Mặc định
                                let icon = (
                                  <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mr-3">
                                    {ans.label}
                                  </span>
                                );

                                if (!isSubmitted) {
                                  // CHƯA NỘP: Chỉ hiện màu xanh dương khi chọn
                                  if (isSelected) {
                                    btnClass =
                                      "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 dark:ring-blue-400 font-medium";
                                    icon = (
                                      <span className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-700 text-white flex items-center justify-center text-xs font-bold mr-3">
                                        {ans.label}
                                      </span>
                                    );
                                  }
                                } else {
                                  // ĐÃ NỘP: Hiện đúng sai
                                  if (ans.label === q.correctOption) {
                                    // Đây là đáp án đúng -> Luôn xanh lá
                                    btnClass =
                                      "border-green-500 bg-green-50 text-green-800 font-bold";
                                    icon = (
                                      <CheckCircle
                                        size={20}
                                        className="text-green-600 mr-3"
                                      />
                                    );
                                  } else if (isSelected) {
                                    // Đã chọn sai -> Đỏ
                                    btnClass =
                                      "border-red-500 bg-red-50 text-red-800 opacity-80";
                                    icon = (
                                      <AlertCircle
                                        size={20}
                                        className="text-red-500 mr-3"
                                      />
                                    );
                                  } else {
                                    // Các câu khác -> Mờ đi
                                    btnClass = "opacity-40 border-gray-100";
                                  }
                                }

                                return (
                                  <button
                                    key={ans.label}
                                    onClick={() =>
                                      handleSelectAnswer(
                                        item.questionId,
                                        ans.label
                                      )
                                    }
                                    disabled={isSubmitted}
                                    className={`w-full text-left p-3 rounded-lg border flex items-center transition-all dark:text-gray-100 ${btnClass}`}
                                  >
                                    {icon}
                                    <span>{ans.content}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Giải thích & Note (Chỉ hiện sau khi Submit) */}
                            {isSubmitted && (
                              <div className="mt-4 space-y-3 animate-fadeIn">
                                {/* Note của user */}
                                {item.note && (
                                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-100 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                                    <strong>📝 Ghi chú cũ:</strong> {item.note}
                                  </div>
                                )}
                                {/* Giải thích đáp án (nếu có trường explain trong question) */}
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                  <span className="font-bold text-gray-800 dark:text-white">
                                    Đáp án đúng: {q.correctOption}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR (Sticky) --- */}
        <div className="w-80 bg-white dark:bg-zinc-900 border-l border-gray-100 dark:border-zinc-700  shadow-xl hidden lg:flex flex-col z-30">
          {/* Sidebar Header */}
          <div className="p-5 border-b dark:border-zinc-700 border-zinc-400  bg-gray-50 dark:bg-zinc-900">
            <h3 className="font-bold text-gray-700 dark:text-white">Tiến độ làm bài</h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-100 dark:bg-blue-900 border border-blue-500 dark:border-blue-400 rounded-sm"></span>{" "}
                Đã chọn
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 rounded-sm"></span>{" "}
                Chưa làm
              </span>
            </div>
          </div>

          {/* Grid Map */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div className="grid grid-cols-5 gap-2">
              {flatQuestions.map((item, index) => {
                const qId = item.questionId;
                const isAnswered = !!userAnswers[item.questionId];
                const isCorrect =
                  userAnswers[item.questionId] === item.question.correctOption;

                // Màu sắc nút
                let btnClass =
                  "bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-600"; // Mặc định

                if (!isSubmitted) {
                  if (isAnswered)
                    btnClass =
                      "bg-blue-600 text-white border-blue-600 font-medium";
                } else {
                  // Đã nộp
                  if (isCorrect)
                    btnClass = "bg-green-500 text-white border-green-600";
                  else if (isAnswered)
                    btnClass = "bg-red-500 text-white border-red-600";
                  // Làm sai
                  else btnClass = "bg-gray-200 text-gray-400"; // Bỏ qua
                }

                return (
                  <button
                    key={qId}
                    // SỬA Ở ĐÂY: Scroll theo ID câu hỏi
                    onClick={() => scrollToQuestionId(qId)}
                    className={`h-10 w-10 rounded-lg border text-sm flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer (Submit Button) */}
          <div className="p-5 border-t border-zinc-400 dark:border-zinc-700 bg-white dark:bg-zinc-900">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95"
              >
                NỘP BÀI
              </button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Đã hoàn thành</p>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition"
                >
                  Thoát
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="lg:hidden bg-white dark:bg-zinc-900 border-t dark:border-zinc-700 p-3 flex justify-between items-center z-40">
        <span className="text-sm font-medium text-gray-700 dark:text-white">
          Đã làm: {Object.keys(userAnswers).length}/{totalQuestionsCount}
        </span>
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded font-bold text-sm"
          >
            Nộp bài
          </button>
        )}
      </div>
    </div>
  );
}
