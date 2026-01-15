import { useState } from "react";
import { Storage } from "appwrite";
import client from "../lib/appwrite";
import { ID } from "appwrite";
export const useUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log(client);
  const storage = new Storage(client);
  const upload = async (file: File) => {
    console.log(file);
    console.log(file.name);
    console.log(file.type);
    setIsLoading(true);
    setError(null);
    try {
      const response = await storage.createFile(
        "695f033f003e481ea63a",
        ID.unique(),
        file,
      );
      console.log(response);
      return response;
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return { upload, isLoading, error };
};
export default useUpload;
