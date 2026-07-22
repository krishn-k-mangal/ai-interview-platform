import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import API from "../../api";
import RecruiterLayout from "../../layouts/RecruiterLayout";
import PageHeader from "../../components/common/PageHeader";

const recruiterSuggestions = [
  "Who is my strongest candidate?",
  "Compare my top two candidates.",
  "Which jobs need more applicants?",
  "Summarize today's recruitment progress.",
  "Generate interview questions.",
  "Which candidates should move to HR round?",
];

export default function RecruiterAIAssistant() {
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const sendMessage = async (customMessage = null) => {
    const text = customMessage ?? message;
    if (!text.trim()) return;

    const userMessage = { role: "user", message: text };
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat/recruiter-dashboard", { message: text });
      setHistory((prev) => [
        ...prev,
        { role: "assistant", message: res.data.response?.answer ?? "No response received." },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <RecruiterLayout title="AI Assistant" breadcrumbs={[{ label: "AI Assistant" }]}>
      <PageHeader
        title="🤖 AI Hiring Assistant"
        subtitle="Ask anything about candidates, jobs, hiring decisions, and recruitment analytics."
      />

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Questions</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {recruiterSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => sendMessage(suggestion)}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium transition"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 rounded-xl h-[450px] overflow-y-auto bg-[#F8FAFC] p-6">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">How can I help you today?</h2>
              <p className="max-w-md text-sm">
                Ask me about candidates, track recruitment progress, prepare interview kits, or compare applicants.
              </p>
            </div>
          ) : (
            history.map((chat, index) => (
              <div key={index} className={`mb-5 flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-5 py-3 text-sm shadow-sm border border-gray-200 ${
                    chat.role === "user" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-900"
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
            ))
          )}

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

        <div className="flex gap-4 mt-6">
          <input
            ref={inputRef}
            type="text"
            value={message}
            placeholder="Ask the AI Hiring Assistant..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                sendMessage();
              }
            }}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white transition shadow-sm ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </RecruiterLayout>
  );
}
