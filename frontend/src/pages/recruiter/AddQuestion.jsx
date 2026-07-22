import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal";
import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import PageHeader from "../../components/common/PageHeader";

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

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm";

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
    <RecruiterLayout>
      <PageHeader
        title="Question Bank"
        subtitle="Create aptitude and technical questions for candidates"
      />

      {/* Job Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Job</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className={inputClass + " bg-white"}
        >
          <option value="">Choose a Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Add Question</h2>

        {/* Question */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className={inputClass}
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Option 1</label>
            <input
              type="text"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Option 2</label>
            <input
              type="text"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Option 3</label>
            <input
              type="text"
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Option 4</label>
            <input
              type="text"
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Correct Answer */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Correct Answer</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="Enter correct answer"
            className={inputClass}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
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
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Delete Modal */}
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

      {/* Question List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Questions</h2>

        {selectedJob ? (
          questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500 text-sm">No questions added for this job yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400">Q{index + 1}</span>
                      <h3 className="text-sm font-medium text-gray-900">{q.question}</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Answer: <span className="font-medium text-green-600">{q.correct_answer}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuestionId(q.id);
                      setShowModal(true);
                    }}
                    className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-sm">Select a job to view its questions.</p>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
}

export default AddQuestion;
