import React from "react";
interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  props?: React.HTMLAttributes<HTMLButtonElement>;
}
const Button = ({ children, className, onClick, props}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={` hover:bg-primary text-white font-bold focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
