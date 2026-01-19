import { useState } from "react";

const LiveExamPanel = () => {
  const [isLive, setIsLive] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Live Exam Status:
          <span
            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              isLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isLive ? "LIVE" : "STOPPED"}
          </span>
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Start
          </button>
          <button
            onClick={() => setIsLive(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Stop
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card title="Total Questions" value="50" />
        <Card title="Total Marks" value="100" />
        <Card title="Passing Marks" value="33" />
        <Card title="Connected Students" value="128" />
        <Card title="Total Time" value="60 min" />
        <Card title="Remaining Time" value="42 min" highlight />
      </div>

      {/* Edit Time */}
      <div className="flex justify-end">
        <button className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100">
          Edit Time
        </button>
      </div>
    </div>
  );
};

export default LiveExamPanel;

const Card = ({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) => {
  return (
    <div
      className={`rounded-lg p-4 text-center shadow-sm border ${
        highlight ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
};
