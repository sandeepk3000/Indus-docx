const Loading = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center bg-white justify-center absolute top-0 left-0  h-screen w-screen gap-3">
      <div className="h-10 w-10 grid place-items-center rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default Loading;
