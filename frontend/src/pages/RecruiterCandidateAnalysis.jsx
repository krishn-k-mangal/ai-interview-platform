import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ReactMarkdown from "react-markdown";
import HeroCard from "../components/ai/HeroCard";
import AISummaryCard from "../components/ai/AISummaryCard";
import MetricCard from "../components/ai/MetricCard";
import SkillsCard from "../components/ai/SkillsCard";
import AIDecisionCard from "../components/ai/AIDecisionCard";
import QuickActions from "../components/ai/QuickActions";

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
        formattedHistory.push({
          role: "user",
          message: chat.message,
        });

        formattedHistory.push({
          role: "assistant",
          message: chat.response,
        });
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

    setHistory((prev) => [
      ...prev,
      {
        role: "user",
        message: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await API.post(`/ai/chat/recruiter/${applicationId}`, {
        message: userMessage,
      });

      setSuggestions(res.data.response.follow_up || []);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          message: res.data.response.answer,
        },
      ]);
    } catch (err) {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "❌ Sorry, I couldn't process your request.",
        },
      ]);
    }
    inputRef.current?.focus();
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">🧠 AI Candidate Analysis</h1>

        <p className="text-gray-500 mt-2">
          Analyze this candidate using AI, review recommendations, and ask
          hiring-related questions.
        </p>
      </div>

      <HeroCard candidate={candidate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <AISummaryCard candidate={candidate} />

        <AIDecisionCard candidate={candidate} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <MetricCard
          title="Match Score"
          value={`${candidate?.match_score}%`}
          color="green"
        />

        <MetricCard
          title="Resume Score"
          value={candidate?.resume_quality_score}
          color="blue"
        />

        <MetricCard
          title="Test Score"
          value={candidate?.test_score}
          color="orange"
        />

        <MetricCard
          title="Final Score"
          value={candidate?.final_score}
          color="purple"
        />
      </div>
      <div className="mt-8">
        <SkillsCard candidate={candidate} />
      </div>

      <div className="mt-8">
        <QuickActions
          candidate={candidate}
          applicationId={applicationId}
          inputRef={inputRef}
        />
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">💬 AI Discussion</h2>

        <div className="border rounded-xl h-[550px] overflow-y-auto p-6 bg-gray-50">
          {(history || []).map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${
                chat.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[75%] px-4 py-3 rounded-lg ${
                  chat.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-black"
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
            <div className="mb-4 text-left">
              <div className="inline-block bg-gray-100 rounded-lg px-4 py-3">
                🤖 Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {(suggestions.length ? suggestions : recruiterSuggestions).map(
          (item, index) => (
            <button
              key={index}
              onClick={() => sendMessage(item)}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {item}
            </button>
          ),
        )}
      </div>

      <div className="flex mt-4 gap-3">
        <input
          ref={inputRef}
          value={message}
          disabled={loading}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
          placeholder="Ask about this candidate..."
          className="flex-1 border rounded-lg px-4 py-3"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-6 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
