import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../api";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import CandidateRow from "../../components/recruiter/CandidateRow";

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("high");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/recruiter/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCandidates(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load candidates");
    }

    setLoading(false);
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await API.put(
        `/recruiter/update-status/${applicationId}?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.application_id === applicationId
            ? {
                ...candidate,
                status: newStatus,
              }
            : candidate
        )
      );

      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedCandidates = [...filteredCandidates];
  sortedCandidates.sort((a, b) => {
    if (sortOrder === "high") {
      return b.overall_score - a.overall_score;
    }
    return a.overall_score - b.overall_score;
  });

  if (loading) {
    return <Loader text="Loading candidates..." />;
  }

  const totalCandidates = candidates.length;
  const shortlistedCount = candidates.filter((c) => c.status === "SHORTLISTED").length;
  const rejectedCount = candidates.filter((c) => c.status === "REJECTED").length;
  const appliedCount = candidates.filter((c) => c.status === "APPLIED").length;

  const inputClass =
    "px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm";

  return (
    <RecruiterLayout title="Dashboard" breadcrumbs={[{ label: "Overview" }]}>
      <PageHeader
        title="Candidate Overview"
        subtitle="Manage and track all candidates across your active jobs"
      />

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Candidates" value={totalCandidates} color="blue" />
        <DashboardCard title="Shortlisted" value={shortlistedCount} color="green" />
        <DashboardCard title="Rejected" value={rejectedCount} color="red" />
        <DashboardCard title="Applied" value={appliedCount} color="purple" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} w-full md:w-80`}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="all">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="SCREENING">Screening</option>
          <option value="SHORTLISTED">Shortlisted</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="TECHNICAL_ROUND">Technical Round</option>
          <option value="HR_ROUND">HR Round</option>
          <option value="SELECTED">Selected</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="high">Highest Score</option>
          <option value="low">Lowest Score</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCandidates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-0 border-0">
                    <div className="p-12">
                      <EmptyState text="No candidates found matching your criteria" />
                    </div>
                  </td>
                </tr>
              ) : (
                sortedCandidates.map((candidate) => (
                  <CandidateRow
                    key={candidate.application_id}
                    candidate={candidate}
                    token={token}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterDashboard;
