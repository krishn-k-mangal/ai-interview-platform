import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api";

import RecruiterSidebar from "./RecruiterSidebar";

import Loader from "./Loader";

import MatchProgress from "./MatchProgress";

import SkillBadge from "./SkillBadge";

import StatusBadge from "./StatusBadge";

function CandidateDetails() {
  const token = localStorage.getItem("token");
  // console.log("TOKEN:", token);

  const [candidate, setCandidate] = useState(null);

  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");

  const { applicationId } = useParams();

  // fetch candidate
  useEffect(() => {
    API.get(
      `/recruiter/application/${applicationId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

      .then((res) => {
        setCandidate(res.data);

        setNotes(res.data.recruiter_notes || "");

        console.log("Response Data:", res.data);

        setLoading(false);
      })

      .catch((err) => {
        console.log("FULL ERROR:", err);

        console.log("SERVER RESPONSE:", err?.response?.data);

        console.log("STATUS:", err?.response?.status);

        setLoading(false);
      });
  }, []);

  // loading
  if (loading) {
    return <Loader text="Loading candidate..." />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left */}
            <div>
              <h1 className="text-4xl font-bold">{candidate?.name}</h1>
              <p className="text-gray-500 mt-2">{candidate?.email}</p>
              <div className="mt-4">
                <StatusBadge status={candidate?.status} />
              </div>
            </div>

            {/* Right */}
            <div className="w-full md:w-72">
              <MatchProgress score={candidate?.match_score || 0} />
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">AI Summary 🤖</h2>

          <p className="text-gray-700 leading-7">{candidate?.ai_summary}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">AI Resume Summary 🤖</h2>

          <p className="text-gray-700 leading-7">{candidate?.ai_summary}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">AI Recommendation 🎯</h2>

          <div className="inline-block bg-blue-100 text-blue-700 px-5 py-3 rounded-full font-semibold">
            {candidate?.recommendation}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recruiter Notes 📝</h2>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            placeholder="Write recruiter notes..."
            className="w-full border rounded-xl p-4"
          />

          <button
            onClick={async () => {
              try {
                await API.put(
                  `/jobs/update-notes/${applicationId}`,

                  {
                    notes: notes,
                  },

                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                alert("Notes saved successfully ✅");
              } catch (err) {
                console.log(err);
              }
            }}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Save Notes
          </button>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Matched Skills */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-green-600 mb-4">
              Matched Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {candidate?.matched_skills

                ?.split(",")

                .filter(Boolean)

                .map((skill, index) => (
                  <SkillBadge key={index} text={skill.trim()} color="green" />
                ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Missing Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {candidate?.missing_skills

                ?.split(",")

                .filter(Boolean)

                .map((skill, index) => (
                  <SkillBadge key={index} text={skill.trim()} color="red" />
                ))}
            </div>
          </div>

          {/* Extra Skills */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Extra Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {candidate?.extra_skills

                ?.split(",")

                .filter(Boolean)

                .map((skill, index) => (
                  <SkillBadge key={index} text={skill.trim()} color="blue" />
                ))}
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Resume Score */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Resume Score</h3>

            <p className="text-5xl font-bold text-blue-600">
              {candidate?.resume_score || 0}
            </p>
          </div>

          {/* Test Score */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-xl font-bold mb-4">Test Score</h3>

            <p className="text-5xl font-bold text-green-600">
              {candidate?.test_score || 0}
            </p>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Resume</h2>

          <button
            onClick={async () => {
              try {
                const response = await API.get(
                  `/recruiter/resume/${candidate?.candidate_id}`,

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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            View Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetails;
