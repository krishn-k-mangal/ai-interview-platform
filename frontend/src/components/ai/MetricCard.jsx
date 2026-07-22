export default function MetricCard({ title, value, color = "blue" }) {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6 transition-all hover:shadow-md">
      <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
      <h2 className={`text-2xl md:text-3xl font-bold mt-1 md:mt-2 ${colors[color]}`}>
        {value ?? "--"}
      </h2>
    </div>
  );
}
