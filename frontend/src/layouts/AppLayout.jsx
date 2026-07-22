import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import TopHeader from "../components/common/TopHeader";

function AppLayout({ 
  children, 
  title, 
  breadcrumbs, 
  logoIcon, 
  logoText, 
  navItems, 
  userRole, 
  defaultInitials 
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  let userContext = null;
  if (token) {
    try {
      userContext = JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Failed to decode token");
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const userName = userContext?.name || userRole;
  const initials = userContext?.email ? userContext.email[0].toUpperCase() : defaultInitials;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans relative">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        logoIcon={logoIcon}
        logoText={logoText}
        navItems={navItems}
        user={{
          name: userName,
          role: userRole,
          initials: initials
        }}
        onLogout={handleLogout}
      />

      <div className="md:ml-20 lg:ml-64 flex-1 flex flex-col min-h-screen w-full transition-all duration-300">
        <TopHeader 
          title={title}
          breadcrumbs={breadcrumbs}
          userName={userName}
          userRole={userRole}
          avatarInitials={initials}
          onMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-auto">
          <div className="w-full">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
