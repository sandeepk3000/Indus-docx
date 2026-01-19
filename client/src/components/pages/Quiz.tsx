import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import { ID } from "appwrite";
import Typo from "../Typo";
import Timer from "../Timer";
import Leaderboard from "../Leaderboard";
import useQuestion from "../../hooks/useQuestion";
import useResult from "../../hooks/useResult";
import type { QuestionDoc, TestDoc, ResultDoc, Result } from "../../../types";

interface YourAnswer {
  questionId: string;
  answer: string;
}
interface CheckedAnswer extends Omit<QuestionDoc, "marks"> {
  isCorrect: boolean;
  answer: string;
}

interface QuizProps {
  test: TestDoc | null;
}
const Quiz = ({ test }: QuizProps) => {
  // const navigate = useNavigate();
  const { getQuestions } = useQuestion();
  const { createResult, getResults } = useResult();
  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [isTimerStop, setIsTimerStop] = useState<boolean>(false);
  const [yourAnswers, setYourAnswers] = useState<YourAnswer[]>([]);
  const [result, setResult] = useState<ResultDoc | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  useEffect(() => {
    console.log(test);
    if (result) {
    }
  }, [result]);
  useEffect(() => {
    console.log(test);
    if (test) {
      getQuestions([test.$id]).then((res) => {
        setQuestions(res.rows);
      });
    }
  }, [test]);

  const handleOption = (yourAnswer: YourAnswer) => {
    console.log(yourAnswer);
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
  const handleSubmit = async () => {
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
    console.log(checkedAnswers);
    if (checkedAnswers && questions) {
      const totalMarks: number = questions.reduce((acc: number, question) => {
        return acc + Number(question.marks);
      }, 0);
      const totalCorrect: number = checkedAnswers.reduce(
        (acc: number, answer: CheckedAnswer) => {
          if (answer.isCorrect) {
            return acc + 1;
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
      const obtainedMarks: number = totalCorrect;
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
      };
      const res = await createResult(r);
      getResults(res.$id).then((res) => {
        if (res) {
          setResult(res);
        }
      });
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
                time={25}
                isRunning={true}
              />
              <div className="bg-white w-full  rounded-md p-2 ring ring-primary flex flex-row md:flex-col gap-5 overflow-x-auto">
                <div className="fit-content flex  flex-row gap-5 md:flex-wrap justify-start items-center">
                  {questions?.map((question, index) => {
                    const yourAnswer = yourAnswers.find(
                      (answer) => answer.questionId === question.$id,
                    );
                    return (
                      <Button
                        onClick={() => {
                          document
                            .getElementById(question.$id)
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
            {questions?.map((question, index) => {
              const yourAnswer = yourAnswers.find(
                (answer) => answer.questionId === question.$id,
              );
              return (
                <div
                  id={question.$id}
                  className="bg-white shadow-md border-1 p-4 rounded-md border-background-light"
                >
                  <Typo className="text-lg font-bold text-background-dark">
                    {`Questions ${index + 1} of ${questions.length}`}
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
                          questionId: question.$id,
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
                          questionId: question.$id,
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
                          questionId: question.$id,
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
                          questionId: question.$id,
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
              percentage: 0,
              grade: "a",
            },
          ]}
        />
      )}
    </div>
  );
};

export default Quiz;
