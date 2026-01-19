import client from "../lib/appwrite";
import { TablesDB, ID } from "appwrite";
import { type Models } from "appwrite";
import { type Test, type TestDoc } from "../../types";
const useTest = () => {
  const database = new TablesDB(client);
  const getTest = async (): Promise<Models.RowList<TestDoc>> => {
    try {
      const res = await database.listRows<TestDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
      });
      return res;
    } catch (error: unknown) {
      throw error;
    }
  };
  const getSingleTest = async (testId: string): Promise<TestDoc> => {
    console.log("getSingleTest-------");
    try {
      const res = await database.getRow<TestDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: testId,
      });
      return res;
    } catch (error: unknown) {
      throw error;
    }
  };
  const createTest = async (test: Test): Promise<TestDoc> => {
    try {
      const response = await database.createRow<TestDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: ID.unique(),
        data: test,
      });
      return response;
    } catch (err: unknown) {
      // console.log(err.message);

      throw err;
    }
  };
  const updateTest = async (test: Test): Promise<TestDoc> => {
    try {
      console.log("updateTest-------");
      console.log(test);
      const { $id, ...other } = test;
      const response = await database.updateRow<TestDoc>({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: $id,
        data: other,
      });
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  return { getTest, getSingleTest, createTest, updateTest };
};
export default useTest;
