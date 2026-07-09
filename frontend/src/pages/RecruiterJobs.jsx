import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import API from "../api";

import RecruiterSidebar from "../components/RecruiterSidebar";

import Loader from "../components/Loader";

import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // fetch recruiter jobs
  useEffect(() => {
    API.get(
      "/jobs/my-jobs",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setJobs(res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  // loading
  if (loading) {
    return <Loader text="Loading jobs..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <PageHeader
          title="Recruiter Jobs 🚀"
          subtitle="Manage your created jobs and applicants"
        />

        {/* Top Action */}
        <div className="flex justify-end mb-8">
          <Link to="/add-job">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow">
              + Create New Job
            </button>
          </Link>
        </div>

        {/* Empty State */}
        {jobs.length === 0 ? (
          <EmptyState text="No jobs created yet 🚫" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >
                {/* Job Title */}
                <h2 className="text-2xl font-bold mb-3">{job.title}</h2>

                {/* Location */}
                <p className="text-gray-500 mb-2">📍 {job.location}</p>

                {/* Skills */}
                <p className="mb-2">
                  <span className="font-semibold">Skills:</span>{" "}
                  {job.required_skills}
                </p>

                {/* Experience */}
                <p className="mb-2">
                  <span className="font-semibold">Experience:</span>{" "}
                  {job.experience}
                </p>

                {/* Salary */}
                <p className="mb-6">
                  <span className="font-semibold">Salary:</span> {job.salary}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link to={`/job-applicants/${job.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg">
                      View Applicants
                    </button>
                  </Link>

                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg">
                    Edit Job
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await API.delete(
                          `/jobs/delete-job/${job.id}`,

                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          },
                        );

                        setJobs(jobs.filter((j) => j.id !== job.id));
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterJobs;
