import React from "react";
import { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import useTest from "../hooks/useTest";
import TestFrom from "./TestForm";
import { type Models } from "appwrite";
import useMedia from "../hooks/useMedia";
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
  const { getTest } = useTest();
  const { getFileView } = useMedia();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Models.Row[]>([]);
  const fetchTest = async () => {
    try {
      const res = await getTest();
      if (res) {
        setTests(res.rows);
      }
    } catch (err) {
      console.log("error");
      // console.log(err);
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
          tests &&
          tests.map((test) => (
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
              {/* Image */}
              <div className="h-40 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={getFileView(test.thumbnail)}
                  alt={test.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <span>{test.thumbnail}</span>
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {test.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {test.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>📝 {0} Questions</span>
                  <span>⏱ {test.duration} min</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={() => navigate(`/admin/tests/${test.$id}/edit`)}
                  >
                    Edit
                  </Button>

                  <button className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tests;
