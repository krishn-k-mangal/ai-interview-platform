import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../api";
import RecruiterSidebar from "../components/RecruiterSidebar";

function RecruiterAnalytics() {
  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // chart data
  const chartData = [
    {
      name: "Applied",
      value: analytics.applied || 0,
    },

    {
      name: "Screening",
      value: analytics.screening || 0,
    },

    {
      name: "Shortlisted",
      value: analytics.shortlisted || 0,
    },

    {
      name: "Interview",
      value: analytics.interview_scheduled || 0,
    },

    {
      name: "Technical",
      value: analytics.technical_round || 0,
    },

    {
      name: "HR",
      value: analytics.hr_round || 0,
    },

    {
      name: "Selected",
      value: analytics.selected || 0,
    },

    {
      name: "Rejected",
      value: analytics.rejected || 0,
    },
  ];

  // fetch analytics
  useEffect(() => {
    API.get(
      "/jobs/analytics",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setAnalytics(res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading analytics...</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-10">Recruiter Analytics 📊</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Jobs */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Total Jobs</h2>

            <p className="text-4xl font-bold mt-4 text-blue-500">
              {analytics.total_jobs || 0}
            </p>
          </div>

          {/* Total Applicants */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Total Applicants</h2>

            <p className="text-4xl font-bold mt-4 text-green-500">
              {analytics.total_applicants || 0}
            </p>
          </div>

          {/* Avg Match */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Avg Match Score</h2>

            <p className="text-4xl font-bold mt-4 text-purple-500">
              {analytics.avg_match_score || 0}%
            </p>
          </div>

          {/* Shortlisted */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Shortlisted</h2>

            <p className="text-4xl font-bold mt-4 text-yellow-500">
              {analytics.shortlisted || 0}
            </p>
          </div>

          {/* Selected */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Selected</h2>

            <p className="text-4xl font-bold mt-4 text-green-600">
              {analytics.selected || 0}
            </p>
          </div>

          {/* Rejected */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Rejected</h2>

            <p className="text-4xl font-bold mt-4 text-red-500">
              {analytics.rejected || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Applied</h2>
            <p className="text-4xl font-bold mt-4">{analytics.applied || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Screening</h2>
            <p className="text-4xl font-bold mt-4">
              {analytics.screening || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Interview Scheduled</h2>
            <p className="text-4xl font-bold mt-4">
              {analytics.interview_scheduled || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">Technical Round</h2>
            <p className="text-4xl font-bold mt-4">
              {analytics.technical_round || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">HR Round</h2>
            <p className="text-4xl font-bold mt-4">{analytics.hr_round || 0}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow mt-10">
          <h2 className="text-2xl font-bold mb-6">Hiring Analytics 📈</h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" fill="#3B82F6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RecruiterAnalytics;
