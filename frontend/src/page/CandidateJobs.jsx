import { useEffect, useState } from "react";

import API from "../api";

function CandidateJobs() {

  const [jobs, setJobs] = useState([]);

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

  // apply function
  const applyJob = async (jobId) => {

    try {

      await API.post(

        `/jobs/apply/${jobId}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Applied successfully ✅");

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-10">

        Available Jobs 🚀

      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {
          jobs.map((job) => (

            <div
              key={job.id}
              className="bg-white rounded-xl shadow p-6"
            >

              <h2 className="text-2xl font-bold">

                {job.title}

              </h2>

              <p className="text-gray-600 mt-2">

                {job.location}

              </p>

              <p className="mt-4">

                <span className="font-semibold">

                  Skills:

                </span>

                {" "}

                {job.required_skills}

              </p>

              <p className="mt-2">

                <span className="font-semibold">

                  Experience:

                </span>

                {" "}

                {job.experience}

              </p>

              <p className="mt-2">

                <span className="font-semibold">

                  Salary:

                </span>

                {" "}

                {job.salary}

              </p>

              <button

                onClick={() => applyJob(job.id)}

                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded mt-5"
              >

                Apply

              </button>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default CandidateJobs;