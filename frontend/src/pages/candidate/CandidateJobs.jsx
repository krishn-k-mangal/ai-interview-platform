import { useEffect, useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { toast } from "react-hot-toast";
import API from "../../api";
import PageHeader from "../../components/common/PageHeader";

function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
      const errorMsg = err.response?.data?.detail || "Failed to apply";
      toast.error(errorMsg);
    }
  };

  return (
    <CandidateLayout title="Available Positions" breadcrumbs={[{ label: "Jobs" }]}>
      <PageHeader 
        title="Available Positions" 
        subtitle="Explore and apply for open roles" 
      />
      <div className="w-full">

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs available</h3>
            <p className="text-gray-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 flex flex-col justify-between hover:shadow-md transition duration-150">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>

                  <div className="flex flex-col space-y-1.5 text-sm text-gray-500 mt-3 mb-5">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {job.location}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {job.experience}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.required_skills?.split(",").map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  disabled={appliedJobs.includes(job.id)}
                  onClick={() => applyJob(job.id)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm ${
                    appliedJobs.includes(job.id)
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}

export default CandidateJobs;
