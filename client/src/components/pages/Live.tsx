import { useState, useEffect } from "react";

import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import useMedia from "../../hooks/useMedia";

import useQuestion from "../../hooks/useQuestion";
import { codeGenerater } from "../../utils/codeGenerater";
import type { QuestionDoc } from "../../../types";
import { formatDateTime } from "../../utils/dateFormatter";
import { Query } from "appwrite";

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
  const [activeTab, setActiveTab] = useState("live");
  const [tests, setTests] = useState<TestDoc[]>([]);

  const [liveTests, setLiveTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const { getTest, pushTestCode } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  const [liveTab, setLiveTab] = useState("latest");
  const [selectedTest, setSelectedTest] = useState<TestDoc | null>(null);

  const [newCode, setNewCode] = useState("");
  useEffect(() => {
    getTest().then((res) => {
      if (activeTab === "live") {
        setLiveTests(
          res.rows.filter((test) =>
            test.testCodes?.some((code) => code.startsWith(`LIVE`)),
          ),
        );
        getQuestions([
          Query.equal(
            "tests",
            res.rows.map((test) => test.$id),
          ),
        ]).then((res) => {
          setQuestions(res.rows);
        });
      } else {
        setTests(res.rows);
      }
    });
  }, [activeTab]);

  const generateLiveCode = async () => {
    if (!selectedTest) return;
    const code = codeGenerater(selectedTest.$id, "LIVE");
    setNewCode(code);
    await pushTestCode(selectedTest.$id, code);
    setNewCode("");
    alert("New TestCode Added");
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
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              activeTab === "create" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Create
          </button>
        </div>

        {/* LIVE TAB */}
        {activeTab === "live" && (
          <>
            {/* Sub Tabs */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setLiveTab("latest")}
                className={`px-4 py-2 rounded ${
                  liveTab === "latest"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                Latest Tests
              </button>
              <button
                onClick={() => setLiveTab("oldest")}
                className={`px-4 py-2 rounded ${
                  liveTab === "oldest"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                Oldest Tests
              </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveTests
                .sort(
                  (a, b) =>
                    new Date(b.$createdAt).getTime() -
                    new Date(a.$createdAt).getTime(),
                )
                .map((test) => (
                  <div
                    key={test.$id}
                    className="bg-white rounded-xl shadow-sm border"
                  >
                    <img
                      src={getFileView(test.thumbnail)}
                      className="h-40 w-full object-cover rounded-t-xl"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-bold">{test.title}</h3>
                      <p className="text-sm text-gray-600">
                        {test.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {formatDateTime(test.$createdAt)}
                      </p>

                      <div className="flex justify-between text-sm text-gray-700">
                        <span>
                          {" "}
                          📝 Questions:{" "}
                          {
                            questions.filter((question) =>
                              question.tests.includes(test.$id),
                            ).length
                          }
                        </span>
                        <span>
                          🎯 Marks:
                          {questions
                            .filter((q) => q.tests.includes(test.$id))
                            .reduce((acc: number, question) => {
                              return acc + Number(question.marks);
                            }, 0)}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* CREATE TAB */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test List */}
            <div className="lg:col-span-2 space-y-4">
              {tests.map((test) => (
                <div
                  key={test.$id}
                  onClick={() => setSelectedTest(test)}
                  className="bg-white p-4 rounded-xl border cursor-pointer hover:shadow"
                >
                  <p className="text-xs text-gray-500">ID: {test.$id}</p>
                  <h3 className="font-semibold">{test.title}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
              ))}
            </div>

            {/* Right Panel */}
            <div className="bg-white rounded-xl border p-4">
              {!selectedTest ? (
                <p className="text-gray-500 text-sm">
                  Select a test to manage test codes
                </p>
              ) : (
                <>
                  <h3 className="font-bold mb-3">{selectedTest.title}</h3>
                  {/* Existing Codes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedTest?.testCodes?.map((code) => (
                      <span
                        key={code}
                        className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                  {/* Add New Code */}
                  <input
                    type="text"
                    readOnly
                    placeholder={`New Live Code (e.g. LIVE03:${selectedTest.$id})`}
                    value={newCode}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <button
                    onClick={generateLiveCode}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Gernerate Live Code
                  </button>
                  // show error test code not proper structure start with LIVE
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
