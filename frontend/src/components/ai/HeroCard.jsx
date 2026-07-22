export default function HeroCard({ candidate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{candidate?.name}</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">{candidate?.email}</p>
          <div className="mt-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                candidate?.status === "SELECTED"
                  ? "bg-green-100 text-green-700"
                  : candidate?.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : candidate?.status === "INTERVIEW_SCHEDULED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {candidate?.status?.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        <div className="text-left md:text-right mt-2 md:mt-0">
          <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">AI Recommendation</p>
          <div
            className={`mt-1 md:mt-2 inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold ${
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">Match Score</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{candidate?.match_score}%</h2>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">Resume</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{candidate?.resume_score}</h2>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">Test</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{candidate?.test_score}</h2>
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">Final</p>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{candidate?.final_score}</h2>
        </div>
      </div>
    </div>
  );
}
