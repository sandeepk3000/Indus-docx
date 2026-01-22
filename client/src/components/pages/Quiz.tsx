import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";

import Quiz from "../Quiz";

import { codeGenerater } from "../../utils/codeGenerater";
const QuizManager = () => {
  // query parameters  how ge
  const { id } = useParams();
  const { getSingleTest } = useTest();
  const [testCode, setTestCode] = useState<string | null>(null);
  const [test, setTest] = useState<TestDoc | null>(null);
  const fetchTest = async (id: string) => {
    try {
      const res = await getSingleTest(id);
      if (res) {
        setTest(res);
      }
      console.log(res);
    } catch (err: unknown) {
      alert("something went wrong");
      throw err;
    }
  };
  useEffect(() => {
    if (id) {
      fetchTest(id);
      const code = codeGenerater(id, "QUIZ");
      setTestCode(code);
    }
  }, [id]);
  return (
    <div>{test && testCode && <Quiz test={test} testCode={testCode} />}</div>
  );
};
export default QuizManager;
