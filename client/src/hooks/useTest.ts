import client from "../lib/appwrite";
import { TablesDB, ID } from "appwrite";
import { type TestFormValues } from "../components/TestForm";
import { type IFormInput } from "../components/QuestionForm";
interface CreateTestHookArg extends Omit<TestFormValues, "thumbnail"> {
  thumbnail: string;
  userId: string;
}
interface UpdateTestHookArg extends Partial<CreateTestHookArg> {
  slug: string;
  questions?: string[];
}

const useTest = () => {
  const database = new TablesDB(client);
  const getTest = async () => {
    try {
      const res = await database.listRows({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
      });
      return res;
    } catch (error) {
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
  const createTest = async (test: CreateTestHookArg) => {
    try {
      const response = await database.createRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: ID.unique(),
        data: {
          title: test.title,

          description: test.description,

          duration: test.duration,

          thumbnail: test.thumbnail,

          status: test.status,

          access: test.access,
          userId: test.userId,
        },
      });
      return response;
    } catch (err) {
      // console.log(err.message);

      throw err;
    }
  };
  const updateTest = async (test: UpdateTestHookArg) => {
    try {
      console.log("updateTest-------");
      console.log(test);
      const { slug, ...other } = test;
      const response = await database.updateRow({
        databaseId: "695e2dcc002e7344aebe",
        tableId: "test",
        rowId: slug,
        data: other,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  return { getTest, getSingleTest, createTest, updateTest };
};
export default useTest;
