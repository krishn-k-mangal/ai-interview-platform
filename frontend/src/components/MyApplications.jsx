import { useEffect, useState } from "react";

import API from "../api";
import CandidateSidebar from "./CandidateSidebar";

function CandidateApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // fetch candidate applications
  useEffect(() => {
    API.get(
      "/jobs/my-applications",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setApplications(res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  // loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading applications...</h1>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-100">
       <CandidateSidebar />
      {/* 🔥 Navbar */}
      <div className="ml-64 w-full p-10">
      <h1 className="text-4xl font-bold mb-10">My Applications 🚀</h1>

      {applications.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-2xl font-semibold">No applications yet 🚫</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, index) => (
            <div
              key={app.application_id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-2xl font-bold">{app.job_title}</h2>

              <p className="text-gray-600 mt-2">📍 {app.location}</p>

              <p className="mt-4">
                <span className="font-semibold">Status:</span>{" "}
                <span className="capitalize">{app.status}</span>
              </p>

              <p className="mt-2">
                <span className="font-semibold">Match Score:</span>{" "}
                {app.match_score}%
              </p>

              <p className="mt-2">
                <span className="font-semibold">Matched Skills:</span>{" "}
                {app.matched_skills || "None"}
              </p>

              <p className="mt-2 text-red-500">
                <span className="font-semibold">Missing Skills:</span>{" "}
                {app.missing_skills || "None"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default CandidateApplications;
