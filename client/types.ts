import { type Models } from "appwrite";

export interface User {
  id: string;
  name: string;
  email: string;
  img?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Question extends QuestionOptions {
  $id: string;
  title: string;
  correctAnswer: string;
  marks: string;
  tests: string[];
}
export interface Result {
  $id: string;
  studentId: string;
  testId: string;
  checkedAnswers: string[];
  totalMarks: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  rank?: number;
  obtainedMarks: number;
}
export interface Test {
  $id: string;
  userId: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  status: "LIVE" | "COMPLETED" | "UPCOMING";
  access: "PUBLIC" | "PRIVATE";
}
export interface LeaderboardProps {
  name: string;
  email: string;
  img: string;
  totalMarks: number;
  totalCorrect: number;
  percentage: number;
  rank?: number;
  grade: string;
}

export interface AppwriteBase {
  $id: string;
  $sequence: number;
  $tableId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}
export interface ListRows<T> {
  rows: T[];
  total: number;
}
export type QuestionOptions{
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}
export type TestDoc = Omit<Test, "$id"> & Models.Row;
export type QuestionDoc = Omit<Question, "$id"> & Models.Row;
export type ResultDoc = Omit<Result, "$id"> & Models.Row;
// name,email,img,
