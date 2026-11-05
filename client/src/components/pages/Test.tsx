
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import {
  Plus,
  ClipboardList,
  FileQuestion,
  Target,
  Clock3,
  Pencil,
  Trash2,
  BookOpen,
  Sparkles,
  Search,
  LayoutGrid,
} from "lucide-react";

import useTest from "../../hooks/useTest";
import useMedia from "../../hooks/useMedia";
import useQuestion from "../../hooks/useQuestion";

import type { TestDoc, QuestionDoc } from "../../../types";
import TestForm from "../TestForm";

const Test = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [isTestCreated, setIsTestCreated] = useState(false);
  const [search, setSearch] = useState("");

  const { getTest } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  const navigate = useNavigate();

  const onTestSubmit = async (created: boolean) => {
    if (created) {
      alert("Test created successfully!");
      setIsTestCreated((prev) => !prev);
      setActiveTab("all");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTest();
        setTests(res.rows);

        if (res.rows.length) {
          const questionRes = await getQuestions([
            Query.contains(
              "tests",
              res.rows.map((test) => test.$id)
            ),
          ]);

          setQuestions(questionRes.rows);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchData();
  }, [isTestCreated]);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  );

  const getTestStats = (testId: string) => {
    const testQuestions = questions.filter((q) =>
      q.tests.includes(testId)
    );

    const totalMarks = testQuestions.reduce(
      (acc, question) => acc + Number(question.marks),
      0
    );

    return {
      totalQuestions: testQuestions.length,
      totalMarks,
    };
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "UPCOMING":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      default:
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles size={16} />
              Test Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Manage Your Tests
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Create, organize and manage all your examinations.
            </p>
          </div>

          <button
            onClick={() => setActiveTab("create")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Plus size={19} />
            Create New Test
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total Tests",
              value: tests.length,
              icon: ClipboardList,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Published",
              value: tests.filter((t) => t.status === "PUBLISHED").length,
              icon: BookOpen,
              color: "bg-emerald-50 text-emerald-600",
            },
            {
              label: "Upcoming",
              value: tests.filter((t) => t.status === "UPCOMING").length,
              icon: Clock3,
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "Total Questions",
              value: questions.length,
              icon: FileQuestion,
              color: "bg-purple-50 text-purple-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {stat.label}
                </p>
                <div className={`rounded-xl p-2 ${stat.color}`}>
                  <stat.icon size={19} />
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:flex-none sm:px-6 ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutGrid size={17} />
              All Tests
              <span
                className={`rounded-lg px-2 py-0.5 text-xs ${
                  activeTab === "all"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("create")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:flex-none sm:px-6 ${
                activeTab === "create"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Plus size={17} />
              Create Test
            </button>
          </div>
        </div>

        {/* ALL TESTS */}
        {activeTab === "all" && (
          <div className="space-y-6">

            {/* SEARCH */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  All Examinations
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Explore and manage your tests.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* TEST CARDS */}
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredTests.map((test) => {
                  const stats = getTestStats(test.$id);

                  return (
                    <div
                      key={test.$id}
                      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl hover:shadow-gray-200/60"
                    >
                      {/* THUMBNAIL */}
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        {test.thumbnail ? (
                          <img
                            src={getFileView(test.thumbnail)}
                            alt={test.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                            <ClipboardList
                              size={55}
                              className="text-blue-300"
                            />
                          </div>
                        )}

                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ring-1 ${getStatusStyle(
                              test.status
                            )}`}
                          >
                            {test.status}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                          <Clock3 size={13} className="mr-1 inline" />
                          {test.duration}
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-5">
                        <h3 className="truncate text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
                          {test.title}
                        </h3>

                        <p className="mt-2 min-h-10 text-sm leading-5 text-gray-500 line-clamp-2">
                          {test.description || "No description available."}
                        </p>

                        {/* TEST INFORMATION */}
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
                              Total Marks
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
                              Duration
                            </p>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() =>
                              navigate(`/admin/tests/${test.$id}/edit`)
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              alert("Connect your delete API here.")
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
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
                  {search ? "No tests found" : "No tests created yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  {search
                    ? "Try searching with a different test name."
                    : "Start by creating your first examination and manage it from here."}
                </p>

                {!search && (
                  <button
                    onClick={() => setActiveTab("create")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Plus size={17} />
                    Create Your First Test
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* CREATE TEST */}
        {activeTab === "create" && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Plus size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Create New Test
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Add examination details and configure your test.
                  </p>
                </div>
              </div>
            </div>

            <TestForm onTestSubmit={onTestSubmit} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Test;
