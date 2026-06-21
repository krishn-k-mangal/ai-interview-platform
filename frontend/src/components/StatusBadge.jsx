function StatusBadge({ status }) {
  const styles = {
    APPLIED: "bg-blue-100 text-blue-700",

    SCREENING: "bg-yellow-100 text-yellow-700",

    SHORTLISTED: "bg-green-100 text-green-700",

    INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700",

    TECHNICAL_ROUND: "bg-indigo-100 text-indigo-700",

    HR_ROUND: "bg-pink-100 text-pink-700",

    SELECTED: "bg-emerald-100 text-emerald-700",

    REJECTED: "bg-red-100 text-red-700",
  };

  const labels = {
    APPLIED: "Applied",

    SCREENING: "Screening",

    SHORTLISTED: "Shortlisted",

    INTERVIEW_SCHEDULED: "Interview Scheduled",

    TECHNICAL_ROUND: "Technical Round",

    HR_ROUND: "HR Round",

    SELECTED: "Selected",

    REJECTED: "Rejected",
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
