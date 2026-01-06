import React from "react";
import Leaderboard from "../Leaderboard";
const Admin = () => {
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
    <div>
      <Leaderboard
        students={students}
        />
    </div>
  );
};

export default Admin;
