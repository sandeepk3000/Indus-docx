import React from "react";
interface SelectProps {
  options: string[];
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const Select = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps) => {
  return (
    <select
      onChange={onChange}
      value={value}
      className={`w-full p-2 border  focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
