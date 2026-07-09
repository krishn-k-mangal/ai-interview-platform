import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function CandidateInterviewKit() {
  const { applicationId } = useParams();

  const [kit, setKit] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const res = await API.get(
          `/ai/candidate/interview-kit/${applicationId}`,
        );
        console.log("Application ID:", applicationId);

        setKit(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKit();
  }, [applicationId]);

  if (loading) return <h2>Loading...</h2>;

  if (!kit) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Interview Kit Not Available</h2>

        <p className="mt-3 text-gray-600">
          Your recruiter hasn't generated your interview kit yet.
        </p>

        <p className="text-gray-500 mt-2">Please check again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Interview Kit</h1>

      <h2 className="font-semibold">Candidate Summary</h2>

      <p>{kit.candidate_summary}</p>

      <hr className="my-6" />

      <h2 className="font-semibold">Strengths</h2>

      <ul>
        {kit.strengths.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      <hr className="my-6" />

      <h2 className="font-semibold">Weaknesses</h2>

      <ul>
        {kit.weaknesses.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      <hr className="my-6" />

      <h2 className="font-semibold">Interview Questions</h2>

      {kit.questions.map((q, index) => (
        <div key={index} className="border p-3 rounded mt-3">
          <div>
            <strong>Skill:</strong> {q.skill}
          </div>

          <div>
            <strong>Difficulty:</strong> {q.difficulty}
          </div>

          <div className="mt-2">{q.question}</div>
        </div>
      ))}
    </div>
  );
}
