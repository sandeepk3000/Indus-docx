import Input from "./Input";
import Select from "./Select";
import { useEffect, useState, useId, useRef } from "react";
import { v4 as uuid } from "uuid";
import Button from "./Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import useTest from "../hooks/useTest";
import { type Models } from "appwrite";
export interface IFormInput {
  questionId: string;
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks: string;
}
interface IFormInputAction<T> {
  payload: T;
  type: "add" | "edit";
}
interface QuestionFormProps {
  test?: Partial<Models.Row> | undefined;
}
const QuestionForm = ({ test }: QuestionFormProps) => {
  //if test is already in local storage then set it to test state  for ts
  const id = useId();
  const isFirstRender = useRef(true);
  const { updateTest } = useTest();
  const [questions, setQuestions] = useState<IFormInput[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      questionId: "2",
      title: "sdfsdf",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      marks: "0",
    },
  });
  const onQuestionSubmit: SubmitHandler<IFormInputAction<IFormInput>> = (
    action,
  ) => {
    if (action.type === "add") {
      setQuestions([...questions, action.payload]);
    } else {
      const question = questions.find(
        (question) => question.questionId === action.payload.questionId,
      );
      if (question) {
        setQuestions(
          questions.map((question) =>
            question.questionId === action.payload.questionId
              ? action.payload
              : question,
          ),
        );
      }
    }
  };
  const editQuestion = (questionId: string) => {
    setEdit(true);
    const question = questions.find(
      (question) => question.questionId === questionId,
    );
    if (question) {
      setValue("questionId", question.questionId);
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
    if (test && questions.length >= 0) {
      const newTest = {
        ...test,
        questions: questions,
      };
      storeTestInLocal(newTest);
      if (!test.$id) return;
      const localTest: Models.Row | null = getTestFromLocal(test.$id);
      if (localTest) {
        const questions = localTest.questions;
        updateTest({});
        setTest(localTest);
        setValue("questionId", "");
        setValue("title", "");
        setValue("optionA", "");
        setValue("optionB", "");
        setValue("optionC", "");
        setValue("optionD", "");
        setValue("correctAnswer", "");
        setValue("marks", "");
        setEdit(false);
      }
    }
  }, [questions, setQuestions]);

  useEffect(() => {
    // localStorage.removeItem("2");
   if(test && test.$id){
      const localTest: Models.Row | null = getTestFromLocal(test.$id);
      if (localTest){
        setQuestions(localTest.questions);
      }
   }
  }, []);
  const storeTestInLocal = (test: Test): void => {
    localStorage.setItem(test.testId, JSON.stringify(test));
  };
  const getTestFromLocal = (testId: string): Test | null => {
    const localTestString = localStorage.getItem(testId);

    if (localTestString) {
      const localTest: Test = JSON.parse(localTestString);
      return localTest;
    }
    return null;
  };
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
          onQuestionSubmit({
            payload: {
              ...data,
              questionId: edit ? getValues("questionId") : uuid(),
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
                name={`option${opt}` as keyof IFormInput}
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
              {errors[`option${opt}` as keyof IFormInput] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[`option${opt}` as keyof IFormInput]?.message}
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
      {test && test?.questions?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">
            Questions ({test.questions.length})
          </h2>

          <div className="grid sm:grid-cols-2 place-items-center lg:grid-cols-3 gap-5">
            {test.questions.map((q, index) => (
              <div
                key={q.questionId}
                className="bg-white rounded-lg shadow p-4 relative"
              >
                {/* Edit */}
                <Button
                  className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1.5 rounded-md text-sm font-medium
                    hover:bg-amber-600 transition
                    focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onClick={() => editQuestion(q.questionId)}
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
                        {q[`option${opt}` as keyof typeof q].trim()}
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
