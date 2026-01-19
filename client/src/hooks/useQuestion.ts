import { useState } from "react";
import { TablesDB, ID, Query } from "appwrite";
import client from "../lib/appwrite";
import { type IFormInput } from "../components/QuestionForm";
interface CreateQuestionHookArg extends IFormInput {
  tests: string[];
}
interface UpdateQuestionHookArg extends IFormInput {
  tests: string[];
}
const useQuestion = () => {
  const database = new TablesDB(client);
  const createQuestion = async (question: CreateQuestionHookArg) => {
    try {
      const { $id, ...other } = question;
      const response = await database.createRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "question",
        rowId: $id,
        data: other,
      });
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  const updateQuestion = async (question: UpdateQuestionHookArg) => {
    try {
      const { $id, ...other } = question;
      const response = await database.updateRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "question",
        rowId: question.$id,
        data: other,
      });
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  const getQuestions = async (tests: string[]) => {
    try {
      const response = await database.listRows({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "question",
        queries: [Query.equal("tests", tests)],
      });
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  return { createQuestion, updateQuestion, getQuestions };
};
export default useQuestion;
