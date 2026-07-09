import { useEffect, useState } from "react";
import API from "../api";

import CandidateTimeline from "../components/CandidateTimeline";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../components/CandidateSidebar";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";

function CandidateApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get("/jobs/my-applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader text="Loading applications..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CandidateSidebar />

      <div className="ml-64 p-10">
        <h1 className="text-4xl font-bold mb-10">My Applications 🚀</h1>

        {applications.length === 0 ? (
          <EmptyState text="No applications yet 🚫" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
                <div
                  key={app.application_id}
                  className="bg-white rounded-xl shadow p-6"
                >
                  <h2 className="text-2xl font-bold">{app.job_title}</h2>

                  <p className="text-gray-600 mt-2">📍 {app.location}</p>

                  <div className="mt-4">
                    <StatusBadge status={app.status} />
                  </div>

                  <p className="mt-2">
                    <span className="font-semibold">Match Score:</span>{" "}
                    {Number(app.match_score).toFixed(1)}%
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">Resume Score</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {app.resume_score}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">Match Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {Number(app.match_score).toFixed(1)}%
                      </p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">Test Score</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {app.test_completed ? app.test_score : "--"}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-gray-500">Final Score</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {app.test_completed ? app.final_score : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold mb-4">Application Timeline</h3>

                    <CandidateTimeline currentStatus={app.status} />
                  </div>

                  <p className="mt-6">
                    <span className="font-semibold">Matched Skills:</span>{" "}
                    {app.matched_skills || "None"}
                  </p>

                  <p className="mt-2 text-red-500">
                    <span className="font-semibold">Missing Skills:</span>{" "}
                    {app.missing_skills || "None"}
                  </p>

                  {app.status === "INTERVIEW_SCHEDULED" && (
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
                  <div className="flex flex-wrap gap-3 mt-5">
                    {app.interview_kit_generated ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/candidate/interview-kit/${app.application_id}`,
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        📄 View Interview Kit
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded cursor-not-allowed"
                      >
                        ⏳ Interview Kit Not Ready
                      </button>
                    )}
                    <button
                      onClick={() =>
                        navigate(`/candidate/ai-chat/${app.application_id}`)
                      }
                      className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    >
                      🤖 AI Assistant
                    </button>

                    {app.status === "REJECTED" ? (
                      <button
                        disabled
                        className="bg-red-200 text-red-700 px-4 py-2 rounded cursor-not-allowed"
                      >
                        ❌ Application Rejected
                      </button>
                    ) : app.test_completed ? (
                      <Button
                        text="📊 View Result"
                        color="green"
                        onClick={() =>
                          navigate(`/test-result/${app.application_id}`)
                        }
                      />
                    ) : (
                      <Button
                        text="📝 Take Aptitude Test"
                        color="blue"
                        onClick={() => navigate(`/test/${app.application_id}`)}
                      />
                    )}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateApplications;
