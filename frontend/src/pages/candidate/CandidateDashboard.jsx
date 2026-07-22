import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import API from "../../api";
import { Link, useNavigate } from "react-router-dom";
import CandidateLayout from "../../layouts/CandidateLayout";
import DashboardCard from "../../components/common/DashboardCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import SkillBadge from "../../components/candidate/SkillBadge";

/* ──────────────────────── Inline SVG Icons ──────────────────────── */
const ResumeScoreIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const TestIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);
const AppsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);
const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const SparkleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const WarningIcon = () => (
  <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const LightbulbIcon = () => (
  <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ClipboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ───────────────── Score Ring (small circular gauge) ─────────────── */
function ScoreRing({ score, size = 48, strokeWidth = 4, color = "blue" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const colorMap = {
    blue: { stroke: "stroke-blue-500", text: "text-blue-600" },
    green: { stroke: "stroke-green-500", text: "text-green-600" },
    purple: { stroke: "stroke-purple-500", text: "text-purple-600" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          className={c.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span className={`absolute text-xs font-bold ${c.text}`}>{Math.round(score)}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                        MAIN DASHBOARD                             */
/* ═══════════════════════════════════════════════════════════════════ */

function CandidateDashboard() {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/candidate/my-profile");
      if (res.data && !res.data.message) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await API.post("/candidate/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeAnalysis(res.data);
      await fetchProfile();
      toast.success("Resume uploaded successfully");
      setFile(null);
      setShowUploader(false);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  const hasResume = !!(profile?.resume_file);
  const hasAI = !!(profile?.ai_summary);
  const resumeScore = profile?.resume_score || 0;
  const testScore = profile?.latest_test_score || profile?.test_score || 0;
  const qualityScore = profile?.resume_quality_score || 0;

  /* ────────── Quick Action items ────────── */
  const quickActions = [
    {
      title: "Browse Jobs",
      desc: "Explore open positions",
      icon: <BriefcaseIcon />,
      path: "/candidate-jobs",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "My Applications",
      desc: "Track your submissions",
      icon: <ClipboardIcon />,
      path: "/my-applications",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "My Profile",
      desc: "Update your info",
      icon: <UserIcon />,
      path: "/candidate-profile",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Take Assessment",
      desc: "Complete skill tests",
      icon: <ChatIcon />,
      path: "/my-applications",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <CandidateLayout title="Dashboard" breadcrumbs={[{ label: "Overview" }]}>
      <PageHeader
        title="Candidate Dashboard"
        subtitle="Track your progress and manage your applications"
      >
        <Link to="/candidate-jobs">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm">
            Browse New Jobs
          </button>
        </Link>
      </PageHeader>

      {/* ═══════ Stat Cards ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <DashboardCard
          title="Resume Score"
          value={`${resumeScore}%`}
          color="blue"
          icon={<ResumeScoreIcon />}
          description="Based on skills & quality analysis"
          progress={resumeScore}
        />

        <DashboardCard
          title="Active Applications"
          value={profile?.active_applications_count?.toString() || "0"}
          color="purple"
          icon={<AppsIcon />}
          description={profile?.active_applications_count > 0 ? `${profile.active_applications_count} applications submitted` : "No applications yet"}
        />
      </div>

      {/* ═══════ Main Content Grid ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ─── Left Column (2/5) ─── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Resume Card (conditional) */}
          {hasResume && !showUploader ? (
            /* ── Resume Information Card ── */
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileIcon />
                  </span>
                  Resume Information
                </h2>
                <ScoreRing score={qualityScore} size={42} color="blue" />
              </div>
              <div className="p-5 space-y-4">
                {/* Filename */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <FileIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile.resume_file?.replace(/^\d+_/, '') || "resume.pdf"}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                      <CalendarIcon />
                      <span>
                        {profile.resume_date
                          ? new Date(profile.resume_date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                          : "Unknown date"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quality Score Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-500">Resume Quality</span>
                    <span className="text-xs font-bold text-blue-600">{qualityScore}%</span>
                  </div>
                  <div className="w-full bg-blue-50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${qualityScore}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      setShowUploader(true);
                      setFile(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    <RefreshIcon />
                    Replace Resume
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Upload Resume Card ── */
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UploadIcon />
                  </span>
                  {hasResume ? "Replace Resume" : "Upload Resume"}
                </h2>
                {hasResume && showUploader && (
                  <button
                    onClick={() => setShowUploader(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <div className="p-5">
                <div
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-3">
                    <UploadIcon />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {file ? file.name : "Drop your resume or click to browse"}
                  </p>
                  <p className="text-xs text-gray-400">PDF format, max 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`w-full mt-4 py-2.5 rounded-lg text-sm font-medium text-white transition flex items-center justify-center gap-2 ${!file || uploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-sm"
                    }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing…
                    </>
                  ) : (
                    "Upload & Analyze"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── Quick Actions ─── */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <Link
                  key={a.title}
                  to={a.path}
                  className="group flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                >
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                    {a.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.desc}</p>
                  </div>
                  <ArrowRightIcon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Column (3/5): AI Resume Summary ─── */}
        <div className="lg:col-span-3">
          {hasAI ? (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center">
                    <SparkleIcon />
                  </span>
                  AI Resume Summary
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Quality</span>
                  <ScoreRing score={qualityScore} size={38} color="purple" />
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{profile.ai_summary}</p>
                </div>

                {/* Strengths */}
                {profile.ai_strengths?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <CheckCircleIcon />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {profile.ai_strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {profile.ai_weaknesses?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <WarningIcon />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {profile.ai_weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {profile.ai_suggestions?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <LightbulbIcon />
                      Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {profile.ai_suggestions.map((sg, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          {sg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detected Skills */}
                {profile.skills && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Detected Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.split(",").filter(Boolean).map((skill) => (
                        <SkillBadge key={skill.trim()} text={skill.trim()} color="blue" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-8 flex flex-col items-center text-center h-full min-h-[280px] justify-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <SparkleIcon />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">AI Resume Analysis</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                Upload your resume to receive instant AI-powered feedback on your strengths, areas for improvement, and actionable suggestions.
              </p>
            </div>
          )}

          {/* ── Fresh Upload Analysis Results (just-uploaded, before refresh) ── */}
          {resumeAnalysis && (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden mt-6">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Latest Upload Results</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Skill Score</p>
                    <p className="text-2xl font-bold text-blue-900">{resumeAnalysis.skill_score}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-1">Quality Score</p>
                    <p className="text-2xl font-bold text-purple-900">{resumeAnalysis.resume_quality_score}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Detected Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeAnalysis.skills?.map((skill) => (
                      <SkillBadge key={skill} text={skill} color="blue" />
                    ))}
                    {(!resumeAnalysis.skills || resumeAnalysis.skills.length === 0) && (
                      <p className="text-sm text-gray-500">No skills detected.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
}

export default CandidateDashboard;
