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

      const testQueries = testIds.map((testId) => Query.equal("$id", testId));
      getTest(testQueries).then((res) => {
        setTests(res.rows);
      });

      getQuestions(testIds).then((res) => {
        console.log(res.rows);
        setQuestions(res.rows);
      });
      setResults(res.rows);
    });
  }, [tab]);
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
              <div
                key={result.$id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4"
              >
                {/* Top Section */}
                <div className="flex gap-4">
                  <img
                    src={getFileView(test?.thumbnail)}
                    alt={test.title}
                    className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {test.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateTime(result.$createdAt)}
                    </p>
                  </div>

                  {/* Grade (always visible) */}
                  <span className="h-fit px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {gradeGenerater(
                      percentageGenerater(result.obtainedMarks, totalMarks),
                    )}
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                  <Stat
                    label="Marks"
                    value={`${result.obtainedMarks}/${totalMarks}`}
                    color="text-green-600"
                  />
                  <Stat
                    label="Wrong"
                    value={result.totalWrong}
                    color="text-red-500"
                  />
                  <Stat
                    label="Skipped"
                    value={result.totalSkipped}
                    color="text-yellow-500"
                  />
                  <Stat
                    label="Questions"
                    value={totalQuestions.length}
                    color="text-gray-700"
                  />

                  {/* Desktop only extras */}
                  <div className="hidden lg:block">
                    <Stat
                      label="Score %"
                      value={`${percentageGenerater(result.obtainedMarks, totalMarks)}%`}
                      color="text-blue-600"
                    />
                  </div>
                </div>
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
