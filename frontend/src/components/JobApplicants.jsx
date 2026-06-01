import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import API from "../api";

import RecruiterSidebar from "./RecruiterSidebar";

import Loader from "./Loader";

import EmptyState from "./EmptyState";

import DashboardCard from "./DashboardCard";

import StatusBadge from "./StatusBadge";

import SkillBadge from "./SkillBadge";

import MatchProgress from "./MatchProgress";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

function JobApplicants() {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  // fetch applicants
  useEffect(() => {
    API.get(
      `/jobs/job-applicants/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setApplicants(res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  // loading
  if (loading) {
    return <Loader text="Loading applicants..." />;
  }

  // analytics
  const totalApplicants = applicants.length;

  const shortlisted = applicants.filter(
    (a) => a.status === "shortlisted",
  ).length;

  const pending = applicants.filter((a) => a.status === "pending").length;

  const updateStatus = async (
    applicationId,

    status,
  ) => {
    try {
      await API.put(
        `/jobs/update-status/${applicationId}`,

        { status },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplicants((prev) =>
        prev.map((a) =>
          a.application_id === applicationId ? { ...a, status } : a,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Job Applicants Report", 14, 15);

    autoTable(doc, {
      startY: 25,

      head: [["Name", "Email", "Score", "Status", "Recommendation"]],

      body: filteredApplicants.map((a) => [
        a.name,

        a.email,

        a.match_score,

        a.status,

        a.recommendation,
      ]),
    });

    doc.save("applicants-report.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Recrueimport RecruiterSidebar from "./RecruiterSidebar"; */}
      <RecruiterSidebar />

      {/* Main */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Job Applicants 🚀</h1>

          <p className="text-gray-600 mt-2">Manage applicants for this job</p>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DashboardCard
            title="Total Applicants"
            value={totalApplicants}
            color="blue"
          />

          <DashboardCard
            title="Shortlisted"
            value={shortlisted}
            color="green"
          />

          <DashboardCard title="Pending" value={pending} color="purple" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}

          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-3 rounded-xl w-full md:w-80"
          />

          {/* Filter */}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-3 rounded-xl"
          >
            <option value="all">All Status</option>

            <option value="pending">Pending</option>

            <option value="shortlisted">Shortlisted</option>

            <option value="interview">Interview</option>

            <option value="selected">Selected</option>

            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={exportPDF}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
        >
          Export PDF
        </button>

        {/* Empty */}
        {applicants.length === 0 ? (
          <EmptyState text="No applicants yet 🚫" />
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Name</th>

                  <th className="p-4 text-left">Email</th>

                  <th className="p-4 text-left">Resume</th>

                  <th className="p-4 text-left">Test</th>

                  <th className="p-4 text-left">Match</th>

                  <th className="p-4 text-left">AI Analysis</th>

                  <th className="p-4 text-left">Status</th>

                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplicants.map((a, index) => (
                  <tr
                    key={a.application_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                          #{index + 1}
                        </span>

                        {a.name}
                        {index === 0 && (
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                            🥇 Top Match
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">{a.email}</td>

                    <td className="p-4">{a.resume_score}</td>

                    <td className="p-4">{a.test_score}</td>

                    <td className="p-4">
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold text-green-600">
                            Matched:
                          </span>

                          <div className="flex flex-wrap gap-2">
                            {a.matched_skills
                              ?.split(",")
                              .filter((skill) => skill.trim() !== "")}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-red-600">
                            Missing:
                          </span>

                          <p className="text-sm ">
                            {a.missing_skills || "None"}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold text-blue-600">
                            Extra:
                          </span>

                          <p className="text-sm break-words">
                            {a.extra_skills || "None"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 min-w-[220px]">
                      <MatchProgress score={a.match_score} />
                      <div className="mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            a.recommendation === "Highly Recommended"
                              ? "bg-green-100 text-green-700"
                              : a.recommendation === "Recommended"
                                ? "bg-blue-100 text-blue-700"
                                : a.recommendation === "Average Fit"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.recommendation}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-3">
                        <StatusBadge status={a.status} />

                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateStatus(a.application_id, e.target.value)
                          }
                          className="border rounded px-3 py-2"
                        >
                          <option value="pending">Pending</option>

                          <option value="shortlisted">Shortlisted</option>

                          <option value="interview">Interview</option>

                          <option value="selected">Selected</option>

                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-4">
                      <Link to={`/candidate-details/${a.application_id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                          View Profile
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicants;
