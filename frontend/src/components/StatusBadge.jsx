function StatusBadge({ status }) {
  const styles = {
    applied: "bg-blue-100 text-blue-700",

    screening: "bg-yellow-100 text-yellow-700",

    shortlisted: "bg-green-100 text-green-700",

    interview_scheduled: "bg-purple-100 text-purple-700",

    technical_round: "bg-indigo-100 text-indigo-700",

    hr_round: "bg-pink-100 text-pink-700",

    selected: "bg-emerald-100 text-emerald-700",

    rejected: "bg-red-100 text-red-700",
  };

  const labels = {
    applied: "Applied",

    screening: "Screening",

    shortlisted: "Shortlisted",

    interview_scheduled: "Interview Scheduled",

    technical_round: "Technical Round",

    hr_round: "HR Round",

    selected: "Selected",

    rejected: "Rejected",
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-semibold
        ${styles[status] || "bg-gray-100 text-gray-700"}
      `}
    >
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;
