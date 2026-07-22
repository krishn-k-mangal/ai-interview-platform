import { Outlet } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {children || <Outlet />}
    </div>
  );
}

export default AuthLayout;
