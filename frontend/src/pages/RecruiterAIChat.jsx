import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ReactMarkdown from "react-markdown";

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
    console.log(localStorage.getItem("token"));
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

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

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
      console.log(err);
    }
    inputRef.current?.focus();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🤖 AI Hirirng Assistant</h1>

      <div className="border rounded-lg h-[550px] overflow-y-auto p-6 bg-gray-50">
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
                <ReactMarkdown>{chat.message}</ReactMarkdown>
              ) : (
                chat.message
              )}
            </div>
          </div>
        ))}

        {loading && <p className="text-gray-500">AI is typing...</p>}

        <div ref={bottomRef}></div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((item, index) => (
          <button
            key={index}
            onClick={() => setMessage(item)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex mt-4 gap-3">
        <input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              sendMessage();
            }
          }}
          placeholder="Ask anything..."
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
