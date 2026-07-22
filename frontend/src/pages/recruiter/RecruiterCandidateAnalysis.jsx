import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api";
import ReactMarkdown from "react-markdown";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import HeroCard from "../../components/ai/HeroCard";
import AISummaryCard from "../../components/ai/AISummaryCard";
import MetricCard from "../../components/ai/MetricCard";
import SkillsCard from "../../components/ai/SkillsCard";
import AIDecisionCard from "../../components/ai/AIDecisionCard";
import QuickActions from "../../components/ai/QuickActions";
import Loader from "../../components/common/Loader";

export default function RecruiterCandidateAnalysis() {
  const { applicationId } = useParams();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [candidate, setCandidate] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const recruiterSuggestions = [
    "Should I hire this candidate?",
    "Explain the match score.",
    "What are the candidate's strengths?",
    "What are the candidate's weaknesses?",
    "Generate interview questions.",
    "How can this candidate improve?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history]);

  const loadCandidate = async () => {
    try {
      const res = await API.get(`/recruiter/application/${applicationId}`);
      setCandidate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await API.get(`/ai/chat/history/${applicationId}`);
      const formattedHistory = [];
      res.data.messages.forEach((chat) => {
        formattedHistory.push({ role: "user", message: chat.message });
        formattedHistory.push({ role: "assistant", message: chat.response });
      });
      setHistory(formattedHistory);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCandidate();
    loadHistory();
  }, []);

  const sendMessage = async (customMessage = null) => {
    const userMessage = customMessage ?? message;
    if (!userMessage.trim()) return;

    setHistory((prev) => [...prev, { role: "user", message: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post(`/ai/chat/recruiter/${applicationId}`, {
        message: userMessage,
      });
      setSuggestions(res.data.response.follow_up || []);
      setHistory((prev) => [
        ...prev,
        { role: "assistant", message: res.data.response.answer },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", message: "❌ Sorry, I couldn't process your request." },
      ]);
    }
    inputRef.current?.focus();
    setLoading(false);
  };

  const breadcrumbs = [
    { label: "Applicants", href: `/job-applicants/${candidate?.job_id}` },
    { label: candidate?.name || "Candidate", href: `/candidate-details/${applicationId}` },
    { label: "AI Analysis" }
  ];

  return (
    <RecruiterLayout title="Candidate AI Analysis" breadcrumbs={breadcrumbs}>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🧠 AI Candidate Analysis</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Analyze this candidate using AI, review recommendations, and ask hiring-related questions.
        </p>
      </div>

      <HeroCard candidate={candidate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <AISummaryCard candidate={candidate} />
        <AIDecisionCard candidate={candidate} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <MetricCard title="Match Score" value={`${candidate?.match_score || 0}%`} color="green" />
        <MetricCard title="Resume Score" value={candidate?.resume_quality_score || 0} color="blue" />
        <MetricCard title="Test Score" value={candidate?.test_score || 0} color="orange" />
        <MetricCard title="Final Score" value={candidate?.final_score || 0} color="purple" />
      </div>

      <div className="mt-8">
        <SkillsCard candidate={candidate} />
      </div>

      <div className="mt-8">
        <QuickActions candidate={candidate} applicationId={applicationId} inputRef={inputRef} />
      </div>

      {/* AI Discussion Area */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">💬 AI Discussion</h2>

        <div className="border border-gray-200 rounded-xl h-[550px] overflow-y-auto p-6 bg-[#F8FAFC]">
          {(history || []).map((chat, index) => (
            <div key={index} className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[75%] px-4 py-3 rounded-lg text-sm shadow-sm ${
                  chat.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                {chat.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{chat.message}</ReactMarkdown>
                  </div>
                ) : (
                  chat.message
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-4 text-left flex items-center gap-3">
              <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(suggestions.length ? suggestions : recruiterSuggestions).map((item, index) => (
            <button
              key={index}
              onClick={() => sendMessage(item)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex mt-4 gap-3">
          <input
            ref={inputRef}
            value={message}
            disabled={loading}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) sendMessage();
            }}
            placeholder="Ask about this candidate..."
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-sm"
            }`}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </RecruiterLayout>
  );
}
