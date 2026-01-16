import client from "../lib/appwrite";
import { TablesDB } from "appwrite";
const useGetTest = () => {
  const database = new TablesDB(client);
  const getTest = async () => {
    try {
      console.log("getTest-------");
      const res = await database.listRows("695e2dcc002e7344aebe", "test");
      console.log(res);
      return res;
    } catch (error) {
      console.log("error");
      throw error;
    }
  };
  const getSingleTest = async (testId: string) => {
    console.log("getSingleTest-------");
    try {
      const res = await database.getRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: testId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };
  return { getTest, getSingleTest };
};
export default useGetTest;
