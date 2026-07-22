import React from "react";
import { Link } from "react-router-dom";

function TopHeader({
  title,
  breadcrumbs = [],
  userName = "User Name",
  userRole = "Role",
  avatarInitials = "US",
  onMenuToggle,
}) {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      {/* Left side: Menu Toggle (Mobile) + Breadcrumbs or Title */}
      <div className="flex items-center gap-3 md:gap-2">
        <button 
          onClick={onMenuToggle}
          className="md:hidden p-1.5 -ml-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-gray-900 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-300">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : title ? (
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        ) : null}
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
          />
        </div>

        {/* Notifications (UI Only) */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 leading-none mb-1">
              {userName}
            </p>
            <p className="text-xs text-gray-500 leading-none">{userRole}</p>
          </div>
          <div className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:ring-2 ring-black/10 transition-all">
            {avatarInitials}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
