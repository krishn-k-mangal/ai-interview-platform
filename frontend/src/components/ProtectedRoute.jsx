import { Navigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

function ProtectedRoute({
  children,

  allowedRole,
}) {
  const token = localStorage.getItem("token");

  // 🔥 No token
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    // 🔥 Decode token
    const decoded = jwtDecode(token);

    // 🔥 Wrong role
    if (decoded.role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return children;
  } catch (err) {
    console.log(err);

    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;
