export default function AIDecisionCard({ candidate }) {
  const confidence = Math.min(
    Math.round(
      ((candidate?.match_score || 0) +
        (candidate?.resume_score || 0) +
        (candidate?.final_score || 0)) /
        3,
    ),
    100,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">AI Hiring Decision</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Based on all candidate data.
          </p>
        </div>

        <span
          className={`px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap ${
            candidate?.recommendation === "Highly Recommended"
              ? "bg-green-100 text-green-700"
              : candidate?.recommendation === "Recommended"
                ? "bg-blue-100 text-blue-700"
                : candidate?.recommendation === "Average Fit"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
          }`}
        >
          {candidate?.recommendation}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <ProgressRow
          label="Match Score"
          value={candidate?.match_score}
          color="bg-green-500"
        />
        <ProgressRow
          label="Resume Score"
          value={candidate?.resume_score}
          color="bg-blue-500"
        />
        <ProgressRow
          label="Test Score"
          value={candidate?.test_score}
          color="bg-orange-500"
        />
        <ProgressRow
          label="Final Score"
          value={candidate?.final_score}
          color="bg-purple-500"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">AI Confidence</span>
          <span className="text-sm font-semibold text-gray-900">{confidence}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="bg-gray-100 rounded-full h-1.5">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
