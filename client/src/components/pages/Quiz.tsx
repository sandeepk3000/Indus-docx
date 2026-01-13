import React, { useState, useEffect, useRef } from "react";
import Button from "../Button";
import { type Test } from "../QuestionForm";
import Typo from "../Typo";
import Timer from "../Timer";
import Leaderboard from "../Leaderboard";
import { type IFormInput } from "../QuestionForm";

interface YourAnswer {
  questionId: string;
  answer: string;
}
interface CheckedAnswer extends Omit<IFormInput, "marks"> {
  isCorrect: boolean;
  answer: string;
}
export interface Result {
  userId: string;
  testId: string;
  checkedAnswers: CheckedAnswer[];
  totalMarks: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalQuestions: number;
  totalMarksObtained: number;
}
const Quiz = () => {
  // const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [isTimerStop, setIsTimerStop] = useState<boolean>(false);
  const [yourAnswers, setYourAnswers] = useState<YourAnswer[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  useEffect(() => {
    const localTest: Test | null = getTestFromLocal("2");

    if (localTest) {
      setTest(localTest);
    }
  }, [yourAnswers, setYourAnswers]);
  const getTestFromLocal = (testId: string): Test | null => {
    const localTestString = localStorage.getItem(testId);
    if (localTestString) {
      const localTest: Test = JSON.parse(localTestString);
      return localTest;
    }
    return null;
  };
  const handleOption = (yourAnswer: YourAnswer) => {
    const filteredAnswers = yourAnswers.filter(
      (answer) => answer.questionId !== yourAnswer.questionId,
    );
    const isAnswerExist: YourAnswer | undefined = yourAnswers.find(
      (answer) =>
        answer.questionId === yourAnswer.questionId &&
        answer.answer === yourAnswer.answer,
    );
    if (!isAnswerExist) {
      setYourAnswers([...filteredAnswers, yourAnswer]);
    } else {
      setYourAnswers([...filteredAnswers]);
    }
  };
  const handleStopTimer = (flag: boolean): void => {
    if (flag) {
      // alert("Time is up");
      setIsTimerStop(flag);
    }
  };
  useEffect(() => {
    if (isTimerStop) {
      handleSubmit();
    }
  }, [isTimerStop]);
  const handleSubmit = () => {
    const checkedAnswers: CheckedAnswer[] | undefined = test?.questions.map(
      (question: IFormInput) => {
        const yourAnswer = yourAnswers.find(
          (answer) => answer.questionId === question.questionId,
        );
        if (yourAnswer) {
          return {
            ...question,
            answer: yourAnswer.answer,
            isCorrect: yourAnswer.answer === question.correctAnswer,
          };
        }
        return {
          ...question,
          answer: "",
          isCorrect: false,
        };
      },
    );

    if (checkedAnswers && test) {
      const totalMarks: number = test.questions.reduce(
        (acc: number, _: any) => {
          return acc + 1;
        },
        0,
      );
      const totalCorrect: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) => {
          if (answer.isCorrect) {
            const question = test.questions.find(
              (question: IFormInput) =>
                question.questionId === answer.questionId,
            );
            if (question) {
              return acc + 1;
            }
          }
          return acc;
        },
        0,
      );
      const totalWrong: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) => {
          if (!answer.isCorrect && answer.answer !== "") {
            return acc + 1;
          }
          return acc;
        },
        0,
      );
      const totalSkipped: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) => {
          if (answer.answer === "") {
            return acc + 1;
          }
          return acc;
        },
        0,
      );
      const totalQuestions: number = test.questions.length;
      const totalMarksObtained: number = totalCorrect;
      const r: Result = {
        userId: "1",
        testId: test.testId,
        checkedAnswers,
        totalMarks,
        totalCorrect,
        totalWrong,
        totalSkipped,
        totalQuestions,
        totalMarksObtained,
      };
      console.log("result", r);
      setResult(r);
    }
  };
  useEffect(() => {
    console.log(ref);
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries) => {
        setIsSticky(!entries[0].isIntersecting);
      },
      {
        threshold: 1,
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isSticky]);
  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) {
      return "A+";
    } else if (percentage >= 80) {
      return "A";
    } else if (percentage >= 70) {
      return "B";
    } else if (percentage >= 60) {
      return "C";
    } else if (percentage >= 50) {
      return "D";
    } else if (percentage >= 40) {
      return "E";
    } else {
      return "F";
    }
  };
  const calculatePercentage = (
    totalMarks: number,
    totalMarksObtained: number,
  ): number => {
    return Math.round((totalMarksObtained / totalMarks) * 100);
  };
  return (
    <div>
      {!result ? (
        <div className="w-full bg-gray grid grid-cols-1 md:grid-cols-2 gap-5 relative">
          <div className="relative">
            <div
              className={` w-full flex gap-5 w-auto flex-row md:flex-col ${isSticky ? "md:sticky fixed" : ""} bg-primary left-0 bottom-0 md:top-0 p-4`}
            >
              <Timer
                className="text-primary bg-white ring rounded-md text-center grid place-items-center p-2"
                stop={handleStopTimer}
                time={10}
                isRunning={true}
              />
              <div className="bg-white w-full  rounded-md p-2 ring ring-primary flex flex-row md:flex-col gap-5 overflow-x-auto">
                <div className="fit-content flex  flex-row gap-5 md:flex-wrap justify-start items-center">
                  {test?.questions.map((question, index) => {
                    const yourAnswer = yourAnswers.find(
                      (answer) => answer.questionId === question.questionId,
                    );
                    return (
                      <Button
                        onClick={() => {
                          document
                            .getElementById(question.questionId)
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`rounded-full bg-accent-dark shrink-0 h-8 w-8  ${
                          yourAnswer ? "bg-primary" : ""
                        }`}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
                {!isTimerStop ? (
                  <Button
                    className={`bg-blue-700 px-5 py-2 shrink-0`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5">
            <div ref={ref}></div>
            {test?.questions.map((question, index) => {
              const yourAnswer = yourAnswers.find(
                (answer) => answer.questionId === question.questionId,
              );
              return (
                <div
                  id={question.questionId}
                  className="bg-white shadow-md border-1 p-4 rounded-md border-background-light"
                >
                  <Typo className="text-lg font-bold text-background-dark">
                    {`Questions ${index + 1} of ${test.questions.length}`}
                  </Typo>
                  <Typo className="text-xl font-bold text-background-dark my-4">
                    {`Q${index + 1})  ${question.title}`}
                  </Typo>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Button
                      className={`w-full h-12 flex border-3 rounded-md border-background-light items-center justify-start bg-white p-1 ${
                        yourAnswer?.answer === "A" ? "border-primary" : ""
                      }`}
                      onClick={() =>
                        handleOption({
                          questionId: question.questionId,
                          answer: "A",
                        })
                      }
                    >
                      <span
                        className={`w-8 h-full shrink-0  rounded-md inline-flex items-center justify-center bg-background-light text-background-dark font-bold mr-2 ${
                          yourAnswer?.answer === "A"
                            ? "bg-primary-light text-white"
                            : ""
                        }`}
                      >
                        A
                      </span>
                      <span className="text-background-dark font-bold">
                        {question.optionA}
                      </span>
                    </Button>
                    <Button
                      className={`w-full h-12 flex border-3 rounded-md border-background-light items-center justify-start bg-white p-1 ${
                        yourAnswer?.answer === "B" ? "border-primary" : ""
                      }`}
                      onClick={() =>
                        handleOption({
                          questionId: question.questionId,
                          answer: "B",
                        })
                      }
                    >
                      <span
                        className={`w-8 h-full shrink-0  rounded-md inline-flex items-center justify-center bg-background-light text-background-dark font-bold mr-2 ${
                          yourAnswer?.answer === "B"
                            ? "bg-primary-light text-white"
                            : ""
                        }`}
                      >
                        B
                      </span>
                      <span className="text-background-dark font-bold">
                        {question.optionB}
                      </span>
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5 mt-4">
                    <Button
                      className={`w-full h-12 flex border-3 rounded-md border-background-light items-center justify-start bg-white p-1 ${
                        yourAnswer?.answer === "C" ? "border-primary" : ""
                      }`}
                      onClick={() =>
                        handleOption({
                          questionId: question.questionId,
                          answer: "C",
                        })
                      }
                    >
                      <span
                        className={`w-8 h-full shrink-0  rounded-md inline-flex items-center justify-center bg-background-light text-background-dark font-bold mr-2 ${
                          yourAnswer?.answer === "C"
                            ? "bg-primary-light text-white"
                            : ""
                        }`}
                      >
                        C
                      </span>
                      <span className="text-background-dark font-bold">
                        {question.optionC}
                      </span>
                    </Button>
                    <Button
                      className={`w-full h-12 flex border-3 rounded-md border-background-light items-center justify-start bg-white p-1 ${
                        yourAnswer?.answer === "D" ? "border-primary" : ""
                      }`}
                      onClick={() =>
                        handleOption({
                          questionId: question.questionId,
                          answer: "D",
                        })
                      }
                    >
                      <span
                        className={`w-8 h-full shrink-0  rounded-md inline-flex items-center justify-center bg-background-light text-background-dark font-bold mr-2 ${
                          yourAnswer?.answer === "D"
                            ? "bg-primary-light text-white"
                            : ""
                        }`}
                      >
                        D
                      </span>
                      <span className="text-background-dark font-bold">
                        {question.optionD}
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Leaderboard
          students={[
            {
              name: "John Doe",
              email: "john@gmail.com",
              img: "https://randomuser.me/api/portraits/men/1.jpg",
              totalMarks: result.totalMarks,
              totalCorrect: result.totalCorrect,
              percentage: calculatePercentage(
                result.totalMarks,
                result.totalMarksObtained,
              ),
              grade: calculateGrade(
                calculatePercentage(
                  result.totalMarks,
                  result.totalMarksObtained,
                ),
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default Quiz;
