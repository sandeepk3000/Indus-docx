import React from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  props?: React.HTMLAttributes<HTMLInputElement>;
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
  props,
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
        {...props}
        className={`w-full p-2 border focus:ring-2 outline-none focus:ring-blue-700 ${
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
