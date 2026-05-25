function Loader({ text = "Loading..." }) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold text-gray-600">{text}</h1>
    </div>
  );
}

export default Loader;
