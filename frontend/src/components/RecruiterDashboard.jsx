import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";
import API from "../api";
import PageHeader from "./PageHeader";
import EmptyState from "./EmptyState";
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import DashboardCard from "./DashboardCard";
import RecruiterSidebar from "./RecruiterSidebar";

function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("high");

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  // 🔥 Fetch candidates
  useEffect(() => {
    API.get("/recruiter/candidates", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setCandidates(res.data);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  filteredCandidates.sort((a, b) => {
    if (sortOrder === "high") {
      return b.final_score - a.final_score;
    }

    return a.final_score - b.final_score;
  });
  if (loading) {
    return <Loader />;
  }

  const totalCandidates = candidates.length;

  const shortlistedCount = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;

  const rejectedCount = candidates.filter(
    (c) => c.status === "rejected",
  ).length;

  const appliedCount = candidates.filter((c) => c.status === "applied").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}

      <RecruiterSidebar />
      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <div className="mb-8">
          <PageHeader
            title="Recruiter Dashboard 🚀"
            subtitle="Manage candidates"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
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

        {/* Search */}
        <input
          type="text"
          placeholder="Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-3"
            >
              <option value="all">All</option>

              <option value="shortlisted">Shortlisted</option>

              <option value="rejected">Rejected</option>

              <option value="applied">Applied</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-lg p-3"
            >
              <option value="high">Highest Score</option>

              <option value="low">Lowest Score</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
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
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10">
                    {/* <EmptyState text="No candidates found 🚫" /> */}
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{c.name}</td>

                    <td className="p-4">{c.email}</td>

                    <td className="p-4">{c.resume_score}</td>

                    <td className="p-4">{c.test_score}</td>

                    <td className="p-4 font-bold text-green-600">
                      {c.final_score}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={async () => {
                          await API.put(
                            `/recruiter/update-status/${c.application_id}?status=shortlisted`,

                            {},

                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );

                          toast.success("Candidate shortlisted");

                          window.location.reload();
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={async () => {
                          await API.put(
                            `/recruiter/update-status/${c.application_id}?status=rejected`,

                            {},

                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );

                          toast.success("Candidate rejected");

                          window.location.reload();
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                      >
                        Reject
                      </button>

                      {c.application_id === 0 ? (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-3 py-2 rounded cursor-not-allowed"
                        >
                          Not Applied
                        </button>
                      ) : (
                        <Link to={`/candidate-details/${c.application_id}`}>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
                            View Details
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
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
