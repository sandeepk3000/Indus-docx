import { TablesDB } from "appwrite";
import client from "../lib/appwrite";
import { type Question } from "../../types";
import { type Models } from "appwrite";
import type { QuestionDoc } from "../../types";
const useQuestion = () => {
  const database = new TablesDB(client);
  const createQuestion = async (question: Question): Promise<QuestionDoc> => {
    try {
      const { $id, ...other } = question;
      const response = await database.createRow<QuestionDoc>({
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
  const updateQuestion = async (question: Question): Promise<QuestionDoc> => {
    try {
      const { $id, ...other } = question;
      const response = await database.updateRow<QuestionDoc>({
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
  const getQuestions = async (
    query?: string[],
  ): Promise<Models.RowList<QuestionDoc>> => {
    try {
      const response = await database.listRows<QuestionDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "question",
        queries: query,
      });
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  return { createQuestion, updateQuestion, getQuestions };
};
export default useQuestion;
