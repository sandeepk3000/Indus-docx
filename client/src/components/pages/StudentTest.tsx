import { useState } from "react";
import useResult from "../../hooks/useResult";

import useTest from "../../hooks/useTest";

import useMedia from "../../hooks/useMedia";
import { Query } from "appwrite";
import { useEffect } from "react";
import useQuestion from "../../hooks/useQuestion";
import type { QuestionDoc, ResultDoc, TestDoc } from "../../../types";
import { formatDateTime } from "../../utils/dateFormatter";
import gradeGenerater from "../../utils/gradeGenerater";
import percentageGenerater from "../../utils/percentageGenerater";
import { useAuth0 } from "@auth0/auth0-react";
import EmptyState from "../EmptyState";
import type { CheckedAnswer } from "../Quiz";
export default function StudentTest() {
  const [tests, setTests] = useState<TestDoc[] | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [results, setResults] = useState<ResultDoc[] | null>(null);
  const { getTest } = useTest();
  const { getFileView } = useMedia();
  const { getQuestions } = useQuestion();
  const { getResults } = useResult();
  const { user } = useAuth0();
  const userId = user?.sub;
  const [tab, setTab] = useState("latest");
  const [showAnalysis, setShowAnalysis] = useState<string>("");

  const [activeTab, setActiveTab] = useState("correct");

  // const sortedTests = [...testResults].sort((a, b) =>
  //   tab === "latest"
  //     ? new Date(b.date) - new Date(a.date)
  //     : new Date(a.date) - new Date(b.date)
  // );

  useEffect(() => {
    if (!userId) {
      alert("Please login to view your results");
      return;
    }
    getResults([Query.equal("studentId", userId)]).then((res) => {
      if (tab === "latest") {
        res.rows.sort(
          (a, b) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
        );
      } else {
        res.rows.sort(
          (a, b) =>
            new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime(),
        );
      }
      const testIds = [...new Set(res.rows.map((result) => result.testId))];
      getTest([Query.equal("$id", testIds)]).then((res) => {
        setTests(res.rows);
      });
      testIds.map((id) => {
        const isQuestionExist = questions?.find((question) =>
          question.tests.includes(id),
        );
        if (!isQuestionExist) {
          getQuestions([Query.equal("tests", id)]).then((res) => {
            setQuestions((prev) => {
              if (!prev) {
                return res.rows;
              } else {
                return [...prev, ...res.rows];
              }
            });
          });
        }
      });
      setResults(res.rows);
    });
  }, [tab]);
  const getCorrectQuestions = (result: ResultDoc) => {
    const checkedAnswers = JSON.parse(result.checkedAnswers[0]);
    return checkedAnswers.filter((answer: any) => answer.isCorrect);
  };
  const getWrongQuestions = (result: ResultDoc) => {
    const checkedAnswers = JSON.parse(result.checkedAnswers[0]);
    return checkedAnswers.filter(
      (answer: any) => !answer.isCorrect && answer.answer !== "",
    );
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Test Results
        </h1>

        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
          {["latest", "oldest"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition ${
                tab === t ? "bg-white shadow text-blue-600" : "text-gray-600"
              }`}
            >
              {t === "latest" ? "Latest" : "Oldest"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden lg:grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 px-4 mb-3">
        <div className="col-span-4">Test</div>
        <div className="col-span-2 text-center">Marks</div>
        <div className="col-span-2 text-center">Wrong</div>
        <div className="col-span-2 text-center">Skipped</div>
        <div className="col-span-1 text-center">Grade</div>
        <div className="col-span-1 text-center">Questions</div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {questions &&
          tests &&
          results?.map((result) => {
            const test = tests.find((test) => test.$id === result.testId);
            const totalQuestions = questions.filter((question) =>
              question.tests.includes(result.testId),
            );
            const totalMarks = totalQuestions.reduce(
              (acc, question) => acc + Number(question.marks),
              0,
            );
            if (!test || !totalQuestions) {
              return null;
            }
            return (
              <div className="bg-white border rounded-xl shadow-sm p-4">
                {/* -------- TOP -------- */}
                <div className="flex gap-4">
                  <img
                    src={getFileView(test?.thumbnail)}
                    alt={test.title}
                    className="w-20 h-16 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {test.title}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(result.$createdAt)}
                    </p>
                  </div>

                  <span className="h-fit px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {gradeGenerater(
                      percentageGenerater(result.obtainedMarks, totalMarks),
                    )}
                  </span>
                </div>

                {/* -------- STATS -------- */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <Stat
                    color="text-green-600"
                    label="Marks"
                    value={`${result.obtainedMarks}/${totalMarks}`}
                  />
                  <Stat
                    color="text-red-500"
                    label="Wrong"
                    value={result.totalWrong}
                  />
                  <Stat
                    color="text-yellow-500"
                    label="Skipped"
                    value={result.totalSkipped}
                  />
                  <Stat
                    color="text-gray-700"
                    label="Questions"
                    value={totalQuestions.length}
                  />
                </div>

                {/* -------- FOOTER BUTTON -------- */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() =>
                      setShowAnalysis((prev) =>
                        prev === result.$id ? "" : result.$id,
                      )
                    }
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {showAnalysis ? "Hide Analysis" : "View Analysis"}
                  </button>
                </div>

                {/* -------- ANALYSIS SECTION -------- */}
                {showAnalysis === result.$id && (
                  <div className="mt-4 border-t pt-4">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setActiveTab("correct")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          activeTab === "correct"
                            ? "bg-green-600 text-white"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        Correct ({getCorrectQuestions(result).length})
                      </button>

                      <button
                        onClick={() => setActiveTab("wrong")}
                        className={`px-3 py-1 text-sm rounded-md ${
                          activeTab === "wrong"
                            ? "bg-red-600 text-white"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Wrong ({getWrongQuestions(result).length})
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-2">
                      {activeTab === "correct" &&
                        getCorrectQuestions(result)?.map(
                          (q: CheckedAnswer, i: number) => (
                            <div className="border rounded-lg p-3 text-sm">
                              <p className="font-medium mb-2">
                                {i + 1} . {q.title}
                              </p>

                              <div className="space-y-1">
                                {["A", "B", "C", "D"].map((opt) => {
                                  return (
                                    <div className={`border rounded px-2 py-1`}>
                                      {opt}.{" "}
                                      {q[`option${opt}` as keyof typeof q]}
                                      {opt === q.correctAnswer && (
                                        <span className="text-green-600 ml-2 text-lg font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}

                      {activeTab === "wrong" &&
                        getWrongQuestions(result).map(
                          (q: CheckedAnswer, i: number) => (
                            <div className="border rounded-lg p-3 text-sm">
                              <p className="font-medium mb-2">
                                {i + 1}. {q.title}
                              </p>

                              <div className="space-y-1">
                                {["A", "B", "C", "D"].map((opt) => {
                                  return (
                                    <div className={`border rounded px-2 py-1`}>
                                      {opt}.{" "}
                                      {q[`option${opt}` as keyof typeof q]}
                                      {opt === q.answer && (
                                        <span className="text-red-600 ml-2 text-lg font-bold">
                                          ✗
                                        </span>
                                      )}
                                      {opt === q.correctAnswer && (
                                        <span className="text-green-600  ml-2 text-lg font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {results?.length === 0 && (
          <EmptyState
            title="No results found"
            description="You have not taken any tests yet"
          />
        )}
      </div>
    </div>
  );
}
function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg py-2">
      <p className={`font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
