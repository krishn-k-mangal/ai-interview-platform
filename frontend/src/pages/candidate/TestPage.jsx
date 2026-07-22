import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import CandidateLayout from "../../layouts/CandidateLayout";

import PageHeader from "../../components/common/PageHeader";

function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { applicationId } = useParams();

  // 🔥 Fetch Questions
  useEffect(() => {
    if (!applicationId) return;

    API.get(`/test/questions/${applicationId}`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load questions");
      });
  }, [applicationId]);

  // 🔥 Select Answer
  const handleOption = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  // 🔥 Submit Test
  const handleSubmit = async () => {
    try {
      const res = await API.post(`/test/submit-test/${applicationId}`, answers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/candidate-dashboard");
    } catch (err) {
      console.log(err);

      toast.error("Submission failed");
    }
  };

  return (
    <CandidateLayout title="Aptitude Test" breadcrumbs={[{ label: "Aptitude Test" }]}>
      <PageHeader title="Aptitude Test 🚀" subtitle="Complete the questions below to demonstrate your skills" />
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">

        {questions.map((q) => (
          <div key={q.id} className="border border-gray-200 bg-gray-50 p-5 rounded-lg mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">{q.question}</h2>

            {q.options.map((opt, index) => (
              <div key={index} className="mb-2">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    onChange={() => handleOption(q.id, opt)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />

                  <span className="ml-3">{opt}</span>
                </label>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition shadow-sm mt-4"
        >
          Submit Test
        </button>
        {score !== null && (
          <div className="mt-6 p-4 border rounded">
            <h2 className="text-2xl font-bold text-green-600">
              Your Score: {score}
            </h2>
          </div>

        )}
      </div>
    </CandidateLayout>
  );
}

export default TestPage;
