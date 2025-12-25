import Input from "./Input";
import Select from "./Select";
import { useState } from "react";
import Button from "./Button"

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
const TestForm = () => {
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: {
      title: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      marks: "0",
    },
  });
  const [questions, setQuestions] = useState({});
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setQuestions(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button 
          
          type="submit">Submit</Button>
      </form>
      <div>
        {questions && (
          <div>
            <h2>Questions</h2>
            <pre>{JSON.stringify(questions, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  );
};

export default TestForm;
