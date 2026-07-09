import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Model";

import API from "../api";

import RecruiterSidebar from "../components/RecruiterSidebar";

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

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  // 🔥 Add Question
  const handleAddQuestion = async () => {
    if (
      !selectedJob ||
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
          job_id: Number(selectedJob),
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

  const fetchQuestions = async (jobId) => {
    if (!jobId) {
      setQuestions([]);
      return;
    }

    try {
      const res = await API.get(`/recruiter/all-questions/${jobId}`);

      setQuestions(res.data);
      console.log("Selected Job:", jobId);
      console.log("Questions:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs/my-jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchQuestions(selectedJob);
    }
  }, [selectedJob]);
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔥 Sidebar */}
      <RecruiterSidebar />

      {/* 🔥 Main Content */}
      <div className="ml-64 w-full p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Interview Question 🚀</h1>

          <p className="text-gray-600 mt-2">
            Create aptitude and technical questions for candidates
          </p>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Job</label>

          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Choose a Job</option>

            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
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

          {selectedJob ? (
            questions.map((q) => (
              <div key={q.id} className="bg-white shadow rounded p-5 mb-4">
                
                <h3 className="font-bold text-lg">{q.question}</h3>

                <p className="text-gray-600 mt-2">
                  Correct Answer: {q.correct_answer}
                </p>

                <button
                  onClick={() => {
                    setSelectedQuestionId(q.id);
                    setShowModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              Select a job to view its questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
