import React from "react";
interface ButtonProps {
  children: React.ReactNode;
  clickHai: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  props?: React.HTMLAttributes<HTMLButtonElement>;
}
const Button = ({ children, className, clickHai, props }: ButtonProps) => {
  return (
    <button
      onClick={clickHai}
      {...props}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
