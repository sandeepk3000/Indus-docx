import React from "react";
import { type LeaderboardProps } from "../../types";
const Leaderboard = ({ students }: { students: LeaderboardProps[] }) => {
  return (
    <div className="w-full bg-gray grid grid-cols-1 md:grid-cols-2 gap-5 relative">
      <div className="relative">
        <div
          className={` w-full flex gap-5 w-auto flex-row md:flex-col ${true ? "md:sticky fixed" : " "} bg-primary left-0 bottom-0 md:top-0 p-4`}
        >
          <div className="bg-white w-full  rounded-md p-2 ring ring-primary flex flex-row md:flex-col gap-5 overflow-x-auto">
            <div className="fit-content flex  flex-row gap-5 md:flex-wrap justify-start items-center">
              {students.map((student, index) => (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2">
                    <img
                      src={student.img}
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-background-dark">
                        {student.name}
                      </h3>
                      <p className="text-sm text-background-dark">
                        {student.email}
                      </p>
                      <p className="text-sm text-background-dark">
                        {student.totalMarks}
                      </p>
                      <p className="text-sm text-background-dark">
                        {student.totalCorrect}
                      </p>
                      <p className="text-sm text-background-dark">
                        {student.percentage}
                      </p>
                      <p className="text-sm text-background-dark">
                        {student.grade}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
