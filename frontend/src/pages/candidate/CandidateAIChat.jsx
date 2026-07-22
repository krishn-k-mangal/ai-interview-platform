import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import ReactMarkdown from "react-markdown";
import CandidateLayout from "../../layouts/CandidateLayout";
import PageHeader from "../../components/common/PageHeader";

export default function CandidateAIChat() {
  const { applicationId } = useParams();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history]);

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

  const sendMessage = async (customMessage = null) => {
    const userMessage = customMessage ?? message;
    if (!userMessage.trim()) return;

    setHistory((prev) => [...prev, { role: "user", message: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post(`/ai/chat/candidate/${applicationId}`, {
        message: userMessage,
      });

      setSuggestions(res.data.response.follow_up || []);

      setHistory((prev) => [
        ...prev,
        { role: "assistant", message: res.data.response.answer },
      ]);
    } catch (err) {
      console.log(err);
    }
    inputRef.current?.focus();
    setLoading(false);
  };

  const defaultSuggestions = [
    "How can I prepare for the interview?",
    "What are my key strengths?",
    "Can you give me a mock question?",
  ];

  return (
    <CandidateLayout
      title="AI Career Assistant"
      breadcrumbs={[
        { label: "My Applications", href: "/my-applications" },
        { label: "AI Assistant" }
      ]}
    >
      <PageHeader
        title="AI Career Assistant"
        subtitle="Chat with AI to prepare for your interviews and analyze your match"
      />

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">💬 Chat Interface</h2>

        <div className="border border-gray-200 rounded-xl h-[550px] overflow-y-auto p-6 bg-[#F8FAFC]">
          {(history || []).map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${chat.role === "user" ? "text-right" : "text-left"}`}
            >
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
          {(suggestions.length ? suggestions : defaultSuggestions).map((item, index) => (
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
              if (e.key === "Enter" && !loading) {
                sendMessage();
              }
            }}
            placeholder="Ask about this application..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
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
    </CandidateLayout>
  );
}
