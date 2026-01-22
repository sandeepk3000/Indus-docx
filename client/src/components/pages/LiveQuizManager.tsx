import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import useTest from "../../hooks/useTest";
import type { TestDoc } from "../../../types";

import Quiz from "../Quiz";

const LiveQuizManager = () => {
  // query parameters  how get
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const liveCode = searchParams.get("liveCode") as string;
  const { id } = useParams();
  const { getSingleTest } = useTest();
  const [test, setTest] = useState<TestDoc | null>(null);
  const fetchTest = async (id: string) => {
    try {
      const res = await getSingleTest(id);
      if (res) {
        const isCodeExist = res.testCodes?.includes(liveCode);
        if (!isCodeExist) {
          navigate("/student/live");
          return;
        }
        setTest(res);
      }
      console.log(res);
    } catch (err: unknown) {
      navigate("/student/live");
      throw err;
    }
  };
  useEffect(() => {
    if (liveCode)
      if (id) {
        fetchTest(id);
      }
  }, [id]);
  return <div>{test && <Quiz test={test} testCode={liveCode} />}</div>;
};
export default LiveQuizManager;
