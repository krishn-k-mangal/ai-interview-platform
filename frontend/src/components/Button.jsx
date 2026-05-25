function Button({
  text,

  onClick,

  color = "blue",

  disabled = false,
}) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",

    green: "bg-green-500 hover:bg-green-600",

    red: "bg-red-500 hover:bg-red-600",

    gray: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`

        px-5 py-3 rounded-lg text-white font-semibold

        ${colors[color]}

        ${disabled ? "opacity-50 cursor-not-allowed" : ""}

      `}
    >
      {text}
    </button>
  );
}

export default Button;
