import { useState, useEffect } from "react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";
import useMedia from "../../hooks/useMedia";
import { formatDateTime } from "../../utils/dateFormatter";

import useQuestion from "../../hooks/useQuestion";
import type { QuestionDoc } from "../../../types";
import useResult from "../../hooks/useResult";
import type { ResultDoc } from "../../../types";
import { Query } from "appwrite";
import { useAuth0 } from "@auth0/auth0-react";
import Leaderboard from "../Leaderboard";

const Leaderboards = () => {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<
    ResultDoc[] | null
  >(null);
  const [testsData, setTestsData] = useState<TestDoc[] | null>(null);
  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [results, setResults] = useState<ResultDoc[] | null>(null);
  const activeTab = "latest";
  const { user } = useAuth0();
  const userId = user?.sub;
  const { getResults } = useResult();
  const { getQuestions } = useQuestion();
  const { getFileView } = useMedia();
  const { getTest } = useTest();


  useEffect(() => {
    if (!userId) {
      alert("Please login to view your results");
      return;
    }
    getResults([Query.startsWith("testCode", "LIVE")]).then((res) => {
      if (activeTab === "latest") {
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
        console.log(res.rows[0].thumbnail);
        
        setTestsData(res.rows);
      });
      getQuestions(testIds).then((res) => {
        setQuestions(res.rows);
      });
      setResults(res.rows);
    });
  }, []);
  const getLiveCodes = (): string[] => {
    if (results) {
      
      return [...new Set(results.map((result) => result.testCode))];
    } else {
      return [];
    }
  };

  return (
    <div>
      {testsData &&
        questions &&
        !selectedLeaderboard &&
        getLiveCodes().map((liveCode) => {
          const totalResults = results?.filter(
            (result) => result.testCode === liveCode,
          );
          if (!totalResults) return null;
          const test = testsData?.find((test) =>
            test.testCodes?.includes(liveCode),
          );
          if (!test) return null;
          const totalQuestions = questions?.filter((question) =>
            question.tests.includes(test?.$id),
          );
          const totalMarks = totalQuestions?.reduce(
            (acc, question) => acc + Number(question.marks),
            0,
          );
          if (!totalQuestions || !totalMarks) return null;

          return (
            <div className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
              {/* Thumbnail */}
              <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden">
                <img
                  src={getFileView(test.thumbnail)}
                  alt={test.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Title */}
                <h3 className="line-clamp-1 text-base sm:text-lg font-semibold text-gray-900">
                  {test.title}
                </h3>

                {/* Description */}
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {test.description}
                </p>

                {/* Meta Info */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-500">Test Code</p>
                    <p className="font-medium text-gray-800 break-all">
                      {totalResults[0].testCode}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-500">Total Students</p>
                    <p className="font-medium text-gray-800">
                      {totalResults.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-500">Total Marks</p>
                    <p className="font-medium text-gray-800">{totalMarks}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-500">Total Questions</p>
                    <p className="font-medium text-gray-800">
                      {totalQuestions.length}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-2">
                    <p className="text-xs text-gray-500">Created On</p>
                    <p className="font-medium text-gray-800">
                      {formatDateTime(
                        totalResults[totalResults.length - 1].$createdAt,
                      )}
                    </p>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => setSelectedLeaderboard(totalResults)}
                  className="mt-4 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View Test
                </button>
              </div>
            </div>
          );
        })}
      {selectedLeaderboard && <Leaderboard students={selectedLeaderboard} />}
    </div>
  );
};

export default Leaderboards;
