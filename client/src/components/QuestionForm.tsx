import Input from "./Input";
import Select from "./Select";
import { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import { Query } from "appwrite";
import Button from "./Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
// import { type TestFormValues } from "./TestForm";
import useQuestion from "../hooks/useQuestion";
import type {
  TestDoc,
  QuestionDoc,
  Question,
  QuestionOptions,
} from "../../types";
interface IFormInputAction<T> {
  payload: T;
  type: "add" | "edit";
}
interface QuestionFormProps {
  test: TestDoc | null;
  onQuestionSubmit: (isQuestionSubmit: boolean) => void;
}

const QuestionForm = ({ test, onQuestionSubmit }: QuestionFormProps) => {
  //if test is already in local storage then set it to test state  for ts
  const { getQuestions, createQuestion, updateQuestion } = useQuestion();
  const isFirstRender = useRef(true);
  const [questions, setQuestions] = useState<QuestionDoc[] | null>(null);
  const [question, setQuestion] = useState<QuestionDoc | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<Question>({
    defaultValues: {
      $id: "",
      title: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      marks: "0",
      tests: test ? [test.$id] : [],
    },
  });
  const onQuestionFormSubmit: SubmitHandler<
    IFormInputAction<Question>
  > = async (action) => {
    if (action.type === "add") {
      createQuestion({
        $id: action.payload.$id,
        title: action.payload.title,
        optionA: action.payload.optionA,
        optionB: action.payload.optionB,
        optionC: action.payload.optionC,
        optionD: action.payload.optionD,
        correctAnswer: action.payload.correctAnswer,
        marks: action.payload.marks,
        tests: test?.$id ? [test?.$id] : [],
      }).then(async (_) => {
        onQuestionSubmit(true);
      });
    } else {
      const findUpdateQuestion = questions?.find(
        (question) => question.$id === action.payload.$id,
      );
      if (!test) return;
      if (findUpdateQuestion) {
        const isTestIdExist = findUpdateQuestion.tests.includes(test?.$id);
        updateQuestion({
          $id: action.payload.$id,
          title: action.payload.title,
          optionA: action.payload.optionA,
          optionB: action.payload.optionB,
          optionC: action.payload.optionC,
          optionD: action.payload.optionD,
          correctAnswer: action.payload.correctAnswer,
          marks: action.payload.marks,
          tests: isTestIdExist
            ? findUpdateQuestion.tests
            : [...findUpdateQuestion.tests, test?.$id],
        }).then((_) => {
          onQuestionSubmit(true);
        });
      }
    }
    setValue("$id", "");
    setValue("title", "");
    setValue("optionA", "");
    setValue("optionB", "");
    setValue("optionC", "");
    setValue("optionD", "");
    setValue("correctAnswer", "");
    setValue("marks", "");
  };
  const editQuestion = ($id: string) => {
    setEdit(true);
    const question = questions?.find((question) => question.$id === $id);
    if (question) {
      setValue("$id", question.$id);
      setValue("title", question.title);
      setValue("optionA", question.optionA);
      setValue("optionB", question.optionB);
      setValue("optionC", question.optionC);
      setValue("optionD", question.optionD);
      setValue("correctAnswer", question.correctAnswer);
      setValue("marks", question.marks);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setEdit(false);
  }, [question, setQuestion]);

  useEffect(() => {
    if (test) {
      if (test) {
        getQuestions([Query.equal("tests", test.$id)]).then((res) => {
          setQuestions(res.rows);
        });
      }
    }
  }, [test]);
  useEffect(() => {
    watch((data) => {
      if (data.title) {
        data.title = data.title.trim();
      }
      if (data.optionA) {
        data.optionA = data.optionA.trim();
      }
      if (data.optionB) {
        data.optionB = data.optionB.trim();
      }
      if (data.optionC) {
        data.optionC = data.optionC.trim();
      }
      if (data.optionD) {
        data.optionD = data.optionD.trim();
      }
    });
  }, [watch]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {edit ? "Edit Question" : "Add Question"}
        </h1>

        {edit && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
            Edit Mode
          </span>
        )}
      </div>

      {/* FORM CARD */}
      <form
        onSubmit={handleSubmit((data) =>
          onQuestionFormSubmit({
            payload: {
              ...data,
              $id: edit ? data.$id : uuid(),
            },
            type: edit ? "edit" : "add",
          }),
        )}
        className="mt-5 bg-white p-5 rounded-lg shadow space-y-5"
      >
        {/* Question */}
        <div>
          <label className="text-sm font-medium">Question</label>
          <Controller
            name="title"
            rules={{ required: "Question is required" }}
            control={control}
            render={({ field }) => (
              <Input type="text" {...field} placeholder="Enter question" />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <div key={opt}>
              <label className="text-sm font-medium">Option {opt}</label>
              <Controller
                name={`option${opt}` as keyof QuestionOptions}
                control={control}
                rules={{ required: `Option ${opt} is required` }}
                render={({ field }) => (
                  <Input
                    type="text"
                    {...field}
                    placeholder={`Enter option ${opt}`}
                  />
                )}
              />
              {errors[`option${opt}` as keyof Question] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`option${opt}` as keyof Question]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Correct + Marks */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Correct Answer</label>
            <Controller
              name="correctAnswer"
              control={control}
              rules={{ required: "Correct answer is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={["A", "B", "C", "D"]}
                  placeholder="Select answer"
                />
              )}
            />
            {errors.correctAnswer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correctAnswer.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Marks</label>
            <Controller
              name="marks"
              rules={{ required: "Marks is required" }}
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="e.g. 1" />
              )}
            />
            {errors.marks && (
              <p className="text-red-500 text-sm mt-1">
                {errors.marks.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-md font-medium
           hover:bg-blue-700 transition
           focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          {edit ? "Update Question" : "Add Question"}
        </Button>
      </form>

      {/* QUESTIONS LIST */}
      {questions && questions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Questions ({questions.length})
          </h2>

          <div className="grid sm:grid-cols-2 place-items-center lg:grid-cols-3 gap-5">
            {questions.map((q, index) => (
              <div
                key={q.$id}
                className="bg-white rounded-lg shadow p-4 relative"
              >
                {/* Edit */}
                <Button
                  className="absolute top-2 right-2 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium
                    hover:bg-amber-600 transition
                    focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onClick={() => editQuestion(q.$id)}
                >
                  Edit
                </Button>

                <h3 className="font-semibold">
                  Q{index + 1}. {q.title}
                </h3>

                <div className="mt-3 space-y-1 text-sm">
                  {["A", "B", "C", "D"].map((opt) => (
                    <div
                      key={opt}
                      className={`p-2 w-75 overflow-x-auto rounded border ${
                        q.correctAnswer === opt
                          ? "bg-green-50 border-green-400 font-medium"
                          : ""
                      }`}
                    >
                      <span>
                        {opt}
                        {" " + ""}
                        {q[`option${opt}` as keyof typeof q]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between text-sm text-gray-600">
                  <span>Correct: {q.correctAnswer}</span>
                  <span>Marks: {q.marks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default QuestionForm;
