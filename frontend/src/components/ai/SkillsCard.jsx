function SkillGroup({ title, skills, color }) {
  const skillList = skills
    ? skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {skillList.length ? (
          skillList.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400">None</span>
        )}
      </div>
    </div>
  );
}

export default function SkillsCard({ candidate }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">🛠 Skills Analysis</h2>

      <div className="space-y-6">
        <SkillGroup
          title="✅ Matched Skills"
          skills={candidate?.matched_skills}
          color="bg-green-100 text-green-700"
        />

        <SkillGroup
          title="❌ Missing Skills"
          skills={candidate?.missing_skills}
          color="bg-red-100 text-red-700"
        />

        <SkillGroup
          title="⭐ Extra Skills"
          skills={candidate?.extra_skills}
          color="bg-purple-100 text-purple-700"
        />
      </div>
    </div>
  );
}
