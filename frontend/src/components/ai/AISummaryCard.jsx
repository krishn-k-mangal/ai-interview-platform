export default function AISummaryCard({ candidate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1">AI Summary</h2>
      <p className="text-xs md:text-sm text-gray-500 mb-4">
        AI-generated overview of the candidate.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 md:p-5 leading-6 md:leading-7 text-sm text-gray-700">
        {candidate?.ai_summary || "AI summary is not available yet."}
      </div>
    </div>
  );
}
