// import { useState } from "react";
// import { Account } from "appwrite";
// import { client } from "../lib/appwrite";

// export const useCreateUser = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const account = new Account(client);
//   const createUser = async (email: string, password: string, name: string) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const user = await account.create(email, password, name);
//       return user;
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
// };
import Button  from "."