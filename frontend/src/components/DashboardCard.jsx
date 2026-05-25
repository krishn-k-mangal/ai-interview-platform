function DashboardCard({
  title,

  value,

  color = "blue",
}) {
  const colors = {
    blue: "text-blue-500",

    green: "text-green-500",

    purple: "text-purple-500",

    red: "text-red-500",
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500 mb-2">{title}</h3>

      <h1
        className={`

        text-4xl font-bold

        ${colors[color]}

      `}
      >
        {value}
      </h1>
    </div>
  );
}

export default DashboardCard;
