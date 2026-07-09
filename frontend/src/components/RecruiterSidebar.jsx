import { Link } from "react-router-dom";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function RecruiterSidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed p-6">
      <h1 className="text-2xl font-bold mb-10">Recruiter Panel</h1>

      <div className="flex flex-col gap-4">
        <Link to="/recruiter-dashboard">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Dashboard
          </button>
        </Link>

        <Link to="/recruiter-jobs">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            My Jobs
          </button>
        </Link>

        <Link to="/add-job">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Create Job
          </button>
        </Link>

        <Link to="/recruiter-analytics">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Analytics
          </button>
        </Link>
        <Link to="/add-question">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Add Question
          </button>
        </Link>
        <Link to="/recruiter/ai-assistant">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            🤖 AI Hiring Assistant
          </button>
        </Link>
        <Button text="Logout" color="red" onClick={handleLogout} />
      </div>
    </div>
  );
}

export default RecruiterSidebar;
