
import { useState, useEffect, useMemo } from "react";
import { Query } from "appwrite";
import { useAuth0 } from "@auth0/auth0-react";

import {
  Trophy,
  ClipboardList,
  Target,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock3,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  FileQuestion,
  Search,
  Award,
  Loader2,
} from "lucide-react";

import useResult from "../../hooks/useResult";
import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import useQuestion from "../../hooks/useQuestion";

import type {
  QuestionDoc,
  ResultDoc,
  TestDoc,
} from "../../../types";

import type { CheckedAnswer } from "../Quiz";

import { formatDateTime } from "../../utils/dateFormatter";
import gradeGenerater from "../../utils/gradeGenerater";
import percentageGenerater from "../../utils/percentageGenerater";

type AnalysisTab = "correct" | "wrong" | "skipped";

const StudentTest = () => {
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [results, setResults] = useState<ResultDoc[]>([]);

  const [tab, setTab] = useState<"latest" | "oldest">("latest");
  const [showAnalysis, setShowAnalysis] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AnalysisTab>("correct");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { getResults } = useResult();
  const { getTest } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  const { user } = useAuth0();
  const userId = user?.sub;

  // FETCH STUDENT RESULTS
  useEffect(() => {
    let isMounted = true;

    const fetchStudentResults = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const resultRes = await getResults([
          Query.equal("studentId", userId),
        ]);

        if (!isMounted) return;

        const studentResults = resultRes.rows;
        setResults(studentResults);

        if (studentResults.length === 0) {
          setTests([]);
          setQuestions([]);
          return;
        }

        const testIds = [
          ...new Set(studentResults.map((result) => result.testId)),
        ];

        const [testRes, questionRes] = await Promise.all([
          getTest([Query.equal("$id", testIds)]),
          getQuestions([Query.contains("tests", testIds)]),
        ]);

        if (!isMounted) return;

        setTests(testRes.rows);
        setQuestions(questionRes.rows);
      } catch (err) {
        console.error("Failed to fetch student results:", err);
        if (isMounted) {
          setError("Unable to load your results. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudentResults();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // SORT AND SEARCH RESULTS
  const filteredResults = useMemo(() => {
    const filtered = results.filter((result) => {
      const test = tests.find((t) => t.$id === result.testId);

      return test?.title.toLowerCase().includes(search.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.$createdAt).getTime();
      const dateB = new Date(b.$createdAt).getTime();

      return tab === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [results, tests, tab, search]);

  // GET QUESTIONS OF A TEST
  const getTestQuestions = (testId: string) => {
    return questions.filter((question) =>
      question.tests.includes(testId)
    );
  };

  // GET RESULT ANALYSIS
  const getCheckedAnswers = (result: ResultDoc): CheckedAnswer[] => {
    try {
      const rawAnswers = result.checkedAnswers?.[0];

      if (!rawAnswers) return [];

      const parsed = JSON.parse(rawAnswers);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Invalid checkedAnswers data:", error);
      return [];
    }
  };

  const getCorrectQuestions = (result: ResultDoc) => {
    return getCheckedAnswers(result).filter(
      (answer) => answer.isCorrect
    );
  };

  const getWrongQuestions = (result: ResultDoc) => {
    return getCheckedAnswers(result).filter(
      (answer) => !answer.isCorrect && answer.answer !== ""
    );
  };

  const getSkippedQuestions = (result: ResultDoc) => {
    return getCheckedAnswers(result).filter(
      (answer) => !answer.isCorrect && answer.answer === ""
    );
  };

  // OVERALL STATISTICS
  const totalAttempts = results.length;

  const averagePercentage =
    results.length > 0
      ? Math.round(
          results.reduce((total, result) => {
            const testQuestions = getTestQuestions(result.testId);

            const totalMarks = testQuestions.reduce(
              (sum, question) => sum + Number(question.marks),
              0
            );

            return (
              total +
              Number(
                percentageGenerater(
                  result.obtainedMarks,
                  totalMarks
                )
              )
            );
          }, 0) / results.length
        )
      : 0;

  const bestResult = results.reduce<ResultDoc | null>(
    (best, current) =>
      !best || current.obtainedMarks > best.obtainedMarks
        ? current
        : best,
    null
  );

  // ANALYSIS COUNTS
  const getAnalysisData = (result: ResultDoc) => ({
    correct: getCorrectQuestions(result),
    wrong: getWrongQuestions(result),
    skipped: getSkippedQuestions(result),
  });

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles size={16} />
              Student Performance
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              My Test Results
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track your performance and analyze your answers.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <Trophy size={19} />
            Performance Dashboard
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Attempts
              </p>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <ClipboardList size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {totalAttempts}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Average Score
              </p>
              <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
                <Target size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {averagePercentage}%
            </h2>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Best Marks
              </p>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                <Trophy size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {bestResult?.obtainedMarks ?? 0}
            </h2>
          </div>

        </div>

        {/* RESULTS SECTION */}
        <div className="space-y-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Examination History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your previous test attempts.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search test results..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* SORT TABS */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <div className="flex gap-2">
              <button
                onClick={() => setTab("latest")}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  tab === "latest"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Latest
              </button>

              <button
                onClick={() => setTab("oldest")}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  tab === "oldest"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                Oldest
              </button>
            </div>

            <span className="hidden px-3 text-xs font-medium text-gray-400 sm:block">
              {filteredResults.length} Results
            </span>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-20">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading your results...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-16 text-center">
              <XCircle size={35} className="mx-auto text-red-500" />
              <h3 className="mt-4 font-bold text-gray-900">
                Something went wrong
              </h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BookOpen size={30} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900">
                No results found
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                You have not taken any tests yet. Your examination results will appear here.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
              <Search size={32} className="mx-auto text-gray-400" />
              <h3 className="mt-4 font-bold text-gray-900">
                No matching results
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try searching with another test name.
              </p>
            </div>
          ) : (

            /* RESULT CARDS */
            <div className="space-y-5">
              {filteredResults.map((result) => {
                const test = tests.find(
                  (item) => item.$id === result.testId
                );

                if (!test) return null;

                const testQuestions = getTestQuestions(result.testId);

                const totalMarks = testQuestions.reduce(
                  (total, question) =>
                    total + Number(question.marks),
                  0
                );

                const percentage = Number(
                  percentageGenerater(
                    result.obtainedMarks,
                    totalMarks
                  )
                );

                const grade = gradeGenerater(percentage);

                const analysis = getAnalysisData(result);

                const isExpanded = showAnalysis === result.$id;

                const analysisItems = analysis[activeTab];

                return (
                  <div
                    key={result.$id}
                    className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-lg hover:shadow-gray-200/50"
                  >

                    {/* RESULT HEADER */}
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">

                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-28">
                          {test.thumbnail ? (
                            <img
                              src={getFileView(test.thumbnail)}
                              alt={test.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-blue-50 text-blue-400">
                              <BookOpen size={28} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                            {test.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={13} />
                              {formatDateTime(result.$createdAt)}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock3 size={13} />
                              {test.duration} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                        <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                          <Award size={14} />
                          Grade {grade}
                        </span>

                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {percentage}%
                          </p>
                          <p className="text-xs text-gray-400">
                            Overall Score
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* SCORE PROGRESS */}
                    <div className="px-4 sm:px-5">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                          style={{
                            width: `${Math.max(0, Math.min(100, percentage))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* RESULT STATS */}
                    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4 sm:p-5">

                      <Stat
                        icon={<Trophy size={17} />}
                        label="Obtained Marks"
                        value={`${result.obtainedMarks}/${totalMarks}`}
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                      />

                      <Stat
                        icon={<XCircle size={17} />}
                        label="Wrong Answers"
                        value={result.totalWrong}
                        color="text-red-600"
                        bg="bg-red-50"
                      />

                      <Stat
                        icon={<MinusCircle size={17} />}
                        label="Skipped"
                        value={result.totalSkipped}
                        color="text-amber-600"
                        bg="bg-amber-50"
                      />

                      <Stat
                        icon={<FileQuestion size={17} />}
                        label="Total Questions"
                        value={testQuestions.length}
                        color="text-blue-600"
                        bg="bg-blue-50"
                      />

                    </div>

                    {/* ANALYSIS BUTTON */}
                    <div className="border-t border-gray-100 p-4 sm:px-5">
                      <button
                        onClick={() => {
                          setShowAnalysis((prev) =>
                            prev === result.$id ? "" : result.$id
                          );
                          setActiveTab("correct");
                        }}
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                          isExpanded
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-blue-600 text-white shadow-md shadow-blue-600/15 hover:bg-blue-700"
                        }`}
                      >
                        {isExpanded ? (
                          <>
                            Hide Analysis
                            <ChevronUp size={17} />
                          </>
                        ) : (
                          <>
                            View Detailed Analysis
                            <ChevronDown size={17} />
                          </>
                        )}
                      </button>
                    </div>

                    {/* ANALYSIS SECTION */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-[#fafbff] p-4 sm:p-6">

                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-gray-900">
                            Answer Analysis
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Review your answers and correct options.
                          </p>
                        </div>

                        {/* ANALYSIS TABS */}
                        <div className="mb-5 grid grid-cols-3 gap-2">

                          <AnalysisButton
                            active={activeTab === "correct"}
                            onClick={() => setActiveTab("correct")}
                            label="Correct"
                            count={analysis.correct.length}
                            color="green"
                            icon={<CheckCircle2 size={16} />}
                          />

                          <AnalysisButton
                            active={activeTab === "wrong"}
                            onClick={() => setActiveTab("wrong")}
                            label="Wrong"
                            count={analysis.wrong.length}
                            color="red"
                            icon={<XCircle size={16} />}
                          />

                          <AnalysisButton
                            active={activeTab === "skipped"}
                            onClick={() => setActiveTab("skipped")}
                            label="Skipped"
                            count={analysis.skipped.length}
                            color="amber"
                            icon={<MinusCircle size={16} />}
                          />

                        </div>

                        {/* QUESTION LIST */}
                        <div className="space-y-4">

                          {analysisItems.length > 0 ? (
                            analysisItems.map((q, index) => (
                              <div
                                key={`${result.$id}-${activeTab}-${index}`}
                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                              >

                                {/* QUESTION TITLE */}
                                <div className="mb-4 flex items-start gap-3">
                                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                                    {index + 1}
                                  </span>

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                      {q.title}
                                    </p>

                                    <span
                                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                        q.isCorrect
                                          ? "bg-emerald-50 text-emerald-700"
                                          : q.answer === ""
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-red-50 text-red-700"
                                      }`}
                                    >
                                      {q.isCorrect
                                        ? "Correct Answer"
                                        : q.answer === ""
                                          ? "Not Attempted"
                                          : "Incorrect Answer"}
                                    </span>
                                  </div>
                                </div>

                                {/* OPTIONS */}
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                  {(["A", "B", "C", "D"] as const).map(
                                    (option) => {
                                      const optionText =
                                        q[`option${option}` as keyof typeof q];

                                      const isCorrect =
                                        option === q.correctAnswer;

                                      const isSelected =
                                        option === q.answer;

                                      let optionStyle =
                                        "border-gray-100 bg-gray-50 text-gray-600";

                                      if (isCorrect) {
                                        optionStyle =
                                          "border-emerald-200 bg-emerald-50 text-emerald-800";
                                      } else if (isSelected) {
                                        optionStyle =
                                          "border-red-200 bg-red-50 text-red-700";
                                      }

                                      return (
                                        <div
                                          key={option}
                                          className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${optionStyle}`}
                                        >
                                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/80 text-xs font-bold">
                                            {option}
                                          </span>

                                          <span className="min-w-0 flex-1 break-words">
                                            {String(optionText ?? "")}
                                          </span>

                                          {isCorrect && (
                                            <CheckCircle2
                                              size={18}
                                              className="shrink-0 text-emerald-600"
                                            />
                                          )}

                                          {!isCorrect && isSelected && (
                                            <XCircle
                                              size={18}
                                              className="shrink-0 text-red-600"
                                            />
                                          )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>

                                {/* ANSWER SUMMARY */}
                                <div className="mt-4 flex flex-col gap-2 rounded-xl bg-gray-50 p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                                  <p className="text-gray-600">
                                    Your Answer:{" "}
                                    <span className="font-bold text-gray-900">
                                      {q.answer || "Not Attempted"}
                                    </span>
                                  </p>

                                  <p className="text-emerald-700">
                                    Correct Answer:{" "}
                                    <span className="font-bold">
                                      {q.correctAnswer}
                                    </span>
                                  </p>
                                </div>

                              </div>
                            ))
                          ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-white py-10 text-center">
                              <CheckCircle2
                                size={28}
                                className="mx-auto text-gray-300"
                              />
                              <p className="mt-3 text-sm font-semibold text-gray-700">
                                No {activeTab} answers
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                There are no questions in this category.
                              </p>
                            </div>
                          )}

                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// STAT COMPONENT
function Stat({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 transition hover:bg-white hover:shadow-sm sm:p-4">
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${bg} ${color}`}>
        {icon}
      </div>

      <p className={`text-lg font-bold ${color}`}>
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

// ANALYSIS TAB COMPONENT
function AnalysisButton({
  active,
  onClick,
  label,
  count,
  color,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: "green" | "red" | "amber";
  icon: React.ReactNode;
}) {
  const styles = {
    green: active
      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",

    red: active
      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
      : "bg-red-50 text-red-700 hover:bg-red-100",

    amber: active
      ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
      : "bg-amber-50 text-amber-700 hover:bg-amber-100",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-xs font-semibold transition sm:gap-2 sm:text-sm ${styles[color]}`}
    >
      {icon}
      {label}
      <span className="rounded-md bg-white/20 px-1.5 py-0.5">
        {count}
      </span>
    </button>
  );
}

export default StudentTest;
