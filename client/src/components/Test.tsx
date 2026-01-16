import React from "react";
import { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import useGetTest from "../hooks/useGetTest";
import TestFrom from "./TestForm";
interface TestProps {
  onAddTest?: () => void;
  onEditTest?: () => void;
}
interface Tab {
  tabname: string;
  breadcrumbs: string;
  isActive: boolean;
}
const Tests = ({ onAddTest, onEditTest }: TestProps) => {
  const { getTest } = useGetTest();
  const [tests, setTests] = useState([]);
  const fetchTest = async () => {
    try {
      const res = await getTest();
      console.log(res);
      console.log("rows", res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTest();
  }, []);
  const onTestSubmit = (isTestCreated: boolean) => {
    if (isTestCreated) {
      setTabs(
        tabs.map((tab) =>
          tab.tabname === "create"
            ? { ...tab, breadcrumbs: "/question" }
            : { ...tab },
        ),
      );
    }
  };
  const [tabs, setTabs] = useState<Tab[]>([
    {
      tabname: "home",
      breadcrumbs: "",
      isActive: true,
    },
  ]);
  const handleTaps = (activeTab: string, path: string) => {
    const isExistTap = tabs.find((tab) => tab.tabname === activeTab);
    if (isExistTap) {
      setTabs(
        tabs.map((tab) =>
          tab.tabname === activeTab
            ? { ...tab, isActive: true }
            : { ...tab, isActive: false },
        ),
      );
    } else {
      setTabs([
        ...tabs.map((tab) => ({ ...tab, isActive: false })),
        {
          tabname: activeTab,
          breadcrumbs: path,
          isActive: true,
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tabs Header */}
      {JSON.stringify(tabs)}
      <Button
        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
        onClick={() => {}}
      >
        Back
      </Button>
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleTaps("home", "")}
          className={`px-4 py-2 text-sm font-medium transition
            ${
              tabs.find((tab) => tab.tabname === "home")?.isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
        >
          Home
        </button>

        <button
          onClick={() => handleTaps("create", "")}
          className={`px-4 py-2 text-sm font-medium transition
            ${
              tabs.find((tab) => tab.tabname === "create")?.isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
        >
          Create Test
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find((tab) => tab.tabname === "home")?.isActive && (
          <div>
            <h2 className="text-lg font-semibold mb-2">All Tests</h2>
            <p className="text-gray-600">
              List of available tests will appear here.
            </p>
          </div>
        )}

        {tabs.find((tab) => tab.tabname === "create")?.isActive &&
        !tabs
          .find((tab) => tab.tabname === "create")
          ?.breadcrumbs.includes("/question") ? (
          <TestFrom onTestSubmit={onTestSubmit} />
        ) : (
          // <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
          //   {/* Image */}
          //   <div className="h-40 w-full overflow-hidden rounded-t-2xl">
          //     <img
          //       src={image}
          //       alt={title}
          //       className="h-full w-full object-cover"
          //     />
          //   </div>

          //   {/* Content */}
          //   <div className="p-4 space-y-3">
          //     <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          //       {title}
          //     </h3>

          //     <p className="text-sm text-gray-600 line-clamp-2">
          //       {description}
          //     </p>

          //     {/* Meta info */}
          //     <div className="flex items-center justify-between text-sm text-gray-700">
          //       <span>📝 {totalQuestions} Questions</span>
          //       <span>⏱ {duration} min</span>
          //     </div>

          //     {/* Actions */}
          //     <div className="flex gap-2 pt-2">
          //       <button
          //         onClick={onEdit}
          //         className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          //       >
          //         Edit
          //       </button>

          //       <button
          //         onClick={onDelete}
          //         className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          //       >
          //         Delete
          //       </button>
          //     </div>
          //   </div>
          // </div>
          ""
        )}
      </div>
    </div>
  );
};

export default Tests;
