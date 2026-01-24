import React from "react";
interface SpinnerButtonProps{
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset"
}

const SpinnerButton = ({
  loading = false,
  children,
  onClick,
  className = "",
  type = "button",
}:SpinnerButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center gap-2
        px-4 py-2 rounded-lg font-medium
        bg-blue-600 text-white
        hover:bg-blue-700
        disabled:opacity-60 disabled:cursor-not-allowed
        transition
        ${className}`}
    >
      {loading && (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}

      <span>{loading ? "Please wait..." : children}</span>
    </button>
  );
};

export default SpinnerButton;
