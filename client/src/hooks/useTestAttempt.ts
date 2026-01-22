import { TablesDB } from "appwrite";
import client from "../lib/appwrite";
import type { AttemptDoc, Attempt } from "../../types";
const useTestAttempt = () => {
  const database = new TablesDB(client);
  const createAttempt = async (attempt: Attempt): Promise<AttemptDoc> => {
    try {
      const { $id, ...other } = attempt;
      const response = await database.createRow<AttemptDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "attempt",
        rowId: $id,
        data: other,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const updateAttempt = async (attempt: Attempt): Promise<AttemptDoc> => {
    try {
      const { $id, ...other } = attempt;
      const response = await database.updateRow<AttemptDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "attempt",
        rowId: attempt.$id,
        data: other,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const getAttempt = async (attemptId: string): Promise<AttemptDoc> => {
    try {
      const response = await database.getRow<AttemptDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "attempt",
        rowId: attemptId,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  return { createAttempt, updateAttempt, getAttempt };
};
export default useTestAttempt;
