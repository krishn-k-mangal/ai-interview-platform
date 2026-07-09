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
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🤖 AI Hiring Decision</h2>

          <p className="text-gray-500 mt-1">
            AI recommendation based on all candidate data.
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-full font-semibold ${
            candidate?.recommendation === "Highly Recommended"
              ? "bg-green-100 text-green-700"
              : candidate?.recommendation === "Recommended"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {candidate?.recommendation}
        </div>
      </div>

      <div className="mt-8 space-y-5">
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

      <div className="mt-8">
        <p className="font-semibold">AI Confidence</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div
            className="bg-indigo-600 h-3 rounded-full"
            style={{ width: `${confidence}%` }}
          />
        </div>

        <p className="mt-2 text-gray-600">{confidence}% Confidence</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span>{label}</span>

        <span className="font-semibold">{value}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
