import { TablesDB, ID } from "appwrite";
import client from "../lib/appwrite";
import { type TestFormValues } from "../components/TestForm";
import { useState } from "react";
interface CreateTestHookArg extends Omit<TestFormValues, "thumbnail"> {
  thumbnail: string;
  userId: string;
}
const useCreateTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tablesDB = new TablesDB(client);
  const createTest = async (test: CreateTestHookArg) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tablesDB.createRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: ID.unique(),
        data: test,
      });
      return response;
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
      throw err;
    }
  };
  return { createTest, isLoading, error };
};
export default useCreateTest;
