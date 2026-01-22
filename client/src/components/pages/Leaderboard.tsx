import { useState, useEffect } from "react";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";

const Leaderboard = () => {
  const [search, setSearch] = useState("");
  const [testsData, setTestsData] = useState<TestDoc[]>([]);
  const { getTest } = useTest();

  useEffect(() => {
    getTest().then((res) => {
      setTestsData(res.rows);
    });
  }, []);

  const filteredTests = testsData.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Leaderboard</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.$id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition"
            >
              {/* Thumbnail */}
              <img
                src={test.thumbnail}
                alt={test.title}
                className="h-40 w-full object-cover rounded-t-xl"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {test.title}
                </h2>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>⏱ {test.duration} min</span>
                  <span>📝 {0} Questions</span>
                </div>

                <button className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700">
                  View Leaderboard
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No tests found</p>
        )}
      </div>
    </div>
  );
};
export default Leaderboard;
