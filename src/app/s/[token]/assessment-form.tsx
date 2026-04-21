"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/types/database";

interface Props {
  questions: Question[];
  token: string;
}

export default function AssessmentForm({ questions, token }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const pageQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  function handleSelect(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleNext() {
    const unanswered = pageQuestions.filter(
      (q) => q.required && !(q.id in answers)
    );
    if (unanswered.length > 0) {
      setError("请完成当前页面所有题目后再继续");
      return;
    }
    setError(null);
    setCurrentPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePrev() {
    setError(null);
    setCurrentPage((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    const unanswered = questions.filter(
      (q) => q.required && !(q.id in answers)
    );
    if (unanswered.length > 0) {
      setError(`还有 ${unanswered.length} 道必答题未完成`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/submit/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "提交失败");
      }

      router.push(`/s/${token}/done`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "提交失败，请重试");
      setSubmitting(false);
    }
  }

  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress bar */}
      <div
        className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-950 pb-3"
        style={{ paddingTop: "max(0.75rem, var(--sat))" }}
      >
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          <span>
            已完成 {answeredCount}/{questions.length}
          </span>
          <span>
            第 {currentPage + 1}/{totalPages} 页
          </span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 sm:space-y-6">
        {pageQuestions.map((question, idx) => {
          const globalIdx = currentPage * questionsPerPage + idx;
          return (
            <div
              key={question.id}
              className="p-4 sm:p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">
                <span className="text-zinc-400 dark:text-zinc-500 mr-2">
                  {globalIdx + 1}.
                </span>
                {question.text}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleSelect(question.id, option.value)
                      }
                      className={`
                        px-3 py-3.5 sm:px-4 sm:py-3 rounded-lg text-sm font-medium transition-all
                        border-2 cursor-pointer active:scale-[0.97]
                        ${
                          selected
                            ? "bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-300"
                            : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div
        className="flex gap-3 pt-4"
        style={{ paddingBottom: "max(2rem, calc(var(--sab) + 1rem))" }}
      >
        {currentPage > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 py-3.5 sm:py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
          >
            上一页
          </button>
        )}
        {isLastPage ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3.5 sm:py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer active:scale-[0.98]"
          >
            {submitting ? "提交中..." : "提交问卷"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 sm:py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors cursor-pointer active:scale-[0.98]"
          >
            下一页
          </button>
        )}
      </div>
    </div>
  );
}
