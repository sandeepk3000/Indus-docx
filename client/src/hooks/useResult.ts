import { TablesDB, type Models } from "appwrite";
import client from "../lib/appwrite";

import type { ResultDoc, Result } from "../../types";
const useResult = () => {
  const database = new TablesDB(client);
  const createResult = async (result: Result): Promise<ResultDoc> => {
    try {
      const { $id, ...other } = result;
      const response = await database.createRow<ResultDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        rowId: $id,
        data: other,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const updateResult = async (result: Result): Promise<ResultDoc> => {
    try {
      const { $id, ...other } = result;
      const response = await database.updateRow<ResultDoc>({
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
  const getResult = async (resultId: string): Promise<ResultDoc> => {
    try {
      const response = await database.getRow<ResultDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        rowId: resultId,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const getResults = async (
    query: string[],
  ): Promise<Models.RowList<ResultDoc>> => {
    console.log(query);
    try {
      const response = await database.listRows<ResultDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "result",
        queries: query,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  return { createResult, updateResult, getResult, getResults };
};
export default useResult;
