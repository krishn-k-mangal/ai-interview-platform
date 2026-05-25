import { Navigate } from "react-router-dom";

function Dashboard() {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Dashboard 🚀
      </h1>
    </div>
  );
}

export default Dashboard;