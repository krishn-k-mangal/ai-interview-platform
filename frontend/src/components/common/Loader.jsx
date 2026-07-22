function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 py-12">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
}

export default Loader;
