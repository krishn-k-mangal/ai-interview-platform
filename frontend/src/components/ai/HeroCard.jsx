export default function HeroCard({ candidate }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{candidate?.name}</h1>

          <p className="text-indigo-100 mt-2">{candidate?.email}</p>

          <p className="mt-3">
            Status:
            <span className="font-semibold ml-2">{candidate?.status}</span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm uppercase opacity-80">AI Recommendation</p>

          <div className="mt-3 bg-white text-indigo-700 px-5 py-2 rounded-full font-bold">
            {candidate?.recommendation}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-10">
        <div>
          <p className="text-indigo-100">Match Score</p>

          <h2 className="text-4xl font-bold">{candidate?.match_score}%</h2>
        </div>

        <div>
          <p className="text-indigo-100">Resume</p>

          <h2 className="text-4xl font-bold">{candidate?.resume_score}</h2>
        </div>

        <div>
          <p className="text-indigo-100">Test</p>

          <h2 className="text-4xl font-bold">{candidate?.test_score}</h2>
        </div>

        <div>
          <p className="text-indigo-100">Final</p>

          <h2 className="text-4xl font-bold">{candidate?.final_score}</h2>
        </div>
      </div>
    </div>
  );
}
