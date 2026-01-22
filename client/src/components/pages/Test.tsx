import { useState, useEffect } from "react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import useMedia from "../../hooks/useMedia";
import useQuestion from "../../hooks/useQuestion";
import type { QuestionDoc } from "../../../types";
import TestForm from "../TestForm";

const Test = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tests, setTests] = useState<TestDoc[]>([]);
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const { getTest } = useTest();
  const [isTestCreated, setIsTestCreated] = useState<boolean>(false);
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  const onTestSubmit = async (isTestCreated: boolean) => {
    if (isTestCreated) {
      alert("test created");
      setIsTestCreated(true);
    }
  };
  useEffect(() => {
    getTest().then((res) => {
      setTests(res.rows);
      getQuestions(res.rows.map((test) => test.$id)).then((res) => {
        setQuestions(res.rows);
      });
    });
  }, [isTestCreated]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          All Tests
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-2 rounded-lg font-semibold ${
            activeTab === "create" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Create Test
        </button>
      </div>

      {/* ALL TESTS */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.$id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={getFileView(test.thumbnail)}
                alt={test.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold">{test.title}</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      test.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : test.status === "UPCOMING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {test.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{test.description}</p>

                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    📝 Questions:{" "}
                    {
                      questions.filter((question) =>
                        question.tests.includes(test.$id),
                      ).length
                    }
                  </p>
                  <p>
                    🎯 Marks:{" "}
                    {questions
                      .filter((q) => q.tests.includes(test.$id))
                      .reduce((acc: number, question) => {
                        return acc + Number(question.marks);
                      }, 0)}
                  </p>
                  <p>⏱ Duration: {test.duration}</p>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TEST */}
      {activeTab === "create" && <TestForm onTestSubmit={onTestSubmit} />}
    </div>
  );
};
export default Test;
