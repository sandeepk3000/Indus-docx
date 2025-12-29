import React, { useState, useEffect } from "react";
import Button from "../Button";
import { type Test } from "../TestForm";
import { useNavigate } from "react-router-dom";
const Quiz = () => {
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  useEffect(() => {
    const localTest: Test | null = getTestFromLocal("2");
    if (localTest) {
      setTest(localTest);
    }
  }, []);
  const getTestFromLocal = (testId: string): Test | null => {
    const localTestString = localStorage.getItem(testId);
    if (localTestString) {
      const localTest: Test = JSON.parse(localTestString);
      return localTest;
    }
    return null;
  };
  return (
    <div className="w-full bg-gray overflow-x-auto no-scrollbar relative">
      <Button className="bg-blue-700" onClick={() => navigate("/quiz")}>
        Edit
      </Button>
      <div className="flex gap-5 fixed top-3 w-full bg-accent-light px-5 py-2">
        {test?.questions.map((question, index) => {
          return (
            <div id={question.questionId}>
              <Button className="rounded-full bg-blue-700 h-8 w-8">
                {index + 1}
              </Button>
            </div>
          );
        })}
      </div>
      {test?.questions.map((question) => {
        return (
          <div className="grid lg:grid-cols-2 mt-5 gap-5 bg-white overflow-hidden rounded-lg shadow-lg border-1 border-primary overflow-hidden p-4">
            <h1 className="text-2xl font-bold text-background-dark">
              {question.title}
            </h1>
            <div className="grid sm:grid-cols-2 gap-5">
              <Button className="w-full flex items-center justify-start bg-background-light rounded-md p-2 ">
                <span className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-accent-light text-accent-dark font-bold mr-2">
                  a
                </span>
                <span className="text-background-dark font-bold">
                  {question.optionA}
                </span>
              </Button>
              <Button className="w-full  flex items-center justify-start bg-background-light rounded-md p-2 ">
                <span className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-accent-light text-accent-dark font-bold mr-2">
                  a
                </span>
                <span className="text-background-dark font-bold">
                  {question.optionB}
                </span>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <Button className="w-full flex items-center justify-start bg-background-light rounded-md p-2">
                <span className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-accent-light text-accent-dark font-bold mr-2">
                  a
                </span>
                <span className="text-background-dark font-bold">
                  {question.optionC}
                </span>
              </Button>
              <Button className="w-full flex items-center justify-start bg-background-light rounded-md p-2">
                <span className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-accent-light text-accent-dark font-bold mr-2">
                  a
                </span>
                <span className="text-background-dark font-bold">
                  {" "}
                  {question.optionD}
                </span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Quiz;
