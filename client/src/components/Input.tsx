import React from "react";
interface InputProps {
  type: string;
  placeholder: string;
  value: string;
   className?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({ type, placeholder, value, onChange }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    />
  );
};

export default Input;
