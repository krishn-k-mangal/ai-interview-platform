import { STATUS_FLOW } from "../utils/candidateStatusFlow";

function CandidateTimeline({ currentStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  return (
    <div className="space-y-3">
      {STATUS_FLOW.map((status, index) => (
        <div key={status} className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full
            ${index <= currentIndex ? "bg-green-500" : "bg-gray-300"}`}
          />

          <span
            className={`font-medium
            ${index <= currentIndex ? "text-green-600" : "text-gray-500"}`}
          >
            {status.replaceAll("_", " ")}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CandidateTimeline;
