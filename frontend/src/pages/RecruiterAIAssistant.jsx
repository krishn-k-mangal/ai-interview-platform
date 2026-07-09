import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";

import API from "../api";

import RecruiterSidebar from "../components/RecruiterSidebar";
import PageHeader from "../components/PageHeader";

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

  const sendMessage = async (customMessage = null) => {
    const text = customMessage ?? message;

    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      message: text,
    };

    setHistory((prev) => [...prev, userMessage]);

    setMessage("");

    setLoading(true);

    try {
      const res = await API.post("/ai/chat/recruiter-dashboard", {
        message: text,
      });

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          message: res.data.response?.answer ?? "No response received.",
        },
      ]);
    } catch (err) {
      console.log(err);

      toast.error("Failed to get AI response");
    }

    setLoading(false);

    inputRef.current?.focus();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RecruiterSidebar />

      <div className="ml-64 w-full max-w-7xl mx-auto p-10">
        <PageHeader
          title="🤖 AI Hiring Assistant"
          subtitle="Ask anything about candidates, jobs, hiring decisions and recruitment."
        />

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-5">Suggested Questions</h2>

          <div className="flex flex-wrap gap-3 mb-8">
            {recruiterSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full transition"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="border rounded-xl h-[450px] overflow-y-auto bg-gray-50 p-6">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <div className="text-6xl mb-4">🤖</div>

                <h2 className="text-2xl font-semibold">AI Hiring Assistant</h2>

                <p className="mt-3 max-w-lg">
                  Ask questions about candidates, recruitment progress,
                  interview preparation, analytics, and hiring decisions.
                </p>
              </div>
            ) : (
              history.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-5 flex ${
                    chat.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-5 py-4 ${
                      chat.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white shadow"
                    }`}
                  >
                    {chat.role === "assistant" ? (
                      <ReactMarkdown>{chat.message}</ReactMarkdown>
                    ) : (
                      chat.message
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && <div className="text-gray-500">AI is thinking...</div>}
          </div>

          <div className="flex gap-4 mt-6">
            <input
              ref={inputRef}
              type="text"
              value={message}
              placeholder="Ask the AI Hiring Assistant..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
