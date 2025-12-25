import React from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const Input = ({
  type,
  placeholder,
  value,
  onChange,
  className,
  leftIcon,
  rightIcon,
}: InputProps) => {
  return (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
          leftIcon ? "pl-10" : rightIcon ? "pr-10" : ""
        }`}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;
