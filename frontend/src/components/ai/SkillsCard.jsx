function SkillGroup({ title, skills, color }) {
  const skillList = skills
    ? skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>

      <div className="flex flex-wrap gap-2">
        {skillList.length ? (
          skillList.map((skill, index) => (
            <span
              key={index}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${color}`}
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">None</span>
        )}
      </div>
    </div>
  );
}

export default function SkillsCard({ candidate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-4 md:p-6">
      <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Skills Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkillGroup
          title="Matched Skills"
          skills={candidate?.matched_skills}
          color="bg-green-100 text-green-700"
        />

        <SkillGroup
          title="Missing Skills"
          skills={candidate?.missing_skills}
          color="bg-red-100 text-red-700"
        />

        <SkillGroup
          title="Extra Skills"
          skills={candidate?.extra_skills}
          color="bg-blue-100 text-blue-700"
        />
      </div>
    </div>
  );
}
