import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/common/DashboardCard";
import Loader from "../../components/common/Loader";

function RecruiterAnalytics() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // chart data
  const chartData = [
    { name: "Applied", value: analytics.applied || 0 },
    { name: "Screening", value: analytics.screening || 0 },
    { name: "Shortlisted", value: analytics.shortlisted || 0 },
    { name: "Interview", value: analytics.interview_scheduled || 0 },
    { name: "Technical", value: analytics.technical_round || 0 },
    { name: "HR", value: analytics.hr_round || 0 },
    { name: "Selected", value: analytics.selected || 0 },
    { name: "Rejected", value: analytics.rejected || 0 },
  ];

  // fetch analytics
  useEffect(() => {
    API.get("/jobs/analytics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
    return <Loader text="Loading analytics..." />;
  }

  return (
    <RecruiterLayout>
      <PageHeader
        title="Analytics"
        subtitle="Overview of your recruitment pipeline"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Total Jobs" value={analytics.total_jobs || 0} color="blue" />
        <DashboardCard title="Applied" value={analytics.applied || 0} color="purple" />
        <DashboardCard title="Shortlisted" value={analytics.shortlisted || 0} color="green" />
        <DashboardCard title="Selected" value={analytics.selected || 0} color="green" />
      </div>

      {/* Pipeline Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Screening" value={analytics.screening || 0} color="blue" />
        <DashboardCard title="Interview Scheduled" value={analytics.interview_scheduled || 0} color="purple" />
        <DashboardCard title="Technical Round" value={analytics.technical_round || 0} color="blue" />
        <DashboardCard title="HR Round" value={analytics.hr_round || 0} color="purple" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Hiring Pipeline</h2>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </RecruiterLayout>
  );
}

export default RecruiterAnalytics;
