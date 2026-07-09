export default function AISummaryCard({ candidate }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
          🧠
        </div>

        <div>
          <h2 className="text-xl font-bold">AI Summary</h2>

          <p className="text-sm text-gray-500">
            AI-generated overview of the candidate.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 leading-7 text-gray-700">
        {candidate?.ai_summary || "AI summary is not available yet."}
      </div>
    </div>
  );
}
