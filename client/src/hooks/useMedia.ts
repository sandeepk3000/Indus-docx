// import { useState } from "react";
import { Storage } from "appwrite";
import client from "../lib/appwrite";
import { ID } from "appwrite";
export const useUpload = () => {
  const storage = new Storage(client);
  const upload = async (file: File) => {
    try {
      if (!file) {
        throw new Error("File is required");
      }
      const response = await storage.createFile(
        "695f033f003e481ea63a",
        ID.unique(),
        file,
      );

      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  const getFileView = (fileId: string) => {
    try {
      if (!fileId) {
        throw new Error("File id is required");
      }
      const url = storage.getFileView({
        bucketId: "695f033f003e481ea63a",
        fileId: fileId,
      });
      return url;
    } catch (err: unknown) {
      console.log(err);
      throw err;
    }
  };
  const deleteFile = async (fileId: string) => {
    try {
      if (!fileId) {
        throw new Error("File id is required");
      }
      console.log(fileId);
      const response = await storage.deleteFile({
        bucketId: "695f033f003e481ea63a",
        fileId: fileId,
      });
      console.log("delete file");
      console.log(response);
      return response;
    } catch (err: unknown) {
      throw err;
    }
  };
  return { upload, getFileView, deleteFile };
};
export default useUpload;
