import { useEffect, useState } from "react";
import CandidateSidebar from "../components/CandidateSidebar";
import { toast } from "react-hot-toast";

import API from "../api";

function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const token = localStorage.getItem("token");

  // fetch all jobs
  useEffect(() => {
    API.get("/jobs/all-jobs")

      .then((res) => {
        setJobs(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    API.get(
      "/jobs/my-applications",

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        const appliedJobIds = res.data.map((a) => a.job_id);

        setAppliedJobs(appliedJobIds);
      });
  }, [token]);

  // apply function
  const applyJob = async (jobId) => {
    try {
      const res = await API.post(
        `/jobs/apply/${jobId}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.error) {
        toast.error(res.data.error);

        return;
      }

      toast.success(res.data.message);

      setAppliedJobs([...appliedJobs, jobId]);
    } catch (err) {
      console.log(err);

      toast.error("Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CandidateSidebar />
      {/* 🔥 Navbar */}
      <div className="ml-64 w-full p-10">
        <h1 className="text-4xl font-bold mb-10">Available Jobs 🚀</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold">{job.title}</h2>

              <p className="text-gray-600 mt-2">{job.location}</p>

              <p className="mt-4">
                <span className="font-semibold">Skills:</span>{" "}
                {job.required_skills}
              </p>

              <p className="mt-2">
                <span className="font-semibold">Experience:</span>{" "}
                {job.experience}
              </p>

              <p className="mt-2">
                <span className="font-semibold">Salary:</span> {job.salary}
              </p>

              <button
                disabled={appliedJobs.includes(job.id)}
                onClick={() => applyJob(job.id)}
                className={`px-5 py-2 rounded mt-5 text-white ${
                  appliedJobs.includes(job.id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateJobs;
