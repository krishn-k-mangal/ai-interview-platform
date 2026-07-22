import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({
  isOpen,
  onClose,
  logoIcon,
  logoText,
  navItems = [],
  user,
  onLogout,
}) {
  const location = useLocation();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Only lock scrolling on mobile where the sidebar is an overlay
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white text-gray-600 min-h-screen flex flex-col border-r border-gray-200 font-sans 
        transition-transform duration-300 ease-in-out
        w-64 md:w-20 lg:w-64
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        {/* Header Area */}
        <div className="h-16 flex items-center justify-between px-6 md:px-0 lg:px-6 border-b border-gray-100 mb-6 md:justify-center lg:justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-md shadow-sm flex items-center justify-center mr-3 md:mr-0 lg:mr-3">
              {logoIcon}
            </div>
            <h1 className="text-sm font-semibold tracking-wide text-gray-900 md:hidden lg:block">
              {logoText}
            </h1>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-3 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 md:hidden lg:block">Menu</p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose();
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 group ${
                      isActive
                        ? "bg-gray-50 text-gray-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    } md:justify-center lg:justify-start`}
                    title={item.name}
                  >
                    <span className={isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}>
                      {item.icon}
                    </span>
                    <span className="md:hidden lg:block whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 mt-auto">
          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer md:justify-center lg:justify-between"
            onClick={(e) => {
              // Only trigger onLogout if they clicked the container and it's tablet size,
              // or they explicitly clicked the logout button.
              // To make it easy, we will just call onLogout for tablet clicks.
              if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                onLogout();
              }
            }}
            title={user?.name ? `${user.name} - Logout` : "Logout"}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-xs font-medium text-gray-700">
                {user?.initials || "U"}
              </div>
              <div className="min-w-0 md:hidden lg:block">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role || "Role"}</p>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="text-gray-500 hover:text-red-400 p-1.5 rounded-md hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 md:hidden lg:block"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
