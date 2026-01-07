import React from "react";
import { type LeaderboardProps } from "../../types";
import Typo from "./Typo";

const Leaderboard = ({ students }: { students: LeaderboardProps[] }) => {
  return (
    <div className="max-w-4xl mx-auto mt-6 border border-gray-300 rounded-lg overflow-hidden">
      {/* Header – hide on mobile */}
      <div className="hidden md:grid grid-cols-6 bg-gray-800 text-white font-semibold text-center gap-5 md:gap-0">
        <div className="p-3">Rank</div>
        <div className="p-3">Name</div>
        <div className="p-3">Total Marks</div>
        <div className="p-3">Total Correct</div>
        <div className="p-3">Percentage</div>
        <div className="p-3">Grade</div>
      </div>

      {students.map((student, index) => (
        <div
          key={index}
          className="border-t p-4 md:p-0 flex flex-col gap-3 md:gap-0 md:grid md:grid-cols-6 md:text-center"
        >
          {/* Name */}
          <div className="flex justify-between md:block md:p-3">
            <span className="md:hidden text-gray-500">Rank</span>
            <span>{index + 1}</span>
          </div>

          <div className="flex items-center gap-3 md:p-3">
            <img
              src={student.img}
              alt={student.name}
              className="w-10 h-10 rounded-full "
            />
            <div className="text-left">
              <Typo className="text-gray-800 text-sm font-medium">
                {student.name}
              </Typo>
              <Typo className="text-gray-500 text-xs">{student.email}</Typo>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between md:block md:p-3">
            <span className="md:hidden text-gray-500">Total Marks</span>
            <span>100</span>
          </div>

          <div className="flex justify-between md:block md:p-3">
            <span className="md:hidden text-gray-500">Correct</span>
            <span>85</span>
          </div>

          <div className="flex justify-between md:block md:p-3">
            <span className="md:hidden text-gray-500">Percentage</span>
            <span>85%</span>
          </div>

          <div className="flex justify-between md:block md:p-3 font-bold text-green-600">
            <span className="md:hidden text-gray-500">Grade</span>
            <span>A</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
