import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api";

import { Link, useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import CandidateSidebar from "./CandidateSidebar";
function CandidateDashboard() {
  const [profile, setProfile] = useState(null);

  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // 🔥 Fetch profile
  useEffect(() => {
    API.get("/candidate/my-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 🔥 Upload Resume
  const handleUpload = async () => {
    if (!file) {
      toast.error("Select a file first ❌");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {
      await API.post(
        "/candidate/upload-resume",
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.error("Resume uploaded successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);

      toast.error("Upload failed");
    }
  };

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CandidateSidebar />
      {/* 🔥 Navbar */}
      <div className="ml-64 w-full p-10">
        <nav className="bg-white shadow px-10 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            AI Hiring Platform
          </h1>
        </nav>

        {/* 🔥 Main */}
        <div className="p-10">
          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold">Candidate Dashboard 🚀</h2>

            <p className="text-gray-600 mt-2">
              Track your progress and interview performance
            </p>
          </div>
          <Link to="/my-applications">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded">
              My Applications
            </button>
          </Link>

          {/* 🔥 Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <DashboardCard
              title="Resume Score"
              value={profile?.resume_score || 0}
              color="blue"
            />

            <DashboardCard
              title="Test Score"
              value={profile?.test_score || 0}
              color="green"
            />

            <DashboardCard
              title="Final Score"
              value={profile?.final_score || 0}
              color="purple"
            />
          </div>

          {/* 🔥 Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-2xl font-bold mb-5">Upload Resume 📄</h2>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-5"
              />

              <br />

              <button
                onClick={handleUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
              >
                Upload Resume
              </button>
            </div>

            {/* Test Section */}
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-2xl font-bold mb-5">Aptitude Test 🧠</h2>

              <p className="text-gray-600 mb-6">
                Complete your aptitude test to improve your hiring score.
              </p>

              <Link to="/test">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded">
                  Start Test
                </button>
              </Link>
            </div>
            <Link to="/candidate-jobs">
              <button className="bg-purple-500 text-white px-6 py-3 rounded">
                Browse Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
