import React from "react";
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}
const Container = ({ children, className, props }: ContainerProps) => {
  return (
    <div
      className={`w-full max-w-[1280px] mx-auto px-5 py-5 md:px-10  ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
