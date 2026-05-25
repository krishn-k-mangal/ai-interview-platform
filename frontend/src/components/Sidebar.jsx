import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-6">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10 text-blue-400">AI Hiring</h1>

      {/* Links */}
      <div className="flex flex-col gap-4">
        <Link to="/recruiter-dashboard">
          <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
            Dashboard
          </button>
        </Link>

        <Link to="/add-question">
          <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
            Add Question
          </button>
        </Link>

        <Button text="Logout" color="red" onClick={handleLogout} />
      </div>
    </div>
  );
}

export default Sidebar;
