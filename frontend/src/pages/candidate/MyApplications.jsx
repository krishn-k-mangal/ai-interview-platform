import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

import CandidateTimeline from "../../components/candidate/CandidateTimeline";
import CandidateLayout from "../../layouts/CandidateLayout";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import SkillBadge from "../../components/candidate/SkillBadge";

function CandidateApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get("/jobs/my-applications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <Loader text="Loading your applications..." />;
  }

  const btnBase = "px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center gap-2";

  return (
    <CandidateLayout title="My Applications" breadcrumbs={[{ label: "Applications" }]}>
      <PageHeader
        title="My Applications"
        subtitle="Track the status of all your job applications in one place"
      />

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-8 md:p-12">
          <EmptyState text="You haven't applied to any jobs yet" />
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/candidate-jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Browse Open Jobs
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.application_id}
              className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden flex flex-col transition-all hover:shadow-md"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{app.job_title}</h2>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {app.location}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Resume</p>
                    <p className="text-lg font-bold text-blue-600">{app.resume_score}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Match</p>
                    <p className="text-lg font-bold text-green-600">{Number(app.match_score).toFixed(0)}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Test</p>
                    <p className="text-lg font-bold text-yellow-600">{app.test_completed ? `${Number(app.test_score || 0).toFixed(1)}%` : "--"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Final</p>
                    <p className="text-lg font-bold text-purple-600">{app.test_completed ? `${Number(app.final_score || 0).toFixed(1)}%` : "--"}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Application Timeline</h3>
                  <CandidateTimeline currentStatus={app.status} />
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-green-700 uppercase block mb-2">Matched Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {app.matched_skills ? (
                        app.matched_skills.split(",").map((s, i) => <SkillBadge key={i} text={s.trim()} color="green" />)
                      ) : (
                        <span className="text-sm text-gray-400">None detected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-red-700 uppercase block mb-2">Missing Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {app.missing_skills ? (
                        app.missing_skills.split(",").map((s, i) => <SkillBadge key={i} text={s.trim()} color="red" />)
                      ) : (
                        <span className="text-sm text-gray-400">None missing</span>
                      )}
                    </div>
                  </div>
                </div>

                {app.status === "INTERVIEW_SCHEDULED" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Interview Scheduled
                        </h3>
                        <p className="text-sm text-blue-800"><span className="font-semibold">Mode:</span> {app.interview_mode}</p>
                        <p className="text-sm text-blue-800"><span className="font-semibold">Date:</span> {app.interview_date}</p>
                        <p className="text-sm text-blue-800"><span className="font-semibold">Time:</span> {app.interview_time}</p>
                        {app.interview_notes && <p className="text-sm text-blue-800 mt-1"><span className="font-semibold">Notes:</span> {app.interview_notes}</p>}
                      </div>
                      {app.meeting_link && (
                        <a
                          href={app.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap shadow-sm"
                        >
                          Join Link
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-3">
                {app.interview_kit_generated ? (
                  <button
                    onClick={() => navigate(`/candidate/interview-kit/${app.application_id}`)}
                    className={`${btnBase} bg-white border border-gray-200 text-gray-700 hover:bg-gray-100`}
                  >
                    Interview Kit
                  </button>
                ) : (
                  <button disabled className={`${btnBase} bg-gray-100 text-gray-400 cursor-not-allowed`}>
                    Kit Not Ready
                  </button>
                )}

                <button
                  onClick={() => navigate(`/candidate/ai-chat/${app.application_id}`)}
                  className={`${btnBase} bg-purple-600 text-white hover:bg-purple-700`}
                >
                  AI Assistant
                </button>

                {app.status === "REJECTED" ? (
                  <button disabled className={`${btnBase} bg-red-50 text-red-400 border border-red-100 cursor-not-allowed md:col-span-1 col-span-2`}>
                    Rejected
                  </button>
                ) : app.test_completed ? (
                  <button
                    onClick={() => navigate(`/test-result/${app.application_id}`)}
                    className={`${btnBase} bg-green-600 text-white hover:bg-green-700 md:col-span-1 col-span-2`}
                  >
                    View Result
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/test/${app.application_id}`)}
                    className={`${btnBase} bg-blue-600 text-white hover:bg-blue-700 md:col-span-1 col-span-2`}
                  >
                    Take Test
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CandidateLayout>
  );
}

export default CandidateApplications;
