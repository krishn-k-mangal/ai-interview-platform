import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TestPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔥 Fetch Questions
  useEffect(() => {
    API.get("/test/questions")
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      const res = await API.post("/test/submit-test", answers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/candidate-dashboard");;
    } catch (err) {
      console.log(err);

      
      toast.success("Submission failed");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">Aptitude Test 🚀</h1>

      {questions.map((q) => (
        <div key={q.id} className="border p-5 rounded mb-6">
          <h2 className="font-semibold mb-4">{q.question}</h2>

          {q.options.map((opt, index) => (
            <div key={index} className="mb-2">
              <label>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  onChange={() => handleOption(q.id, opt)}
                />

                <span className="ml-2">{opt}</span>
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-3"
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
  );
}

export default TestPage;
