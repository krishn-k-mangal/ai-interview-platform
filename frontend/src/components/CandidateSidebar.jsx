import { Link } from "react-router-dom";

function CandidateSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen fixed p-6">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10">Candidate Panel</h1>

      {/* Navigation */}
      <div className="flex flex-col gap-4">
        <Link to="/candidate-dashboard">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Dashboard
          </button>
        </Link>

        <Link to="/candidate-jobs">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Browse Jobs
          </button>
        </Link>

        <Link to="/my-applications">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            My Applications
          </button>
        </Link>

        {/* <Link to="/upload-resume">
          <button className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded">
            Upload Resume
          </button>
        </Link> */}

      

        <button
          onClick={() => {
            localStorage.clear();

            window.location.href = "/";
          }}
          className="w-full bg-red-500 hover:bg-red-600 px-4 py-3 rounded mt-10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CandidateSidebar;
