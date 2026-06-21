import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api";

import Loader from "./Loader";
import EmptyState from "./EmptyState";
import PageHeader from "./PageHeader";
import DashboardCard from "./DashboardCard";
import RecruiterSidebar from "./RecruiterSidebar";
import CandidateRow from "./CandidateRow";

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
        },
      );

      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.application_id === applicationId
            ? {
                ...candidate,
                status: newStatus,
              }
            : candidate,
        ),
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
    return <Loader />;
  }

  const totalCandidates = candidates.length;

  const shortlistedCount = candidates.filter(
    (c) => c.status === "SHORTLISTED",
  ).length;

  const rejectedCount = candidates.filter(
    (c) => c.status === "REJECTED",
  ).length;

  const appliedCount = candidates.filter((c) => c.status === "APPLIED").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RecruiterSidebar />

      <div className="ml-64 w-full p-10">
        <PageHeader
          title="Recruiter Dashboard 🚀"
          subtitle="Manage candidates"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Candidates"
            value={totalCandidates}
            color="blue"
          />

          <DashboardCard
            title="Shortlisted"
            value={shortlistedCount}
            color="green"
          />

          <DashboardCard title="Rejected" value={rejectedCount} color="red" />

          <DashboardCard title="Applied" value={appliedCount} color="purple" />
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-3 w-80"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option value="all">All</option>
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
            className="border rounded-lg p-3"
          >
            <option value="high">Highest Score</option>

            <option value="low">Lowest Score</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Resume</th>
                <th className="p-4 text-left">Test</th>
                <th className="p-4 text-left">Final</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedCandidates.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState text="No candidates found 🚫" />
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
    </div>
  );
}

export default RecruiterDashboard;
