
import React from "react";

interface SpinnerButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const SpinnerButton = ({
  loading = false,
  disabled = false,
  children,
  onClick,
  className = "",
  type = "button",
}: SpinnerButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        inline-flex shrink-0 items-center justify-center gap-2
        rounded-xl px-4 py-3
        font-semibold
        transition-all duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {loading && (
        <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      <span className="whitespace-nowrap">
        {loading ? "Please wait..." : children}
      </span>
    </button>
  );
};

export default SpinnerButton;
