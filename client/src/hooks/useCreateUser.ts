import { useState } from "react";
import { Account } from "appwrite"
import { client } from "../lib/appwrite";

export const useCreateUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = 
  const [email, setEmail] = useState("");

  return {
    username,
    password,
    email,
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleSubmit,
    createUser,
    isLoading,
    isError,
    error,
    isSuccess,
  };
};