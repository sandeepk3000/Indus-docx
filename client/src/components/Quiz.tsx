import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { ID } from "appwrite";
import Typo from "./Typo";
import Timer from "./Timer";
import Leaderboard from "./Leaderboard";
import useQuestion from "./../hooks/useQuestion";
import useResult from "./../hooks/useResult";
import useTest from "./../hooks/useTest";
import SpinnerButton from "./SpinnerButton";
import type { QuestionDoc, TestDoc, ResultDoc, Result } from "./../../types";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { user } = useAuth0();
  const userId = user?.sub;
  const { getQuestions } = useQuestion();
  const { createResult, getResult } = useResult();
  const { pushTestCode } = useTest();

  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [isTimerStop, setIsTimerStop] = useState(false);
  const [yourAnswers, setYourAnswers] = useState<YourAnswer[]>([]);
  const [result, setResult] = useState<ResultDoc | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (test) {
      setIsLoading(true);
      getQuestions([test.$id]).then((res) => {
        setQuestions(res.rows);
        setIsLoading(false);
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
  };

  useEffect(() => {
    if (isTimerStop) handleSubmit();
  }, [isTimerStop]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!userId) {
      alert("Please login to submit the test");
      return;
    }
    const checkedAnswers: CheckedAnswer[] | undefined = questions?.map(
      (question) => {
        const yourAnswer = yourAnswers.find(
          (answer) => answer.questionId === question.$id,
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
        studentId: userId,
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

      try {
        const res = await createResult(r);
        const result = await getResult(res.$id);
        if (result) {
          setResult(result);
          if (!testCode) {
            await pushTestCode(result.testId, result.testCode);
            alert("Test submitted successfully");
            setIsLoading(false);
          }
        }
      } catch (err) {
        // custom error
        alert("Error submitting test");
        setIsLoading(false);
      }
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

                <SpinnerButton
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700
                      border border-blue-700
                      text-white px-5 py-2 rounded-lg
                      font-semibold shadow-sm shrink-0"
                  loading={isLoading}
                >
                  {" "}
                  Submit
                </SpinnerButton>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Questions
                </span>
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm sm:text-base">
                  📝
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-semibold text-gray-900">
                {questions?.length}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  Total Marks
                </span>
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-green-50 text-green-600 text-sm sm:text-base">
                  ⭐
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-semibold text-gray-900">
                {questions?.reduce((acc, q) => acc + Number(q.marks), 0)}
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  Test Code
                </span>
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 text-sm sm:text-base">
                  🧾
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-gray-900 break-all">
                {testCode}
              </p>
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
        <Leaderboard students={[result]} />
      )}
    </div>
  );
};

export default Quiz;
