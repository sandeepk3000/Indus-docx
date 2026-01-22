import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { ID } from "appwrite";
import Typo from "./Typo";
import Timer from "./Timer";
import Leaderboard from "./Leaderboard";
import useQuestion from "./../hooks/useQuestion";
import useResult from "./../hooks/useResult";
import useTest from "./../hooks/useTest";

import gradeGenerater from "./../utils/gradeGenerater";
import percentageGenerater from "./../utils/percentageGenerater";
import type { QuestionDoc, TestDoc, ResultDoc, Result } from "./../../types";

interface YourAnswer {
  questionId: string;
  answer: string;
}
interface CheckedAnswer extends QuestionDoc {
  isCorrect: boolean;
  answer: string;
}

interface QuizProps {
  test: TestDoc | null;
  testCode: string;
}

const Quiz = ({ test, testCode }: QuizProps) => {
  const { getQuestions } = useQuestion();
  const { createResult, getResult } = useResult();
  const { pushTestCode } = useTest();

  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [isTimerStop, setIsTimerStop] = useState(false);
  const [yourAnswers, setYourAnswers] = useState<YourAnswer[]>([]);
  const [result, setResult] = useState<ResultDoc | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (test) {
      getQuestions([test.$id]).then((res) => {
        setQuestions(res.rows);
      });
    }
  }, [test]);

  const handleOption = (yourAnswer: YourAnswer) => {
    const filtered = yourAnswers.filter(
      (a) => a.questionId !== yourAnswer.questionId,
    );
    const exists = yourAnswers.find(
      (a) =>
        a.questionId === yourAnswer.questionId &&
        a.answer === yourAnswer.answer,
    );
    setYourAnswers(exists ? filtered : [...filtered, yourAnswer]);
  };

  const handleStopTimer = (flag: boolean) => {
    if (flag) setIsTimerStop(true);
    console.log("Timer stopped");
  };

  useEffect(() => {
    if (isTimerStop) handleSubmit();
  }, [isTimerStop]);

  const handleSubmit = async () => {
    console.log("Submitted");
    const checkedAnswers: CheckedAnswer[] | undefined = questions?.map(
      (question) => {
        const yourAnswer = yourAnswers.find(
          (answer) => answer.questionId === question.$id,
        );
        console.log(yourAnswer);
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
    console.log("checkedAnswers");
    console.log(checkedAnswers);

    if (checkedAnswers && questions) {
      const totalMarks: number = questions.reduce(
        (acc: number, question) => acc + Number(question.marks),
        0,
      );

      const totalCorrect: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) =>
          answer.isCorrect ? acc + 1 : acc,
        0,
      );

      const totalWrong: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) =>
          !answer.isCorrect && answer.answer !== "" ? acc + 1 : acc,
        0,
      );

      const totalSkipped: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) =>
          answer.answer === "" ? acc + 1 : acc,
        0,
      );

      const obtainedMarks: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) =>
          answer.isCorrect ? acc + Number(answer.marks) : acc,
        0,
      );

      const r: Result = {
        $id: ID.unique(),
        studentId: "1",
        testId: test?.$id || "",
        checkedAnswers: [JSON.stringify(checkedAnswers)],
        totalMarks,
        totalCorrect,
        totalWrong,
        totalSkipped,
        obtainedMarks,
        rank: 1,
        testCode: testCode,
      };
      console.log(r);

      const res = await createResult(r);

      getResult(res.$id).then(async (res) => {
        if (res) {
          setResult(res);
          if (!testCode) {
            await pushTestCode(res.testId, res.testCode);
            alert("Test submitted successfully");
          }
        }
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setIsSticky(!entries[0].isIntersecting),
      { threshold: 1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {!result ? (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 px-3 lg:px-8 py-6">
          {/* LEFT PANEL */}

          <div className="relative">
            <div
              className={`w-full flex gap-5 flex-row lg:flex-col
                ${isSticky ? "lg:sticky fixed" : ""}
                bg-slate-50 border-t lg:border border-slate-200
                left-0 bottom-0 lg:top-0 p-4 z-50`}
            >
              {/* TIMER */}
              <Timer
                className="text-red-600 bg-red-50 border border-red-200
                           rounded-lg text-center grid place-items-center p-2 font-semibold"
                stop={handleStopTimer}
                time={Number(test?.duration) * 60}
                isRunning={true}
              />

              {/* QUESTION PALETTE */}
              <div
                className="bg-white w-full rounded-lg p-3
                           border border-slate-200
                           flex flex-row lg:flex-col gap-5 overflow-x-auto"
              >
                <div className="flex flex-row gap-3 lg:flex-wrap justify-start items-center">
                  {questions?.map((question, index) => {
                    const yourAnswer = yourAnswers.find(
                      (answer) => answer.questionId === question.$id,
                    );

                    return (
                      <Button
                        key={question.$id}
                        onClick={() =>
                          document
                            .getElementById(question.$id)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className={`h-9 w-9 rounded-full text-sm font-semibold
                          border transition-all
                          ${
                            yourAnswer
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                              : "bg-orange-400 border-orange-400 text-white shadow-sm"
                          }
                        `}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>

                {/* SUBMIT */}
                {!isTimerStop && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700
                               border border-blue-700
                               text-white px-5 py-2 rounded-lg
                               font-semibold shadow-sm shrink-0"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* QUESTIONS */}
          <div className="space-y-6">
            <div ref={ref}></div>

            {questions?.map((q, i) => {
              const yourAnswer = yourAnswers.find(
                (a) => a.questionId === q.$id,
              );

              return (
                <div
                  key={q.$id}
                  id={q.$id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <Typo className="text-sm text-gray-500 mb-1">
                    Question {i + 1} of {questions.length}
                  </Typo>

                  <Typo className="text-lg font-semibold text-gray-800 mb-5">
                    Q{i + 1}. {q.title}
                  </Typo>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {(["A", "B", "C", "D"] as const).map((opt) => (
                      <Button
                        key={opt}
                        onClick={() =>
                          handleOption({ questionId: q.$id, answer: opt })
                        }
                        className={`flex items-center gap-3 border rounded-lg p-3 text-left
                          ${
                            yourAnswer?.answer === opt
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                      >
                        <span
                          className={`h-8 w-8 rounded-md flex items-center justify-center font-bold
                            ${
                              yourAnswer?.answer === opt
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {opt}
                        </span>
                        <span className="font-medium text-gray-800">
                          {(q as any)[`option${opt}`]}
                        </span>
                      </Button>
                    ))}
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
              percentage: percentageGenerater(
                result.obtainedMarks,
                result.totalMarks,
              ),
              grade: gradeGenerater(
                percentageGenerater(result.obtainedMarks, result.totalMarks),
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default Quiz;
