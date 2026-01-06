export interface User {
  id: string;
  name: string;
  email: string;
  img?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface LeaderboardProps {
  name: string;
  email: string;
  img: string;
  totalMarks: number;
  totalCorrect: number;
  percentage: number;
  grade: string;
}
// name,email,img,
