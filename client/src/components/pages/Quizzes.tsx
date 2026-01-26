import { useState, useEffect } from "react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import useMedia from "../../hooks/useMedia";

import { Link } from "react-router-dom";
import useQuestion from "../../hooks/useQuestion";
import type { QuestionDoc } from "../../../types";
import { formatDateTime } from "../../utils/dateFormatter";
import { Query } from "appwrite";

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [tests, setTests] = useState<TestDoc[]>([]);

  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const { getTest } = useTest();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();

  useEffect(() => {
    getTest([Query.equal("status", ["PUBLISHED"])]).then((res) => {
      if (activeTab === "latest") {
        res.rows.sort(
          (a, b) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
        );
        setTests(res.rows);
      } else {
        res.rows.sort(
          (a, b) =>
            new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime(),
        );
        setTests(res.rows);
      }
      res.rows.map((test) => {
        const isQuestionExist = questions.find((question) =>
          question.tests.includes(test.$id),
        );
        if (!isQuestionExist) {
          getQuestions([Query.equal("tests", test.$id)]).then((res) => {
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
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Sub Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("latest")}
            className={`px-4 py-2 rounded ${
              activeTab === "latest"
                ? "bg-indigo-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab("oldest")}
            className={`px-4 py-2 rounded ${
              activeTab === "oldest"
                ? "bg-indigo-600 text-white"
                : "bg-gray-300"
            }`}
          >
            Oldest Tests
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link to={`/student/quiz/${test.$id}`}>
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
                  <p className="text-sm text-gray-600">{test.description}</p>
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
                    <span>⏳ Duration: {test.duration} mins</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Quizzes;
