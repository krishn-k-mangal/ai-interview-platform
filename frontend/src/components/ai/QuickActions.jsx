import { useNavigate } from "react-router-dom";

export default function QuickActions({ candidate, applicationId, inputRef }) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "📄",
      title: "Resume",
      description: "View candidate resume",
      color: "bg-blue-100 text-blue-700",
      onClick: () => navigate(`/resume/${candidate?.candidate_id}`),
    },
    {
      icon: "📋",
      title: "Interview Kit",
      description: "Open interview kit",
      color: "bg-green-100 text-green-700",
      onClick: () => navigate(`/recruiter/interview-kit/${applicationId}`),
    },
    {
      icon: "📅",
      title: "Interview",
      description: "Schedule interview",
      color: "bg-orange-100 text-orange-700",
      onClick: () => navigate(`/recruiter/candidate/${applicationId}`),
    },
    {
      icon: "🤖",
      title: "Ask AI",
      description: "Jump to AI chat",
      color: "bg-purple-100 text-purple-700",
      onClick: () => inputRef.current?.focus(),
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">⚡ Quick Actions</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            className="group rounded-2xl border p-5 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${action.color}`}
            >
              {action.icon}
            </div>

            <h3 className="font-bold mt-5">{action.title}</h3>

            <p className="text-sm text-gray-500 mt-2">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
