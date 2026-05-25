import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api";

import Sidebar from "../components/Sidebar";

import DashboardCard from "../components/DashboardCard";

import Loader from "../components/Loader";

function CandidateDetails() {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(
      `/recruiter/candidate/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setCandidate(res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log(err);

        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader text="Loading candidate..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Candidate Details 🚀</h1>

          <p className="text-gray-600 mt-2">
            Detailed candidate profile and performance
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

          <div className="space-y-4">
            <p>
              <span className="font-semibold">Name:</span> {candidate?.name}
            </p>

            <p>
              <span className="font-semibold">Email:</span> {candidate?.email}
            </p>

            <p>
              <span className="font-semibold">Status:</span> {candidate?.status}
            </p>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Resume Score"
            value={candidate?.resume_score}
            color="blue"
          />

          <DashboardCard
            title="Test Score"
            value={candidate?.test_score}
            color="green"
          />

          <DashboardCard
            title="Final Score"
            value={candidate?.final_score}
            color="purple"
          />
        </div>
        <a
          href={`http://127.0.0.1:8000/recruiter/resume/${candidate.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            onClick={async () => {
                

              try {
                console.log(token);
                const response = await API.get(
                  `/recruiter/resume/${candidate.id}`,

                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },

                    responseType: "blob",
                  },
                );

                const file = new Blob([response.data], {
                  type: "application/pdf",
                });

                const fileURL = URL.createObjectURL(file);

                window.open(fileURL);
              } catch (err) {
                console.log(err);
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mt-8"
          >
            View Resume
          </button>
        </a>
      </div>
    </div>
  );
}

export default CandidateDetails;
