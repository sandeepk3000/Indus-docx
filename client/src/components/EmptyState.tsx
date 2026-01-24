interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Found",
  description = "There is no data available to display right now.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-gray-50 p-10 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
        📭
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
