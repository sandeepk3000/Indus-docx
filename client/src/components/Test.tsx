import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
interface TestProps {
  onAddTest?: () => void;
  onEditTest?: () => void;
}
const Tests = ({ onAddTest, onEditTest }: TestProps) => {
  const navigate = useNavigate();
  const tests = [
    {
      id: 1,
      title: "Maths Mock Test",
      questions: 50,
      marks: 100,
      duration: "60 min",
    },
    {
      id: 2,
      title: "Physics Practice Test",
      questions: 40,
      marks: 80,
      duration: "45 min",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Tests</h2>
        <Button
          onClick={onAddTest}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Test
        </Button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
          >
            {/* Title */}
            <h3 className="text-lg font-medium text-gray-800">{test.title}</h3>

            {/* Info */}
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>Questions: {test.questions}</p>
              <p>Total Marks: {test.marks}</p>
              <p>Duration: {test.duration}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-100">
                View
              </button>
              <button className="flex-1 px-3 py-2 text-sm border border-blue-500 text-blue-600 rounded-md hover:bg-blue-50">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm border border-red-500 text-red-600 rounded-md hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tests;
