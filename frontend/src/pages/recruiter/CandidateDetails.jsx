import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api";

import RecruiterLayout from "../../layouts/RecruiterLayout";
import Loader from "../../components/common/Loader";
import MatchProgress from "../../components/candidate/MatchProgress";
import SkillBadge from "../../components/candidate/SkillBadge";
import StatusBadge from "../../components/common/StatusBadge";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";

function CandidateDetails() {
  const token = localStorage.getItem("token");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  const { applicationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/recruiter/application/${applicationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCandidate(res.data);
        setNotes(res.data.recruiter_notes || "");
        setInterviewDate(res.data.interview_date || "");
        setInterviewTime(res.data.interview_time || "");
        setMeetingLink(res.data.meeting_link || "");
        setInterviewMode(res.data.interview_mode || "");
        setInterviewNotes(res.data.interview_notes || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load candidate details");
        setLoading(false);
      });
  }, [applicationId, token]);

  const handleSaveNotes = async () => {
    try {
      await API.put(
        `/jobs/update-notes/${applicationId}`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Notes saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save notes");
    }
  };

  const handleScheduleInterview = async () => {
    try {
      await API.put(
        `/jobs/schedule-interview/${applicationId}`,
        {
          interview_date: interviewDate,
          interview_time: interviewTime,
          meeting_link: meetingLink,
          interview_mode: interviewMode,
          interview_notes: interviewNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Interview scheduled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to schedule interview");
    }
  };

  const handleViewResume = async () => {
    try {
      const response = await API.get(
        `/recruiter/resume/${candidate.candidate_id}`
      );

      window.open(response.data.resume_url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Unable to open resume.");
    }
  };

  if (loading) {
    return <Loader text="Loading candidate..." />;
  }

  const breadcrumbs = [
    { label: "Applicants", href: `/job-applicants/${candidate?.job_id}` },
    { label: candidate?.name || "Candidate" }
  ];

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm";

  return (
    <RecruiterLayout title="Candidate Details" breadcrumbs={breadcrumbs}>

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{candidate?.name}</h1>
            <p className="text-gray-500 mt-1">{candidate?.email}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <StatusBadge status={candidate?.status} />
              <button
                onClick={() => navigate(`/recruiter/candidate-analysis/${applicationId}`)}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
              >
                🧠 AI Analysis
              </button>
            </div>
          </div>
          <div className="w-full md:w-72 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <MatchProgress score={candidate?.match_score || 0} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add your private notes about this candidate here..."
              className={`${inputClass} w-full resize-none`}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* Interview Scheduler */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Interview Scheduler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className={inputClass}
              />
              <input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className={inputClass}
              />
              <select
                value={interviewMode}
                onChange={(e) => setInterviewMode(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Mode</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Phone Call">Phone Call</option>
                <option value="In-Person">In-Person</option>
              </select>
              <input
                type="text"
                placeholder="Meeting Link / Location"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className={inputClass}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Instructions for candidate..."
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              className={`${inputClass} w-full mt-4`}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleScheduleInterview}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleViewResume}
                className="w-full flex justify-center items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                View Resume
              </button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Resume Score</p>
              <p className="text-3xl font-bold text-blue-600">{candidate?.resume_score || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Quality Score</p>
              <p className="text-3xl font-bold text-purple-600">{candidate?.resume_quality_score || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Test Score</p>
              <p className="text-3xl font-bold text-green-600">{candidate?.test_score || 0}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-t-green-500">
          <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-4">Matched Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate?.matched_skills?.split(",").filter(Boolean).map((skill, index) => (
              <SkillBadge key={index} text={skill.trim()} color="green" />
            ))}
            {!candidate?.matched_skills && <span className="text-sm text-gray-400">None detected</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-t-red-500">
          <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-4">Missing Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate?.missing_skills?.split(",").filter(Boolean).map((skill, index) => (
              <SkillBadge key={index} text={skill.trim()} color="red" />
            ))}
            {!candidate?.missing_skills && <span className="text-sm text-gray-400">None missing</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 border-t-4 border-t-blue-500">
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-4">Extra Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate?.extra_skills?.split(",").filter(Boolean).map((skill, index) => (
              <SkillBadge key={index} text={skill.trim()} color="blue" />
            ))}
            {!candidate?.extra_skills && <span className="text-sm text-gray-400">None detected</span>}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default CandidateDetails;
