import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "./Model";

import API from "../api";

import Sidebar from "../components/Sidebar";

function AddQuestion() {
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");

  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  // 🔥 Add Question
  const handleAddQuestion = async () => {
    if (
      !question ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4 ||
      !correctAnswer
    ) {
      toast.error("All fields are required");

      return;
    }
    try {
      await API.post(
        "/recruiter/add-question",

        {
          question,
          option1,
          option2,
          option3,
          option4,

          correct_answer: correctAnswer,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Question added successfully");

      // clear fields
      setQuestion("");

      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");

      setCorrectAnswer("");
      fetchQuestions();
    } catch (err) {
      console.log(err);

      toast.error("Failed to add question");
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await API.get(
        "/recruiter/all-questions",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setQuestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔥 Sidebar */}
      <Sidebar />

      {/* 🔥 Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Interview Question 🚀</h1>

          <p className="text-gray-600 mt-2">
            Create aptitude and technical questions for candidates
          </p>
        </div>

        {/* 🔥 Form Card */}
        <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">
          {/* Question */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Question</label>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block font-semibold mb-2">Option 1</label>

              <input
                type="text"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Option 2</label>

              <input
                type="text"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Option 3</label>

              <input
                type="text"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Option 4</label>

              <input
                type="text"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Correct Answer */}
          <div className="mb-8">
            <label className="block font-semibold mb-2">Correct Answer</label>

            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Enter correct answer"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Add Question
          </button>
          <button
            onClick={() => {
              setQuestion("");

              setOption1("");
              setOption2("");
              setOption3("");
              setOption4("");

              setCorrectAnswer("");
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold ml-4"
          >
            Cancel
          </button>
        </div>
        <div className="mt-10">
          {showModal && (
            <Modal
              title="Delete Question"
              message="Are you sure you want to delete this question?"
              onCancel={() => {
                setShowModal(false);
              }}
              onConfirm={async () => {
                try {
                  await API.delete(
                    `/recruiter/delete-question/${selectedQuestionId}`,

                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  setQuestions((prev) =>
                    prev.filter((q) => q.id !== selectedQuestionId),
                  );

                  toast.success("Question deleted");
                } catch (err) {
                  console.log(err);

                  toast.error("Delete failed");
                }

                setShowModal(false);
              }}
            />
          )}
          <h2 className="text-2xl font-bold mb-5">All Questions</h2>

          {questions.map((q) => (
            <div key={q.id} className="bg-white shadow rounded p-5 mb-4">
              <h3 className="font-bold text-lg">{q.question}</h3>

              <p className="text-gray-600 mt-2">
                Correct Answer: {q.correct_answer}
              </p>

              <button
                onClick={() => {
                  setSelectedQuestionId(q.id);

                  setShowModal(true);

                  fetchQuestions();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
