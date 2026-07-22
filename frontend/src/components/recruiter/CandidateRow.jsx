import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { NEXT_STATUS } from "../../constants/statusFlow";

function CandidateRow({ candidate, token, handleStatusUpdate }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/80 transition duration-150">
      <td className="px-4 py-3 text-sm font-semibold text-gray-500">#{candidate.rank}</td>

      <td className="px-4 py-3 text-sm font-medium text-gray-900">{candidate.name}</td>

      <td className="px-4 py-3 text-sm text-gray-500">{candidate.email}</td>

      <td className="px-4 py-3 text-sm text-gray-700">{candidate.resume_score}</td>

      <td className="px-4 py-3 text-sm text-gray-700">{candidate.test_score}</td>

      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        {candidate.overall_score}
      </td>

      <td className="px-4 py-3">
        <StatusBadge status={candidate.status} />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {candidate.status !== "SELECTED" && candidate.status !== "REJECTED" && (
            <button
              onClick={() =>
                handleStatusUpdate(
                  candidate.application_id,
                  NEXT_STATUS[candidate.status.toUpperCase()],
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs font-medium transition shadow-sm"
            >
              {NEXT_STATUS[candidate.status.toUpperCase()]?.replaceAll("_", " ")}
            </button>
          )}

          {candidate.status !== "REJECTED" && candidate.status !== "SELECTED" && (
            <button
              onClick={() =>
                handleStatusUpdate(candidate.application_id, "REJECTED")
              }
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-xs font-medium transition shadow-sm"
            >
              Reject
            </button>
          )}

          <Link to={`/candidate-details/${candidate.application_id}`}>
            <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-xs font-medium transition shadow-sm">
              Details
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}

export default CandidateRow;
