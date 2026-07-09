import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import CandidateSidebar from "../components/CandidateSidebar";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";

function TestResult() {
  const { application_id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    API.get(`/test/result/${application_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setResult(res.data);
    });
  }, []);

  if (!result) {
    return <h2 className="p-10">Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <CandidateSidebar />

      <div className="ml-64 p-10">
        <div className="bg-white rounded-xl shadow p-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">{result.job_title}</h1>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-blue-50 p-4 rounded">
              <p>Resume Score</p>
              <h2 className="text-3xl font-bold">{result.resume_score}</h2>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <p>Match Score</p>
              <h2 className="text-3xl font-bold">
                {Number(result.match_score).toFixed(1)}%
              </h2>
            </div>

            <div className="bg-yellow-50 p-4 rounded">
              <p>Test Score</p>
              <h2 className="text-3xl font-bold">{result.test_score}</h2>
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <p>Final Score</p>
              <h2 className="text-3xl font-bold">{result.final_score}</h2>
            </div>
          </div>

          <div className="mt-8">
            <div className="mt-8">
              <span
                className={`px-4 py-2 rounded-full font-semibold
      ${
        result.status === "SELECTED"
          ? "bg-green-100 text-green-700"
          : result.status === "REJECTED"
            ? "bg-red-100 text-red-700"
            : result.status === "INTERVIEW_SCHEDULED"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
      }`}
              >
                {result.status.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/my-applications")}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded"
          >
            ← Back to My Applications
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestResult;
