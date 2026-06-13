import { useEffect, useState } from "react";

import API from "../api";
import CandidateSidebar from "./CandidateSidebar";

function CandidateApplications() {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const stages = [
    "applied",
    "screening",
    "shortlisted",
    "interview_scheduled",
    "technical_round",
    "hr_round",
    "selected",
  ];

  const getStageIndex = (status) => {
    return stages.indexOf(status);
  };
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

                <div className="mt-6">
                  <h3 className="font-bold mb-4">Application Timeline</h3>

                  <div className="flex flex-wrap gap-3">
                    {stages.map((stage, index) => (
                      <div
                        key={stage}
                        className={`px-4 py-2 rounded-full text-sm font-medium

        ${
          index <= getStageIndex(app.status)
            ? "bg-green-500 text-white"
            : "bg-gray-200 text-gray-600"
        }`}
                      >
                        {stage.replaceAll("_", " ")}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-2">
                  <span className="font-semibold">Matched Skills:</span>{" "}
                  {app.matched_skills || "None"}
                </p>

                <p className="mt-2 text-red-500">
                  <span className="font-semibold">Missing Skills:</span>{" "}
                  {app.missing_skills || "None"}
                </p>
                {app.status === "interview_scheduled" && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="text-xl font-bold text-green-700 mb-3">
                      Interview Scheduled 🎯
                    </h3>

                    <p>
                      <span className="font-semibold">Mode:</span>{" "}
                      {app.interview_mode}
                    </p>

                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {app.interview_date}
                    </p>

                    <p>
                      <span className="font-semibold">Time:</span>{" "}
                      {app.interview_time}
                    </p>

                    <p className="mt-2">
                      <span className="font-semibold">Notes:</span>{" "}
                      {app.interview_notes || "No notes"}
                    </p>

                    {app.meeting_link && (
                      <a
                        href={app.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                      >
                        Join Interview
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateApplications;
