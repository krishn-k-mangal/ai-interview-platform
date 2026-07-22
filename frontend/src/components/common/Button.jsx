function Button({
  text,

  onClick,

  color = "blue",

  disabled = false,
}) {
  const colors = {
    blue: "bg-gray-900 hover:bg-black focus:ring-black",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-600",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
    gray: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-white text-sm md:text-base font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2

        ${colors[color]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {text}
    </button>
  );
}

export default Button;
