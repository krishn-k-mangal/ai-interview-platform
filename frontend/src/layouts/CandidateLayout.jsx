import { Outlet } from "react-router-dom";
import AppLayout from "./AppLayout";

// Icons
const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const JobsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const ApplicationsIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const ProfileIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const CandidateLogoIcon = (
  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md shadow-lg shadow-indigo-500/20"></div>
);

const navItems = [
  { name: "Dashboard", path: "/candidate-dashboard", icon: <DashboardIcon /> },
  { name: "Browse Jobs", path: "/candidate-jobs", icon: <JobsIcon /> },
  { name: "My Applications", path: "/my-applications", icon: <ApplicationsIcon /> },
  { name: "My Profile", path: "/candidate-profile", icon: <ProfileIcon /> },
];

function CandidateLayout({ children, title, breadcrumbs }) {
  return (
    <AppLayout
      title={title}
      breadcrumbs={breadcrumbs}
      logoIcon={CandidateLogoIcon}
      logoText="CareerHub"
      navItems={navItems}
      userRole="Applicant"
      defaultInitials="C"
    >
      {children || <Outlet />}
    </AppLayout>
  );
}

export default CandidateLayout;
