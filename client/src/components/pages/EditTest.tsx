import React from "react";
import TestForm from "../TestForm";
import QuestionForm from "../QuestionForm";
import { useParams } from "react-router-dom";
import useTest from "../../hooks/useTest";
import { useEffect, useState } from "react";
import { type Models } from "appwrite";

const EditTest = () => {
  const { id } = useParams();
  const onTestSubmit = async (isTestCreated: boolean) => {
    if (isTestCreated) {
      if (id) {
        await fetchTest(id);
      }
    }
  };
  const { getSingleTest } = useTest();
  const [test, setTest] = useState<Models.Row | null>(null);
  const fetchTest = async (id: string) => {
    try {
      const res = await getSingleTest(id);
      if (res) {
        setTest(res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) {
      fetchTest(id);
    }
  }, [id]);
  useEffect(() => {
    console.log(test);
  }, [test]);
  return (
    <div>
      <h1>Edit Test</h1>
      {test && <TestForm test={test} onTestSubmit={onTestSubmit} />}
      <QuestionForm />
    </div>
  );
};
export default EditTest;
