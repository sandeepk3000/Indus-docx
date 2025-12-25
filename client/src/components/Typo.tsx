import React from "react";
interface TypoProps {
  children: React.ReactNode;
  className?: string | undefined;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
const Typo = ({ children, className, props }: TypoProps) => {
  return (
    <div className={`text-2xl font-bold ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Typo;
