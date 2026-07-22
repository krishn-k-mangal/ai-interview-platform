import { useNavigate } from "react-router-dom";

export default function QuickActions({ candidate, applicationId, inputRef }) {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Resume",
      description: "View candidate resume",
      onClick: () => navigate(`/resume/${candidate?.candidate_id}`),
    },
    {
      title: "Interview Kit",
      description: "Open interview kit",
      onClick: () => navigate(`/recruiter/interview-kit/${applicationId}`),
    },
    {
      title: "Interview",
      description: "Schedule interview",
      onClick: () => navigate(`/recruiter/candidate/${applicationId}`),
    },
    {
      title: "Ask AI",
      description: "Jump to AI chat",
      onClick: () => inputRef.current?.focus(),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-5">Quick Actions</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={action.onClick}
            className="rounded-lg border border-gray-200 p-4 text-left hover:bg-gray-50 hover:border-gray-300 transition duration-150"
          >
            <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
