import Input from "./Input";
import Select from "./Select";
import { useState } from "react";
import Button from "./Button";

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
interface IFormInput {
  title: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks: string;
}
interface Test {
  testId: string;
  title: string;
  questions: IFormInput[];
}
const TestForm = () => {
  //if test is already in local storage then set it to test state  for ts

  const [test, setTest] = useState<Test>();
  const storedTest = localStorage.getItem("test:sandee@2004");
  if (storedTest) {
    const testData = JSON.parse(storedTest);
  }

  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      title: "sdfsdf",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      marks: "0",
    },
  });
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setTest((prev) => {
      return {
        ...prev,
        questions: [...prev?.questions, data],
      };
    });
    localStorage.setItem("test:sandee@2004", JSON.stringify(data));
  };
  const handleEdit = () => {
    console.log("Edit");
  };
  return (
    <>
      <h1>Make Test</h1>
      {test && (
        <div>
          <Button onClick={handleEdit}>Edit</Button>
          {test?.questions?.map((question, index) => (
            <>
              <Input key={index} type="text" value={question.title} />
              <Input key={index} type="text" value={question.optionA} />
              <Input key={index} type="text" value={question.optionB} />
              <Input key={index} type="text" value={question.optionC} />
              <Input key={index} type="text" value={question.optionD} />
              <Input key={index} type="text" value={question.correctAnswer} />
              <Input key={index} type="text" value={question.marks} />
            </>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} type="text" placeholder="Enter Question" />
          )}
        />
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
            <Input {...field} type="text" placeholder="Enter Option B" />
          )}
        />
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
        <Controller
          name="correctAnswer"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value="Select Correct Answer"
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
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default TestForm;
