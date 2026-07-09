export default function MetricCard({ title, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${colors[color]}`}
      >
        {value}
      </div>

      <h3 className="mt-4 text-gray-500">{title}</h3>

      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
