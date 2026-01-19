import { useState } from "react";
import Leaderboard from "../Leaderboard";
import LiveExamPanel from "../LiveExamPanel";
import Test from "../Test";

// import { useAuth0 } from "@auth0/auth0-react";
const Admin = () => {
  const [activeTab, setActiveTab] = useState("Live");
  // const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const tabs = ["Live", "Tests", "Leaderboard", "Students"];
  const students = [
    {
      name: "John Doe",
      email: "john@doe.com",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
      totalMarks: 10,
      totalCorrect: 8,
      percentage: 80,
      grade: "A",
    },
    {
      name: "Jane Doe",
      email: "jane@doe.com",
      img: "https://randomuser.me/api/portraits/women/1.jpg",
      totalMarks: 10,
      totalCorrect: 6,
      percentage: 60,
      grade: "A",
    },
    {
      name: "John Doe",
      email: "john@doe.com",
      img: "https://randomuser.me/api/portraits/men/1.jpg",
      totalMarks: 10,
      totalCorrect: 8,
      percentage: 80,
      grade: "A",
    },
    {
      name: "Jane Doe",
      email: "jane@doe.com",
      img: "https://randomuser.me/api/portraits/women/1.jpg",
      totalMarks: 10,
      totalCorrect: 6,
      percentage: 60,
      grade: "A",
    },
  ];
  return (
    <div className="max-w-5xl mx-auto mt-6">
      {/* Tabs Header */}

      <div className="flex border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all
              ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Live" && <LiveExamPanel />}
        {activeTab === "Tests" && <Test />}
        {activeTab === "Leaderboard" && <Leaderboard students={students} />}
        {/* {breadcrumbs.includes("AddTest") && <div>add test </div>} */}
      </div>
    </div>
  );
};

export default Admin;
