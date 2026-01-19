import { useState } from "react";
import { TablesDB, ID, Query } from "appwrite";
import client from "../lib/appwrite";
import { type IFormInput } from "../components/QuestionForm";
import { type Result } from "../components/pages/Quiz";

interface UpdateResultHookArg {
  $id: string;
}
const useResult = () => {
  const database = new TablesDB(client);
  const createResult = async (result: Result) => {
    try {
      const response = await database.createRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        rowId: ID.unique(),
        data: {
          ...result,
          checkedAnswers: [JSON.stringify(result.checkedAnswers)],
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const updateResult = async (result: UpdateResultHookArg) => {
    try {
      const { $id, ...other } = result;
      const response = await database.updateRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        rowId: result.$id,
        data: other,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const getResults = async (resultId: string) => {
    try {
      const response = await database.getRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        rowId: resultId,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  return { createResult, updateResult, getResults };
};
export default useResult;
