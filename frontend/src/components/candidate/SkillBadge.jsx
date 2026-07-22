import React from "react";

function SkillBadge({
  text,

  color = "blue",
}) {
  const colors = {
    green: "bg-green-100 text-green-700",

    red: "bg-red-100 text-red-700",

    blue: "bg-blue-100 text-blue-700",

    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${colors[color]}`}
    >
      {text}
    </span>
  );
}

export default SkillBadge;
