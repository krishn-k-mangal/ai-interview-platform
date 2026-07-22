import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import DashboardCard from "../../components/common/DashboardCard";
import StatusBadge from "../../components/common/StatusBadge";
import PageHeader from "../../components/common/PageHeader";
import MatchProgress from "../../components/candidate/MatchProgress";
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
    API.get(`/jobs/job-applicants/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
  const shortlisted = applicants.filter((a) => a.status === "shortlisted").length;
  const pending = applicants.filter((a) => a.status === "pending").length;

  const updateStatus = async (applicationId, status) => {
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
    <RecruiterLayout>
      <PageHeader
        title="Job Applicants"
        subtitle="Manage applicants for this job"
      >
        <button
          onClick={exportPDF}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
        >
          Export PDF
        </button>
      </PageHeader>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Applicants" value={totalApplicants} color="blue" />
        <DashboardCard title="Shortlisted" value={shortlisted} color="green" />
        <DashboardCard title="Pending" value={pending} color="purple" />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interview">Interview</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      {applicants.length === 0 ? (
        <EmptyState text="No applicants yet" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplicants.map((a, index) => (
                  <tr
                    key={a.application_id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition duration-100"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{a.name}</span>
                        {index === 0 && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                            Top Match
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">{a.email}</td>
                    <td className="p-4 text-sm text-gray-700">{a.resume_score}</td>
                    <td className="p-4 text-sm text-gray-700">{a.test_score}</td>
                    <td className="p-4 min-w-[180px]">
                      <MatchProgress score={a.match_score} />
                      <div className="mt-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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
                      <div className="space-y-2">
                        <StatusBadge status={a.status} />
                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateStatus(a.application_id, e.target.value)
                          }
                          className="block w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                        >
                          <option value="applied">Applied</option>
                          <option value="screening">Screening</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview_scheduled">Interview Scheduled</option>
                          <option value="technical_round">Technical Round</option>
                          <option value="hr_round">HR Round</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <Link to={`/candidate-details/${a.application_id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm">
                          View Profile
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}

export default JobApplicants;
