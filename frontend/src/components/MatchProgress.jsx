function MatchProgress({ score }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="font-medium">AI Match</span>

        <span className="font-bold text-blue-600">{score}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
          }}
        />
      </div>
    </div>
  );
}

export default MatchProgress;
