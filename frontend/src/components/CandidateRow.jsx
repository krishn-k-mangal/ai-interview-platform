import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { NEXT_STATUS } from "../utils/statusFlow";

function CandidateRow({ candidate, token, handleStatusUpdate }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 font-bold text-purple-600">#{candidate.rank}</td>

      <td className="p-4 font-medium">{candidate.name}</td>

      <td className="p-4">{candidate.email}</td>

      <td className="p-4">{candidate.resume_score}</td>

      <td className="p-4">{candidate.test_score}</td>

      <td className="p-4 font-bold text-green-600">
        {candidate.overall_score}
      </td>

      <td className="p-4">
        <StatusBadge status={candidate.status} />
      </td>

      <td className="p-4 flex gap-2">
        {candidate.status !== "SELECTED" && candidate.status !== "REJECTED" && (
          <button
            onClick={() =>
              handleStatusUpdate(
                candidate.application_id,
                NEXT_STATUS[candidate.status.toUpperCase()],
              )
            }
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded"
          >
            {NEXT_STATUS[candidate.status.toUpperCase()]?.replaceAll("_", " ")}
          </button>
        )}

        {candidate.status !== "REJECTED" && candidate.status !== "SELECTED" && (
          <button
            onClick={() =>
              handleStatusUpdate(candidate.application_id, "REJECTED")
            }
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
          >
            Reject
          </button>
        )}

        <Link to={`/candidate-details/${candidate.application_id}`}>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
            View Details
          </button>
        </Link>
      </td>
    </tr>
  );
}

export default CandidateRow;
