
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Radio,
  Ticket,
  Clock3,
  Trophy,
  BookOpenCheck,
  Search,
  CheckCircle2,
  XCircle,
  CircleHelp,
  ArrowRight,
  CalendarDays,
  FileQuestion,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
} from "lucide-react";

import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import useQuestion from "../../hooks/useQuestion";
import useResult from "../../hooks/useResult";

import type {
  TestDoc,
  QuestionDoc,
  ResultDoc,
} from "../../../types";

import { formatDateTime } from "../../utils/dateFormatter";
import type { CheckedAnswer } from "../Quiz";

type MainTab = "live" | "join";
type SortTab = "latest" | "oldest";
type AnalysisTab = "correct" | "wrong" | "skipped";

const parseAnswers = (result: ResultDoc): CheckedAnswer[] => {
  try {
    const rawAnswers = result.checkedAnswers?.[0];

    if (!rawAnswers) return [];

    const parsed = JSON.parse(rawAnswers);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function LiveTestManager() {
  const { user } = useAuth0();
  const userId = user?.sub;

  const navigate = useNavigate();

  const { getTest, getSingleTest } = useTest();
  const { getResults } = useResult();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  const [activeTab, setActiveTab] = useState<MainTab>("live");
  const [liveTab, setLiveTab] = useState<SortTab>("latest");
  const [analysisActiveTab, setAnalysisActiveTab] =
    useState<AnalysisTab>("correct");

  const [results, setResults] = useState<ResultDoc[]>([]);
  const [liveTests, setLiveTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);

  const [liveCode, setLiveCode] = useState("");
  const [search, setSearch] = useState("");

  const [showAnalysis, setShowAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");

  // Fetch student's live results
  useEffect(() => {
    let mounted = true;

    const fetchLiveResults = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const resultRes = await getResults([
          Query.equal("studentId", userId),
          Query.startsWith("testCode", "LIVE"),
        ]);

        if (!mounted) return;

        const studentResults = resultRes.rows;
        setResults(studentResults);

        const testIds = [
          ...new Set(studentResults.map((result) => result.testId)),
        ];

        if (testIds.length === 0) {
          setLiveTests([]);
          setQuestions([]);
          return;
        }

        const [testRes, questionRes] = await Promise.all([
          getTest([Query.equal("$id", testIds)]),
          getQuestions([Query.equal("tests", testIds)]),
        ]);

        if (!mounted) return;

        setLiveTests(testRes.rows);
        setQuestions(questionRes.rows);
      } catch (err) {
        console.error("Failed to load live results:", err);

        if (mounted) {
          setError("Unable to load your live test results. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLiveResults();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Sort and search results
  const filteredResults = useMemo(() => {
    return [...results]
      .filter((result) => {
        const test = liveTests.find(
          (item) => item.$id === result.testId,
        );

        return (
          test?.title?.toLowerCase().includes(search.toLowerCase()) ?? false
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.$createdAt).getTime();
        const dateB = new Date(b.$createdAt).getTime();

        return liveTab === "latest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [results, liveTests, liveTab, search]);

  // Get questions for a particular test
  const getTestQuestions = (testId: string) => {
    return questions.filter((question) =>
      question.tests.includes(testId),
    );
  };

  // Calculate total marks
  const getTotalMarks = (testId: string) => {
    return getTestQuestions(testId).reduce(
      (total, question) => total + Number(question.marks || 0),
      0,
    );
  };

  // Answer analysis helpers
  const getCorrectQuestions = (result: ResultDoc) => {
    return parseAnswers(result).filter((answer) => answer.isCorrect);
  };

  const getWrongQuestions = (result: ResultDoc) => {
    return parseAnswers(result).filter(
      (answer) => !answer.isCorrect && answer.answer !== "",
    );
  };

  const getSkippedQuestions = (result: ResultDoc) => {
    return parseAnswers(result).filter(
      (answer) => !answer.isCorrect && answer.answer === "",
    );
  };

  // Dashboard statistics
  const totalAttempts = results.length;

  const totalCorrect = results.reduce(
    (total, result) =>
      total + getCorrectQuestions(result).length,
    0,
  );

  const totalWrong = results.reduce(
    (total, result) => total + Number(result.totalWrong || 0),
    0,
  );

  // Join live test
  const handleLiveJoin = async () => {
    if (joining) return;

    setJoinError("");
    setJoinSuccess("");

    if (!userId) {
      setJoinError("Please login to join a live test.");
      return;
    }

    const code = liveCode.trim();

    if (!code.startsWith("LIVE")) {
      setJoinError("Invalid test code. Code must start with LIVE.");
      return;
    }

    const parts = code.split(":");

    if (parts.length < 2 || !parts[1]) {
      setJoinError(
        "Invalid code structure. Expected format: LIVE03:testId",
      );
      return;
    }

    const testId = parts[1];
    const expiry = parts[2];

    if (parts.length > 3) {
      setJoinError("Invalid test code format.");
      return;
    }

    if (expiry) {
      const expiryTime = Number(expiry);

      if (!Number.isFinite(expiryTime)) {
        setJoinError("Invalid expiry time in test code.");
        return;
      }

      if (Date.now() > expiryTime) {
        setJoinError("This test code has expired.");
        return;
      }
    }

    try {
      setJoining(true);

      const test = await getSingleTest(testId);

      if (!test) {
        setJoinError("Test not found. Please check your code.");
        return;
      }

      const isCodeExist = test.testCodes?.includes(code);

      if (!isCodeExist) {
        setJoinError("This live code does not exist.");
        return;
      }

      const existingResults = await getResults([
        Query.equal("testCode", code),
        Query.equal("studentId", userId),
      ]);

      if (existingResults.total > 0) {
        setJoinError("You have already attempted this live test.");
        return;
      }

      navigate(
        `/student/live/quiz/${testId}?liveCode=${encodeURIComponent(code)}`,
      );
    } catch (err) {
      console.error("Live test join failed:", err);
      setJoinError("Unable to join the test. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setJoinError("");
    setJoinSuccess("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#FF0A2B]">
              <Radio size={17} />
              STUDENT PORTAL
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Live Tests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Join live exams and track your performance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-green-100 bg-white px-4 py-2.5 shadow-sm">
            <ShieldCheck size={17} className="text-green-600" />
            <span className="text-xs font-bold text-slate-700">
              STUDENT ACCOUNT
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            title="Live Attempts"
            value={totalAttempts}
            icon={<BookOpenCheck size={21} />}
            color="blue"
          />

          <StatCard
            title="Correct Answers"
            value={totalCorrect}
            icon={<CheckCircle2 size={21} />}
            color="green"
          />

          <StatCard
            title="Wrong Answers"
            value={totalWrong}
            icon={<XCircle size={21} />}
            color="red"
          />
        </div>

        {/* Main Tabs */}
        <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            onClick={() => handleTabChange("live")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "live"
                ? "bg-[#FF0A2B] text-white shadow-md shadow-red-500/20"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Trophy size={17} />
            My Results
          </button>

          <button
            onClick={() => handleTabChange("join")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeTab === "join"
                ? "bg-[#FF0A2B] text-white shadow-md shadow-red-500/20"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Ticket size={17} />
            Join Test
          </button>
        </div>

        {/* Results Tab */}
        {activeTab === "live" && (
          <div className="space-y-5">

            {/* Results Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Test Results
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Review your previous live test performance.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search test..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#FF0A2B] focus:ring-2 focus:ring-red-100 sm:w-52"
                  />
                </div>

                {/* Sorting */}
                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setLiveTab("latest")}
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      liveTab === "latest"
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Latest
                  </button>

                  <button
                    onClick={() => setLiveTab("oldest")}
                    className={`flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                      liveTab === "oldest"
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Oldest
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle size={18} />
                  Something went wrong
                </div>
                <p className="mt-2">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && results.length === 0 && (
              <EmptyState
                icon={<BookOpenCheck size={30} />}
                title="No live test results yet"
                description="You haven't attempted any live tests. Join a live test using an access code to get started."
              />
            )}

            {/* No Search Result */}
            {!loading &&
              !error &&
              results.length > 0 &&
              filteredResults.length === 0 && (
                <EmptyState
                  icon={<Search size={30} />}
                  title="No matching tests"
                  description="Try searching with a different test name."
                />
              )}

            {/* Result Cards */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredResults.map((result) => {
                  const test = liveTests.find(
                    (item) => item.$id === result.testId,
                  );

                  if (!test) return null;

                  const testQuestions = getTestQuestions(result.testId);
                  const totalMarks = getTotalMarks(result.testId);

                  const obtainedMarks = Number(result.obtainedMarks || 0);

                  const percentage =
                    totalMarks > 0
                      ? Math.round((obtainedMarks / totalMarks) * 100)
                      : 0;

                  const correctQuestions =
                    getCorrectQuestions(result);

                  const wrongQuestions =
                    getWrongQuestions(result);

                  const skippedQuestions =
                    getSkippedQuestions(result);

                  const isExpanded = showAnalysis === result.$id;

                  return (
                    <div
                      key={result.$id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
                    >
                      <div className="p-4 sm:p-5">

                        {/* Test Information */}
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-20">
                            {test.thumbnail ? (
                              <img
                                src={getFileView(test.thumbnail)}
                                alt={test.title}
                                className="size-full object-cover"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-slate-400">
                                <BookOpenCheck size={25} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-bold text-slate-900 sm:text-base">
                              {test.title}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
                              <span className="flex items-center gap-1">
                                <CalendarDays size={13} />
                                {formatDateTime(result.$createdAt)}
                              </span>

                              <span className="hidden text-slate-300 sm:inline">
                                •
                              </span>

                              <span className="flex items-center gap-1">
                                <FileQuestion size={13} />
                                {testQuestions.length} Questions
                              </span>
                            </div>

                            <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                              <Target size={12} />
                              {percentage}% Score
                            </div>
                          </div>

                          <div className="hidden shrink-0 text-right sm:block">
                            <p className="text-2xl font-bold text-slate-900">
                              {obtainedMarks}
                              <span className="text-sm font-medium text-slate-400">
                                /{totalMarks}
                              </span>
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400">
                              OBTAINED MARKS
                            </p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500">
                              Performance
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {percentage}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF0A2B] to-orange-400 transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.max(0, percentage))}%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <Stat
                            label="Obtained Marks"
                            value={`${obtainedMarks}/${totalMarks}`}
                            color="green"
                          />

                          <Stat
                            label="Correct"
                            value={correctQuestions.length}
                            color="green"
                          />

                          <Stat
                            label="Wrong"
                            value={result.totalWrong}
                            color="red"
                          />

                          <Stat
                            label="Skipped"
                            value={result.totalSkipped}
                            color="amber"
                          />
                        </div>

                        {/* Analysis Button */}
                        <button
                          onClick={() => {
                            setShowAnalysis((previous) =>
                              previous === result.$id ? "" : result.$id,
                            );
                            setAnalysisActiveTab("correct");
                          }}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-[#FF0A2B]"
                        >
                          {isExpanded ? (
                            <>
                              Hide Answer Analysis
                              <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              View Answer Analysis
                              <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Answer Analysis */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">

                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-slate-900">
                              Answer Analysis
                            </h4>
                            <p className="mt-1 text-xs text-slate-500">
                              Review your answers and correct options.
                            </p>
                          </div>

                          {/* Analysis Tabs */}
                          <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-1">
                            <AnalysisTabButton
                              active={analysisActiveTab === "correct"}
                              onClick={() => setAnalysisActiveTab("correct")}
                              label="Correct"
                              count={correctQuestions.length}
                              color="green"
                            />

                            <AnalysisTabButton
                              active={analysisActiveTab === "wrong"}
                              onClick={() => setAnalysisActiveTab("wrong")}
                              label="Wrong"
                              count={wrongQuestions.length}
                              color="red"
                            />

                            <AnalysisTabButton
                              active={analysisActiveTab === "skipped"}
                              onClick={() => setAnalysisActiveTab("skipped")}
                              label="Skipped"
                              count={skippedQuestions.length}
                              color="amber"
                            />
                          </div>

                          {/* Analysis Questions */}
                          <div className="space-y-3">
                            {(() => {
                              const answerList =
                                analysisActiveTab === "correct"
                                  ? correctQuestions
                                  : analysisActiveTab === "wrong"
                                    ? wrongQuestions
                                    : skippedQuestions;

                              if (answerList.length === 0) {
                                return (
                                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                    <CheckCircle2
                                      size={28}
                                      className="mx-auto mb-2 text-slate-300"
                                    />
                                    <p className="text-sm font-semibold text-slate-600">
                                      No questions in this category
                                    </p>
                                  </div>
                                );
                              }

                              return answerList.map((question, index) => (
                                <QuestionAnalysis
                                  key={`${result.$id}-${analysisActiveTab}-${index}`}
                                  question={question}
                                  index={index}
                                  type={analysisActiveTab}
                                />
                              ));
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Join Tab */}
        {activeTab === "join" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">

            {/* Join Form */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="bg-slate-900 p-5 text-white sm:p-7">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white/10">
                  <Ticket size={24} />
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  Join Live Test
                </h2>

                <p className="mt-2 max-w-lg text-xs leading-5 text-slate-300 sm:text-sm">
                  Enter the live test access code provided by your teacher
                  to start your examination.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-7">

                {/* Code Input */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Live Test Access Code
                  </label>

                  <div className="relative">
                    <Ticket
                      size={18}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={liveCode}
                      onChange={(e) => {
                        setLiveCode(e.target.value);
                        setJoinError("");
                        setJoinSuccess("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLiveJoin();
                        }
                      }}
                      placeholder="Example: LIVE03:testId"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold uppercase tracking-wide text-slate-800 outline-none transition placeholder:font-normal placeholder:normal-case placeholder:tracking-normal focus:border-[#FF0A2B] focus:bg-white focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Code format: LIVE prefix followed by test ID.
                  </p>
                </div>

                {/* Validation Error */}
                {joinError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <p>{joinError}</p>
                  </div>
                )}

                {joinSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                    <CheckCircle2 size={17} />
                    {joinSuccess}
                  </div>
                )}

                {/* Join Button */}
                <button
                  type="button"
                  onClick={handleLiveJoin}
                  disabled={joining || !liveCode.trim()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF0A2B] px-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#e50928] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {joining ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    <>
                      Join Live Test
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4 lg:sticky lg:top-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles size={20} />
                </div>

                <h3 className="text-sm font-bold text-slate-900">
                  How to Join?
                </h3>

                <div className="mt-4 space-y-4">
                  <Instruction
                    number="01"
                    title="Get Access Code"
                    description="Ask your teacher for the live test code."
                  />

                  <Instruction
                    number="02"
                    title="Enter Code"
                    description="Enter the code in the input field."
                  />

                  <Instruction
                    number="03"
                    title="Start Test"
                    description="After verification, your test will open."
                  />
                </div>
              </div>

              <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <Clock3
                  size={19}
                  className="mt-0.5 shrink-0 text-amber-600"
                />

                <div>
                  <h4 className="text-xs font-bold text-amber-800">
                    Important
                  </h4>
                  <p className="mt-1 text-[11px] leading-5 text-amber-700">
                    Each live test code can be used only once per student.
                    Expired codes cannot be used.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Statistics Card
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "green" | "red";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`flex size-11 items-center justify-center rounded-xl ${styles[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Statistics
function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: "green" | "red" | "amber";
}) {
  const styles = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className={`rounded-xl p-3 text-center ${styles[color]}`}>
      <p className="text-base font-bold">{value}</p>
      <p className="mt-1 text-[10px] font-semibold opacity-80">
        {label}
      </p>
    </div>
  );
}

// Analysis Tab Button
function AnalysisTabButton({
  active,
  onClick,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  color: "green" | "red" | "amber";
}) {
  const styles = {
    green: active
      ? "bg-green-600 text-white"
      : "text-green-700 hover:bg-green-50",
    red: active
      ? "bg-red-600 text-white"
      : "text-red-700 hover:bg-red-50",
    amber: active
      ? "bg-amber-500 text-white"
      : "text-amber-700 hover:bg-amber-50",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-xs font-bold transition sm:flex-row sm:gap-2 ${styles[color]}`}
    >
      {label}
      <span className={active ? "opacity-90" : "opacity-70"}>
        ({count})
      </span>
    </button>
  );
}

// Question Analysis
function QuestionAnalysis({
  question,
  index,
  type,
}: {
  question: CheckedAnswer;
  index: number;
  type: AnalysisTab;
}) {
  const options = ["A", "B", "C", "D"] as const;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
          {index + 1}
        </span>

        <p className="text-sm font-semibold leading-6 text-slate-800">
          {question.title}
        </p>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const optionKey = `option${option}` as keyof CheckedAnswer;
          const optionText = question[optionKey];

          const isCorrect = option === question.correctAnswer;
          const isSelected = option === question.answer;

          let style =
            "border-slate-200 bg-white text-slate-600";

          if (isCorrect) {
            style =
              "border-green-200 bg-green-50 text-green-700";
          } else if (isSelected && type !== "correct") {
            style =
              "border-red-200 bg-red-50 text-red-700";
          }

          return (
            <div
              key={option}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${style}`}
            >
              <span className="font-bold">{option}.</span>

              <span className="min-w-0 flex-1 break-words">
                {String(optionText ?? "")}
              </span>

              {isCorrect && (
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-green-600"
                />
              )}

              {isSelected && !isCorrect && type !== "correct" && (
                <XCircle
                  size={16}
                  className="shrink-0 text-red-600"
                />
              )}
            </div>
          );
        })}
      </div>

      {type !== "correct" && (
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-semibold">
          {question.answer ? (
            <span className="text-red-600">
              Your Answer: {question.answer}
            </span>
          ) : (
            <span className="text-amber-600">
              Your Answer: Not Attempted
            </span>
          )}

          <span className="text-green-600">
            Correct Answer: {question.correctAnswer}
          </span>
        </div>
      )}
    </div>
  );
}

// Instruction Item
function Instruction({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-600">
        {number}
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-800">
          {title}
        </h4>
        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h3 className="text-base font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
