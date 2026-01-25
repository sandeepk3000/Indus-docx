import { useState, useEffect } from "react";

import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import useMedia from "../../hooks/useMedia";
import { Query } from "appwrite";

import { useNavigate } from "react-router-dom";
import useQuestion from "../../hooks/useQuestion";
import type { QuestionDoc, ResultDoc } from "../../../types";
import useResult from "../../hooks/useResult";
import { formatDateTime } from "../../utils/dateFormatter";
import { useAuth0 } from "@auth0/auth0-react";
import EmptyState from "../EmptyState";

// const tests = [
//   {
//     id: "1",
//     title: "Maths Live Test",
//     description: "Algebra + Trigonometry",
//     thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
//     createdAt: "2025-01-10",
//     totalQuestions: 50,
//     totalMarks: 100,
//     testCodes: ["LIVE01", "LIVE02"],
//   },
//   {
//     id: "2",
//     title: "Physics Live Test",
//     description: "Motion & Laws",
//     thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
//     createdAt: "2024-12-01",
//     totalQuestions: 40,
//     totalMarks: 80,
//     testCodes: ["LIVE01"],
//   },
// ];

export default function LiveTestManager() {
  // find user id
  const { user } = useAuth0();
  const userId = user?.sub;

  const [activeTab, setActiveTab] = useState("live");
  const [results, setResults] = useState<ResultDoc[] | null>(null);
  const [liveTests, setLiveTests] = useState<TestDoc[] | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const { getTest, getSingleTest } = useTest();
  const navigate = useNavigate();
  const { getResults } = useResult();
  const { getQuestions } = useQuestion();

  const { getFileView } = useMedia();

  const [liveTab, setLiveTab] = useState("latest");
  const [liveCode, setLiveCode] = useState<string | null>(null);
  useEffect(() => {
    if (!userId) {
      alert("Please login to view your Live results");
      return;
    }
    if (activeTab === "live") {
      getResults([
        Query.equal("studentId", userId),
        Query.startsWith("testCode", "LIVE"),
      ]).then((res) => {
        if (liveTab === "latest") {
          res.rows.sort(
            (a, b) =>
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime(),
          );
        } else {
          res.rows.sort(
            (a, b) =>
              new Date(a.$createdAt).getTime() -
              new Date(b.$createdAt).getTime(),
          );
        }
        const testIds = [...new Set(res.rows.map((result) => result.testId))];
        console.log(testIds);
        if (testIds.length > 0) {
          getTest([Query.equal("$id", testIds)]).then((res) => {
            console.log("t", res.rows[0].title);
            setLiveTests(res.rows);
          });
          testIds.map((testId) => {
            const isExistQuestion = questions?.find((question) =>
              question.tests.includes(testId),
            );
            if (!isExistQuestion) {
              getQuestions([testId]).then((res) => {
                setQuestions((prev) => {
                  if (prev) {
                    return [...prev, ...res.rows];
                  }
                  return res.rows;
                });
              });
            }
          });
        }

        setResults(res.rows);
      });
    }
  }, [liveTab]);

  const handleLiveJoin = async () => {
    if (!userId) {
      alert("Please login to join live test");
      return;
    }
    if (!liveCode?.startsWith("LIVE")) {
      alert("Test Code must start with LIVE");
      return;
    }
    const testId: string | undefined = liveCode?.split(":")[1];
    if (!testId) {
      alert("Test is not found");
      return;
    }

    const expiry: string | undefined = liveCode?.split(":")[2];
    if (expiry) {
      const expiryTime = Number(expiry);
      const currentTime = new Date().getTime();
      if (currentTime > expiryTime) {
        alert("Test Code is expired");
        return;
      }
    }
    const test = await getSingleTest(testId);
    const isCodeExist = test?.testCodes?.includes(liveCode);
    if (!isCodeExist) {
      alert("This Live code not exits");
      return;
    }
    const existResults = await getResults([
      Query.equal("testCode", liveCode),
      Query.equal("studentId", userId),
    ]);
    alert(existResults.total);
    if (existResults.total > 0) {
      alert("You have already used this test");
      return;
    }
    navigate(`/student/live/quiz/${testId}?liveCode=${liveCode}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === "live" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Live
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === "join" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Join
          </button>
        </div>

        {/* LIVE TAB */}
        {activeTab === "live" && (
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
                    onClick={() => setLiveTab(t)}
                    className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition ${
                      liveTab === t
                        ? "bg-white shadow text-blue-600"
                        : "text-gray-600"
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
                liveTests &&
                results?.map((result) => {
                  const test = liveTests.find(
                    (test) => test.$id === result.testId,
                  );
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
                          {"A"}
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
                            value={`${Math.round(
                              (result.obtainedMarks / totalMarks) * 100,
                            )}%`}
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
        )}

        {activeTab === "join" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Right Panel */}
            <div className="bg-white rounded-xl border p-4">
              <input
                type="text"
                placeholder={`Live Code (e.g. LIVE03:testId)`}
                onChange={(e) => setLiveCode(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-2"
              />
              <button
                onClick={handleLiveJoin}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Join Live
              </button>
              // show error test code not proper structure start with LIVE
            </div>
          </div>
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
