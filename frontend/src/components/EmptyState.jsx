function EmptyState({ text = "No data found" }) {
  return (
    <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
      <h1 className="text-2xl font-semibold">{text}</h1>
    </div>
  );
}

export default EmptyState;
