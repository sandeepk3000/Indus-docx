
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Query } from "appwrite";

import {
  Clock3,
  FileQuestion,
  Target,
  Search,
  BookOpen,
  Sparkles,
  LayoutGrid,
  CalendarDays,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import useQuestion from "../../hooks/useQuestion";

import type { TestDoc, QuestionDoc } from "../../../types";
import { formatDateTime } from "../../utils/dateFormatter";

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { getTest } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  // Fetch quizzes
  useEffect(() => {
    let isMounted = true;

    const fetchQuizzes = async () => {
      try {
        setLoading(true);

        const res = await getTest([
          Query.equal("access", ["PUBLIC"]),
          Query.equal("status", ["PUBLISHED"]),
        ]);

        if (!isMounted) return;

        setTests(res.rows);

        if (res.rows.length > 0) {
          const questionRes = await getQuestions([
            Query.contains(
              "tests",
              res.rows.map((test) => test.$id)
            ),
          ]);

          if (isMounted) {
            setQuestions(questionRes.rows);
          }
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchQuizzes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get quiz statistics
  const getQuizStats = (testId: string) => {
    const quizQuestions = questions.filter((question) =>
      question.tests.includes(testId)
    );

    return {
      totalQuestions: quizQuestions.length,
      totalMarks: quizQuestions.reduce(
        (total, question) => total + Number(question.marks),
        0
      ),
    };
  };

  // Search and sort
  const filteredTests = useMemo(() => {
    const result = tests.filter((test) =>
      test.title.toLowerCase().includes(search.toLowerCase())
    );

    return result.sort((a, b) => {
      const dateA = new Date(a.$createdAt).getTime();
      const dateB = new Date(b.$createdAt).getTime();

      return activeTab === "latest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [tests, search, activeTab]);

  const totalQuestions = questions.length;

  const totalMarks = questions.reduce(
    (total, question) => total + Number(question.marks),
    0
  );

  return (
    <div className="min-h-screen  px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles size={16} />
              Student Learning
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Explore Quizzes
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Discover tests, challenge yourself and improve your knowledge.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <BookOpen size={18} />
            Available Quizzes
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Quizzes
              </p>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <ClipboardList size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {tests.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Questions
              </p>
              <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
                <FileQuestion size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {totalQuestions}
            </h2>
          </div>

          <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5 lg:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                Total Marks
              </p>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                <Target size={19} />
              </div>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              {totalMarks}
            </h2>
          </div>

        </div>

        {/* QUIZ SECTION */}
        <div className="space-y-6">

          {/* FILTER HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Available Tests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose a quiz and test your knowledge.
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
                placeholder="Search quizzes..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* SORT TABS */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <div className="flex gap-2">

              <button
                onClick={() => setActiveTab("latest")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "latest"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Sparkles size={16} />
                Latest
              </button>

              <button
                onClick={() => setActiveTab("oldest")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "oldest"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <CalendarDays size={16} />
                Oldest
              </button>

            </div>

            <div className="hidden items-center gap-2 px-3 text-xs font-medium text-gray-400 sm:flex">
              <LayoutGrid size={16} />
              {filteredTests.length} Results
            </div>
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="h-44 animate-pulse bg-gray-200" />
                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                    <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTests.length > 0 ? (

            /* QUIZ CARDS */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

              {filteredTests.map((test) => {
                const stats = getQuizStats(test.$id);

                return (
                  <Link
                    key={test.$id}
                    to={`/student/quiz/${test.$id}`}
                    className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-gray-200/60"
                  >

                    {/* THUMBNAIL */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">

                      {test.thumbnail ? (
                        <img
                          src={getFileView(test.thumbnail)}
                          alt={test.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                          <BookOpen
                            size={55}
                            className="text-blue-300"
                          />
                        </div>
                      )}

                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-emerald-50/95 px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm backdrop-blur">
                          PUBLIC TEST
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                        <Clock3 size={14} />
                        {test.duration} mins
                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
                          {test.title}
                        </h3>

                        <ArrowUpRight
                          size={19}
                          className="shrink-0 text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                        />
                      </div>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                        {test.description || "Improve your knowledge by attempting this quiz."}
                      </p>

                      {/* CREATED DATE */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        Created: {formatDateTime(test.$createdAt)}
                      </div>

                      {/* QUIZ DETAILS */}
                      <div className="mt-5 grid grid-cols-3 gap-2 border-y border-gray-100 py-4">

                        <div className="text-center">
                          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileQuestion size={17} />
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {stats.totalQuestions}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Questions
                          </p>
                        </div>

                        <div className="border-x border-gray-100 text-center">
                          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Target size={17} />
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {stats.totalMarks}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Marks
                          </p>
                        </div>

                        <div className="text-center">
                          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Clock3 size={17} />
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {test.duration}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Minutes
                          </p>
                        </div>

                      </div>

                      {/* START BUTTON */}
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 transition group-hover:bg-blue-600">
                        <span className="text-sm font-bold text-blue-700 transition group-hover:text-white">
                          Start Quiz
                        </span>

                        <ArrowUpRight
                          size={18}
                          className="text-blue-600 transition group-hover:text-white"
                        />
                      </div>

                    </div>
                  </Link>
                );
              })}

            </div>

          ) : (

            /* EMPTY STATE */
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ClipboardList size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                {search ? "No quizzes found" : "No quizzes available"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {search
                  ? "Try searching with a different quiz name."
                  : "There are currently no published public quizzes. Please check back later."}
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Search
                </button>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Quizzes;
