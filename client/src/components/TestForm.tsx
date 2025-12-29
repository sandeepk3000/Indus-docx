import Input from "./Input";
import Select from "./Select";
import { useEffect, useState, useId, useRef } from "react";
import { v4 as uuid } from "uuid";
import Button from "./Button";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
interface IFormInput {
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

export interface Test {
  testId: string;
  title: string;
  questions: IFormInput[];
}
const TestForm = () => {
  //if test is already in local storage then set it to test state  for ts
  const id = useId();
  const isFirstRender = useRef(true);
  const [questions, setQuestions] = useState<IFormInput[]>([]);
  const [test, setTest] = useState<Test | null>({
    testId: "2",
    title: "test",
    questions: [],
  });
  const [edit, setEdit] = useState<boolean>(false);
  const { control, handleSubmit, setValue, getValues } = useForm<IFormInput>({
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
      const localTest: Test | null = getTestFromLocal(test.testId);
      if (localTest) {
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
    const localTest: Test | null = getTestFromLocal("2");
    if (localTest) {
      setQuestions(localTest.questions);
      setTest(localTest);
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
      <h1>{edit ? "Edit Question" : "Add Question"}</h1>

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
        className="mt-5"
      >
        <div className="grid">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter Question" />
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          <Controller
            name="optionA"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter Option A" />
            )}
          />
          <Controller
            name="optionB"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                className="flex-1"
                placeholder="Enter Option B"
              />
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          <Controller
            name="optionC"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter Option C" />
            )}
          />
          <Controller
            name="optionD"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter Option D" />
            )}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mt-5">
          <Controller
            name="correctAnswer"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select Correct Answer"
                options={["A", "B", "C", "D"]}
              />
            )}
          />
          <Controller
            name="marks"
            control={control}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter Marks" />
            )}
          />
        </div>
        <Button className="py-3 px-10 mt-5" type="submit">
          {edit ? "Edit Question" : "Add Question"}
        </Button>
      </form>

      {test && test.questions.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {test?.questions.map((question, index) => (
            <div
              className="bg-white overflow-hidden rounded-lg shadow-md overflow-hidden p-4 mt-5"
              key={question.questionId}
            >
              <h1>Question {index + 1}</h1>

              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.title}
              </p>

              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.optionA}
              </p>
              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.optionB}
              </p>
              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.optionC.toString()}
              </p>
              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.optionD}
              </p>

              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.correctAnswer}
              </p>
              <p className="mt-5 w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700">
                {question.marks}
              </p>
              <Button
                className="mt-5"
                onClick={() => editQuestion(question.questionId)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TestForm;
