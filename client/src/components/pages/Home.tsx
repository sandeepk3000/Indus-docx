
import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  Check,
  Copy,
  FileQuestion,
  Hash,
  Loader2,
  Plus,
  Radio,
  Search,
  ShieldAlert,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { Query } from "appwrite";

import useTest from "../../hooks/useTest";
import useQuestion from "../../hooks/useQuestion";
import useMedia from "../../hooks/useMedia";

import type { TestDoc, QuestionDoc } from "../../../types";
import { codeGenerater } from "../../utils/codeGenerater";
import { formatDateTime } from "../../utils/dateFormatter";

type MainTab = "live" | "create";
type SortTab = "latest" | "oldest";

export default function LiveTestManager() {
  const [activeTab, setActiveTab] = useState<MainTab>("live");
  const [liveTab, setLiveTab] = useState<SortTab>("latest");

  const [tests, setTests] = useState<TestDoc[]>([]);
  const [liveTests, setLiveTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);

  const [selectedTest, setSelectedTest] = useState<TestDoc | null>(null);
  const [newCode, setNewCode] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { getTest, pushTestCode } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  // Fetch tests and questions
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await getTest();

        if (!mounted) return;

        const allTests = res.rows;

        if (activeTab === "live") {
          const filteredTests = allTests.filter((test) =>
            test.testCodes?.some((code) => code.startsWith("LIVE")),
          );

          setLiveTests(filteredTests);

          const testIds = filteredTests.map((test) => test.$id);

          if (testIds.length > 0) {
            const questionRes = await getQuestions([
              Query.equal("tests", testIds),
            ]);

            if (mounted) {
              setQuestions(questionRes.rows);
            }
          } else {
            setQuestions([]);
          }
        } else {
          setTests(allTests);
        }
      } catch (err) {
        console.error("Failed to fetch tests:", err);

        if (mounted) {
          setError("Unable to load tests. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [activeTab]);

  // Search and sorting
  const filteredLiveTests = useMemo(() => {
    return [...liveTests]
      .filter((test) => {
        const value = search.toLowerCase();

        return (
          test.title?.toLowerCase().includes(value) ||
          test.description?.toLowerCase().includes(value)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.$createdAt).getTime();
        const dateB = new Date(b.$createdAt).getTime();

        return liveTab === "latest" ? dateB - dateA : dateA - dateB;
      });
  }, [liveTests, liveTab, search]);

  // Question statistics
  const getTestStats = (testId: string) => {
    const testQuestions = questions.filter((question) =>
      question.tests.includes(testId),
    );

    const totalMarks = testQuestions.reduce(
      (total, question) => total + Number(question.marks || 0),
      0,
    );

    return {
      totalQuestions: testQuestions.length,
      totalMarks,
    };
  };

  const liveCodeCount = liveTests.length;

  const totalQuestions = questions.length;

  const totalMarks = questions.reduce(
    (total, question) => total + Number(question.marks || 0),
    0,
  );

  // Generate LIVE code
  const generateLiveCode = async () => {
    if (!selectedTest || generating) return;

    setError("");
    setSuccess("");

    try {
      setGenerating(true);

      const code = codeGenerater(selectedTest.$id, "LIVE");

      // Validate generated code
      if (!code || typeof code !== "string" || !code.startsWith("LIVE")) {
        setError(
          "Invalid test code! Generated code must start with LIVE.",
        );
        return;
      }

      // Avoid duplicate codes
      if (selectedTest.testCodes?.includes(code)) {
        setError("This test code already exists. Generate another code.");
        return;
      }

      setNewCode(code);

      await pushTestCode(selectedTest.$id, code);

      // Update selected test immediately
      const updatedCodes = [...(selectedTest.testCodes || []), code];

      const updatedTest = {
        ...selectedTest,
        testCodes: updatedCodes,
      };

      setSelectedTest(updatedTest);

      setTests((previous) =>
        previous.map((test) =>
          test.$id === selectedTest.$id ? updatedTest : test,
        ),
      );

      setSuccess("Live test code generated successfully!");
    } catch (err) {
      console.error("Code generation failed:", err);
      setError("Unable to generate code. Please try again.");
      setNewCode("");
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = async () => {
    if (!newCode) return;

    try {
      await navigator.clipboard.writeText(newCode);
      setSuccess("Test code copied successfully!");
    } catch {
      setError("Unable to copy code. Please copy it manually.");
    }
  };

  const selectTab = (tab: MainTab) => {
    setActiveTab(tab);
    setSearch("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-3 py-5 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#FF0A2B]">
              <Radio size={16} />
              <span>ADMINISTRATION</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Live Test Manager
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage live tests and generate unique access codes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-red-100 bg-white px-4 py-2.5 shadow-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#FF0A2B]" />
            </span>
            <span className="text-xs font-bold text-slate-700">
              LIVE MANAGEMENT
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            title="Live Tests"
            value={liveCodeCount}
            icon={<Radio size={20} />}
            color="red"
          />

          <StatCard
            title="Total Questions"
            value={totalQuestions}
            icon={<FileQuestion size={20} />}
            color="blue"
          />

          <StatCard
            title="Total Marks"
            value={totalMarks}
            icon={<Trophy size={20} />}
            color="amber"
          />
        </div>

        {/* Main Navigation */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <button
            onClick={() => selectTab("live")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none ${
              activeTab === "live"
                ? "bg-[#FF0A2B] text-white shadow-md shadow-red-500/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Radio size={17} />
            Live Tests
          </button>

          <button
            onClick={() => selectTab("create")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all sm:flex-none ${
              activeTab === "create"
                ? "bg-[#FF0A2B] text-white shadow-md shadow-red-500/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Plus size={17} />
            Generate Code
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <ShieldAlert size={19} className="mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              onClick={() => setError("")}
              className="shrink-0 rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <Check size={19} className="shrink-0" />
            <p className="flex-1">{success}</p>
            <button
              onClick={() => setSuccess("")}
              className="shrink-0 rounded-lg p-1 hover:bg-green-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* LIVE TESTS */}
        {activeTab === "live" && (
          <div className="space-y-5">

            {/* Section Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Available Live Tests
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Tests having a LIVE access code.
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
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tests..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#FF0A2B] focus:ring-2 focus:ring-red-100 sm:w-56"
                  />
                </div>

                {/* Sorting */}
                <div className="flex rounded-xl border border-slate-200 bg-white p-1">
                  <button
                    onClick={() => setLiveTab("latest")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      liveTab === "latest"
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Latest
                  </button>

                  <button
                    onClick={() => setLiveTab("oldest")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
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
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="h-44 animate-pulse bg-slate-200" />
                    <div className="space-y-3 p-4">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredLiveTests.length === 0 ? (
              <EmptyState
                icon={<Radio size={30} />}
                title="No live tests found"
                description={
                  search
                    ? "Try searching with a different test name."
                    : "There are no tests with LIVE codes yet. Generate a code to get started."
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLiveTests.map((test) => {
                  const stats = getTestStats(test.$id);

                  return (
                    <div
                      key={test.$id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-200/60"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-44 overflow-hidden bg-slate-100">
                        {test.thumbnail ? (
                          <img
                            src={getFileView(test.thumbnail)}
                            alt={test.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 text-red-300">
                            <BookOpenCheck size={48} />
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-red-600 shadow-sm backdrop-blur">
                          <span className="size-1.5 rounded-full bg-red-500" />
                          LIVE ENABLED
                        </div>

                        <div className="absolute right-3 bottom-3 rounded-lg bg-black/60 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
                          {test.testCodes?.length || 0} Access Codes
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4 p-4">
                        <div>
                          <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                            {test.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-slate-500">
                            {test.description || "No description available."}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <CalendarDays size={14} />
                          Created: {formatDateTime(test.$createdAt)}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-blue-50 p-3">
                            <div className="flex items-center gap-1.5 text-blue-600">
                              <FileQuestion size={14} />
                              <span className="text-[10px] font-semibold">
                                Questions
                              </span>
                            </div>
                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {stats.totalQuestions}
                            </p>
                          </div>

                          <div className="rounded-xl bg-amber-50 p-3">
                            <div className="flex items-center gap-1.5 text-amber-600">
                              <Trophy size={14} />
                              <span className="text-[10px] font-semibold">
                                Total Marks
                              </span>
                            </div>
                            <p className="mt-1 text-lg font-bold text-slate-900">
                              {stats.totalMarks}
                            </p>
                          </div>
                        </div>

                        {/* Codes */}
                        <div className="border-t border-slate-100 pt-3">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Available Codes
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {test.testCodes
                              ?.filter((code) => code.startsWith("LIVE"))
                              .map((code) => (
                                <span
                                  key={code}
                                  className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600"
                                >
                                  {code}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CREATE / GENERATE CODE */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">

            {/* Test List */}
            <div className="space-y-4 lg:col-span-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Select a Test
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Choose a test to generate its LIVE access code.
                </p>
              </div>

              {/* Test Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search all tests..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#FF0A2B] focus:ring-2 focus:ring-red-100"
                />
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-24 animate-pulse rounded-2xl bg-slate-200"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tests
                    .filter((test) => {
                      const value = search.toLowerCase();

                      return (
                        test.title?.toLowerCase().includes(value) ||
                        test.description?.toLowerCase().includes(value)
                      );
                    })
                    .map((test) => {
                      const isSelected = selectedTest?.$id === test.$id;
                      const liveCodes =
                        test.testCodes?.filter((code) =>
                          code.startsWith("LIVE"),
                        ) || [];

                      return (
                        <button
                          key={test.$id}
                          type="button"
                          onClick={() => {
                            setSelectedTest(test);
                            setNewCode("");
                            setError("");
                            setSuccess("");
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-[#FF0A2B] bg-red-50/60 shadow-md shadow-red-100"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                                isSelected
                                  ? "bg-[#FF0A2B] text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <BookOpenCheck size={21} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="truncate text-sm font-bold text-slate-900">
                                  {test.title}
                                </h3>

                                {isSelected && (
                                  <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-600">
                                    <Check size={12} />
                                    Selected
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                {test.description || "No description"}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <Hash size={12} />
                                  {test.$id}
                                </span>

                                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500">
                                  <Radio size={12} />
                                  {liveCodes.length} LIVE codes
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                  {tests.filter((test) => {
                    const value = search.toLowerCase();

                    return (
                      test.title?.toLowerCase().includes(value) ||
                      test.description?.toLowerCase().includes(value)
                    );
                  }).length === 0 && (
                    <EmptyState
                      icon={<Search size={28} />}
                      title="No tests found"
                      description="Try another search keyword."
                    />
                  )}
                </div>
              )}
            </div>

            {/* Code Generator Panel */}
            <div className="lg:sticky lg:top-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-slate-900 p-5 text-white">
                  <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/10">
                    <Sparkles size={22} />
                  </div>

                  <h3 className="text-lg font-bold">
                    Live Code Generator
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Generate a unique code for your selected test.
                  </p>
                </div>

                <div className="space-y-5 p-5">
                  {!selectedTest ? (
                    <div className="py-6 text-center">
                      <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <BookOpenCheck size={26} />
                      </div>

                      <h4 className="text-sm font-bold text-slate-800">
                        No Test Selected
                      </h4>

                      <p className="mx-auto mt-1 max-w-52 text-xs leading-5 text-slate-500">
                        Select a test from the list to manage its access codes.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Selected Test */}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Selected Test
                        </p>

                        <h4 className="mt-1 text-sm font-bold text-slate-900">
                          {selectedTest.title}
                        </h4>

                        <p className="mt-1 break-all text-[10px] text-slate-400">
                          ID: {selectedTest.$id}
                        </p>
                      </div>

                      {/* Existing Codes */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-700">
                            Existing LIVE Codes
                          </p>

                          <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
                            {
                              selectedTest.testCodes?.filter((code) =>
                                code.startsWith("LIVE"),
                              ).length || 0
                            }{" "}
                            Codes
                          </span>
                        </div>

                        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                          {selectedTest.testCodes?.filter((code) =>
                            code.startsWith("LIVE"),
                          ).length ? (
                            selectedTest.testCodes
                              ?.filter((code) => code.startsWith("LIVE"))
                              .map((code) => (
                                <span
                                  key={code}
                                  className="rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-[10px] font-bold text-red-600"
                                >
                                  {code}
                                </span>
                              ))
                          ) : (
                            <p className="text-xs text-slate-400">
                              No LIVE codes generated yet.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Generated Code */}
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700">
                          Generated Code
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={newCode}
                            placeholder="LIVE code will appear here"
                            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
                          />

                          <button
                            type="button"
                            onClick={copyCode}
                            disabled={!newCode}
                            title="Copy code"
                            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Copy size={17} />
                          </button>
                        </div>
                      </div>

                      {/* Generate Button */}
                      <button
                        type="button"
                        onClick={generateLiveCode}
                        disabled={generating}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FF0A2B] px-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-[#e50928] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {generating ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            Generate LIVE Code
                          </>
                        )}
                      </button>

                      {/* Information */}
                      <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <ShieldAlert
                          size={16}
                          className="mt-0.5 shrink-0 text-blue-600"
                        />

                        <p className="text-[10px] leading-5 text-blue-700">
                          Generated access codes must start with{" "}
                          <strong>LIVE</strong>. Share the code with students
                          to let them access the live test.
                        </p>
                      </div>
                    </>
                  )}
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
  icon: React.ReactNode;
  color: "red" | "blue" | "amber";
}) {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`flex size-11 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
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
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h3 className="text-base font-bold text-slate-800">{title}</h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
