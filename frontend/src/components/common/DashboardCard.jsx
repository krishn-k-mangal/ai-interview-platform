function DashboardCard({ title, value, color = "blue", icon, description, progress }) {
  const colorMap = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      progressBg: "bg-blue-100",
      progressFill: "bg-blue-500",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      progressBg: "bg-green-100",
      progressFill: "bg-green-500",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
    },
    purple: {
      text: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      progressBg: "bg-purple-100",
      progressFill: "bg-purple-500",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      progressBg: "bg-red-100",
      progressFill: "bg-red-500",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 transition-all hover:shadow-md group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        {icon && (
          <div className={`w-11 h-11 rounded-lg ${c.iconBg} flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
            {icon}
          </div>
        )}
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <h2 className={`text-2xl md:text-3xl font-bold mt-0.5 ${c.text}`}>
            {value}
          </h2>
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      {typeof progress === "number" && (
        <div className="mt-3">
          <div className={`w-full ${c.progressBg} rounded-full h-1.5`}>
            <div
              className={`${c.progressFill} h-1.5 rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
