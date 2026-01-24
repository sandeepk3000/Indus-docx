import React from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  accept?: string;
  value?: string | number;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  type,
  placeholder,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}: InputProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 transition-colors peer-focus:text-blue-600">
          {leftIcon}
        </div>
      )}

      <input
        type={type}
        placeholder={placeholder}
        {...props}
        className={`
          peer
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-2.5
          text-sm
          text-gray-900
          shadow-sm
          transition-all
          duration-200
          placeholder:text-gray-400
          focus:border-blue-600
          focus:ring-2
          focus:ring-blue-600/20
          focus:shadow-md
          ${
            leftIcon ? "pl-10" : ""
          }
          ${
            rightIcon ? "pr-10" : ""
          }
        `}
      />

      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors peer-focus:text-blue-600">
          {rightIcon}
        </div>
      )}
    </div>
  );
};

export default Input;
