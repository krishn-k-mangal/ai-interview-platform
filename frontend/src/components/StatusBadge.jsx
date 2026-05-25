function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",

    shortlisted: "bg-green-100 text-green-700",

    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`

        px-3 py-1 rounded-full text-sm font-semibold

        ${styles[status]}

      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
