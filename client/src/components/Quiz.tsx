
import { useState, useEffect } from "react";
import { ID, Query } from "appwrite";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Clock3,
  CheckCircle2,
  Circle,
  FileText,
  Trophy,
  Timer as TimerIcon,
  Send,
  ArrowRight,
  ShieldCheck,
  CircleHelp,
  ClipboardList,
} from "lucide-react";

import Typo from "./Typo";
import Timer from "./Timer";
import Leaderboard from "./Leaderboard";
import SpinnerButton from "./SpinnerButton";

import useQuestion from "./../hooks/useQuestion";
import useResult from "./../hooks/useResult";
import useTest from "./../hooks/useTest";

import type {
  QuestionDoc,
  TestDoc,
  ResultDoc,
  Result,
} from "./../../types";

interface YourAnswer {
  questionId: string;
  answer: string;
}

export interface CheckedAnswer extends QuestionDoc {
  isCorrect: boolean;
  answer: string;
}

interface QuizProps {
  test: TestDoc | null;
  testCode: string;
}

const OPTIONS = ["A", "B", "C", "D"] as const;

const Quiz = ({ test, testCode }: QuizProps) => {
  const { user } = useAuth0();
  const userId = user?.sub;

  const { getQuestions } = useQuestion();
  const { createResult, getResult } = useResult();
  const { pushTestCode } = useTest();

  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [yourAnswers, setYourAnswers] = useState<YourAnswer[]>([]);
  const [result, setResult] = useState<ResultDoc | null>(null);

  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimerStop, setIsTimerStop] = useState(false);

  // Fetch questions
  useEffect(() => {
    if (!test) {
      setQuestions([]);
      setIsLoadingQuestions(false);
      return;
    }

    let active = true;

    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);

      try {
        const response = await getQuestions([
          Query.contains("tests", test.$id),
        ]);

        if (active) {
          setQuestions(response.rows);
        }
      } catch (error) {
        console.error("Question loading error:", error);

        if (active) {
          setQuestions([]);
        }
      } finally {
        if (active) {
          setIsLoadingQuestions(false);
        }
      }
    };

    void fetchQuestions();

    return () => {
      active = false;
    };
  }, [test]);

  // Answer selection
  const handleOption = (questionId: string, answer: string) => {
    setYourAnswers((previous) => {
      const existing = previous.find(
        (item) =>
          item.questionId === questionId && item.answer === answer
      );

      const filtered = previous.filter(
        (item) => item.questionId !== questionId
      );

      return existing
        ? filtered
        : [...filtered, { questionId, answer }];
    });
  };

  // Timer callback
  const handleStopTimer = (flag: boolean) => {
    if (flag) {
      setIsTimerStop(true);
    }
  };

  // Submit test
  const handleSubmit = async () => {
    if (isSubmitting || result) return;

    if (!userId) {
      alert("Please login to submit the test");
      return;
    }

    if (!questions?.length) {
      alert("Questions are not available");
      return;
    }

    setIsSubmitting(true);

    const checkedAnswers: CheckedAnswer[] = questions.map((question) => {
      const selected = yourAnswers.find(
        (item) => item.questionId === question.$id
      );

      return {
        ...question,
        answer: selected?.answer || "",
        isCorrect:
          !!selected && selected.answer === question.correctAnswer,
      };
    });

    const totalMarks = questions.reduce(
      (total, question) => total + Number(question.marks),
      0
    );

    const totalCorrect = checkedAnswers.filter(
      (answer) => answer.isCorrect
    ).length;

    const totalWrong = checkedAnswers.filter(
      (answer) => !answer.isCorrect && answer.answer !== ""
    ).length;

    const totalSkipped = checkedAnswers.filter(
      (answer) => answer.answer === ""
    ).length;

    const obtainedMarks = checkedAnswers.reduce(
      (total, answer) =>
        answer.isCorrect ? total + Number(answer.marks) : total,
      0
    );

    const resultData: Result = {
      $id: ID.unique(),
      studentId: userId,
      testId: test?.$id || "",
      checkedAnswers: [JSON.stringify(checkedAnswers)],
      totalMarks,
      totalCorrect,
      totalWrong,
      totalSkipped,
      obtainedMarks,
      rank: 1,
      testCode,
    };

    try {
      const created = await createResult(resultData);
      const savedResult = await getResult(created.$id);

      if (!savedResult) {
        throw new Error("Unable to retrieve result");
      }

      setResult(savedResult);

      if (!testCode) {
        await pushTestCode(savedResult.testId, savedResult.testCode);
      }

      alert("Test submitted successfully");
    } catch (error) {
      console.error("Test submission error:", error);
      alert("Error submitting test");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto submit when timer ends
  useEffect(() => {
    if (isTimerStop && !result) {
      void handleSubmit();
    }
  }, [isTimerStop]);

  const totalQuestions = questions?.length || 0;
  const answeredCount = yourAnswers.length;
  const skippedCount = totalQuestions - answeredCount;

  const totalMarks =
    questions?.reduce(
      (total, question) => total + Number(question.marks),
      0
    ) || 0;

  const progress =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="h-32 animate-pulse rounded-3xl bg-white" />
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="hidden h-96 animate-pulse rounded-3xl bg-white lg:block" />
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-3xl bg-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] px-3 py-6 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
          <Leaderboard students={[result]} />
        </div>
      </div>
    );
  }

  // No questions
  if (!questions?.length) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#F6F7FB] px-4">
        <div className="max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CircleHelp size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No questions found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Questions are not available for this test right now.
            Please contact your instructor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6 lg:px-8">

      <div className="mx-auto max-w-[1440px]">

        {/* TOP HEADER */}
        <header className="mb-5 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">

          <div className="p-4 sm:p-6 lg:p-7">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    Examination Live
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                    ID: {testCode || "GENERAL"}
                  </span>
                </div>

                <h1 className="break-words text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                  {test?.title || "Online Examination"}
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
                  Answer all the questions carefully. Your progress is
                  displayed below. Submit your test before the timer ends.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-800">
                    Secure Test
                  </p>
                  <p className="mt-0.5 text-[10px] text-emerald-600">
                    Stay focused
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="border-t border-slate-100 px-4 py-4 sm:px-6 lg:px-7">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">
                Your progress
              </span>

              <span className="text-xs font-bold text-indigo-600">
                {progress}% completed
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">

          {/* DESKTOP SIDEBAR */}
          <aside className="hidden min-w-0 space-y-4 lg:sticky lg:top-24 lg:block">

            {/* TIMER CARD */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Clock3 size={17} className="text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-800">
                    Time remaining
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="rounded-2xl bg-red-50 p-4 text-center">
                  <div className="mb-2 flex items-center justify-center gap-2 text-red-500">
                    <TimerIcon size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Countdown
                    </span>
                  </div>

                  <Timer
                    className="text-3xl font-extrabold tabular-nums text-red-600"
                    stop={handleStopTimer}
                    time={Number(test?.duration) * 60}
                    isRunning={true}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-medium text-slate-400">
                      Duration
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {test?.duration} min
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-medium text-slate-400">
                      Total marks
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {totalMarks}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUESTION NAVIGATOR */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Question palette
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Navigate between questions
                  </p>
                </div>

                <span className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-600">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const answered = yourAnswers.some(
                    (item) => item.questionId === question.$id
                  );

                  return (
                    <button
                      key={question.$id}
                      type="button"
                      aria-label={`Go to question ${index + 1}`}
                      onClick={() =>
                        document
                          .getElementById(question.$id)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          })
                      }
                      className={`grid aspect-square min-w-0 place-items-center rounded-xl border text-xs font-bold transition-all ${
                        answered
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-indigo-600" />
                  <span className="text-[11px] text-slate-500">
                    Answered
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border border-slate-300 bg-white" />
                  <span className="text-[11px] text-slate-500">
                    Not answered
                  </span>
                </div>
              </div>
            </div>

            {/* SUBMIT CARD */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-indigo-900">
                  Test summary
                </h2>
              </div>

              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-indigo-700">Answered</span>
                <span className="font-bold text-indigo-900">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="text-indigo-700">Remaining</span>
                <span className="font-bold text-indigo-900">
                  {skippedCount}
                </span>
              </div>

              <SpinnerButton
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Test <Send size={15} />
              </SpinnerButton>

              <p className="mt-3 text-center text-[10px] leading-5 text-indigo-500">
                Please review your answers before submitting.
              </p>
            </div>
          </aside>

          {/* QUESTION CONTENT */}
          <main className="min-w-0 space-y-5 pb-52 lg:pb-10">

            {/* MOBILE STATS */}
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5 text-slate-400">
                  <FileText size={13} />
                  <span className="text-[10px] font-semibold">Questions</span>
                </div>
                <p className="text-xl font-extrabold text-slate-900">
                  {totalQuestions}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 size={13} />
                  <span className="text-[10px] font-semibold">Answered</span>
                </div>
                <p className="text-xl font-extrabold text-slate-900">
                  {answeredCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-1.5 text-orange-500">
                  <Circle size={13} />
                  <span className="text-[10px] font-semibold">Pending</span>
                </div>
                <p className="text-xl font-extrabold text-slate-900">
                  {skippedCount}
                </p>
              </div>
            </div>

            {/* QUESTION CARDS */}
            {questions.map((question, index) => {
              const selectedAnswer = yourAnswers.find(
                (item) => item.questionId === question.$id
              );

              return (
                <section
                  key={question.$id}
                  id={question.$id}
                  className="min-w-0 scroll-mt-28 rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6 lg:p-7"
                >
                  {/* QUESTION TOP */}
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-600">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Question
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {index + 1} of {totalQuestions}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-700">
                      {question.marks} Marks
                    </span>
                  </div>

                  {/* QUESTION TEXT */}
                  <div className="mb-6 min-w-0">
                    <Typo className="whitespace-normal break-words text-base font-semibold leading-8 text-slate-800 sm:text-lg">
                      {question.title}
                    </Typo>
                  </div>

                  {/* OPTIONS */}
                  <div className="grid min-w-0 grid-cols-1 gap-3 overflow-visible sm:grid-cols-2">
                    {OPTIONS.map((option) => {
                      const optionText = (question as any)[
                        `option${option}`
                      ];

                      const isSelected =
                        selectedAnswer?.answer === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleOption(question.$id, option)
                          }
                          aria-pressed={isSelected}
                          className={`group flex min-h-[68px] w-full min-w-0 items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 sm:p-4 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                              : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                          }`}
                        >
                          {/* OPTION LETTER */}
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold transition-colors ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                            }`}
                          >
                            {option}
                          </span>

                          {/* OPTION TEXT */}
                          <span
                            className={`min-w-0 flex-1 whitespace-normal break-words text-sm font-medium leading-6 [overflow-wrap:anywhere] ${
                              isSelected
                                ? "text-indigo-900"
                                : "text-slate-700"
                            }`}
                          >
                            {optionText || "No option text"}
                          </span>

                          {/* SELECTED ICON */}
                          {isSelected && (
                            <CheckCircle2
                              size={19}
                              className="ml-auto shrink-0 text-indigo-600"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* ANSWER STATUS */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">
                      {selectedAnswer
                        ? `You selected option ${selectedAnswer.answer}`
                        : "Select one option to answer"}
                    </p>

                    {selectedAnswer ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-600">
                        <CheckCircle2 size={13} />
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">
                        <Circle size={11} />
                        Pending
                      </span>
                    )}
                  </div>
                </section>
              );
            })}

            {/* END OF QUESTIONS */}
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Trophy size={23} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-800">
                You have reached the end!
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Review your answers and submit your test when you are ready.
              </p>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Back to top <ArrowRight size={14} className="-rotate-90" />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">

        {/* MOBILE TIMER + SUBMIT */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
              <Clock3 size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Time remaining
              </p>

              <Timer
                className="text-lg font-extrabold tabular-nums text-red-600"
                stop={handleStopTimer}
                time={Number(test?.duration) * 60}
                isRunning={true}
              />
            </div>
          </div>

          <SpinnerButton
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-50"
          >
            Submit <Send size={14} />
          </SpinnerButton>
        </div>

        {/* MOBILE QUESTION NAVIGATOR */}
        <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
          <span className="shrink-0 text-[10px] font-bold text-slate-500">
            QUESTIONS
          </span>

          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {questions.map((question, index) => {
              const answered = yourAnswers.some(
                (item) => item.questionId === question.$id
              );

              return (
                <button
                  key={question.$id}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(question.$id)
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                  }
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-[10px] font-bold ${
                    answered
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <span className="shrink-0 text-[10px] font-bold text-indigo-600">
            {answeredCount}/{totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
