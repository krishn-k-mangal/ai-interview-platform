import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CandidateDashboard from "./components/CandidateDashboard";
import TestPage from "./components/TestPage";
import RecruiterDashboard from "./components/RecruiterDashboard";
import AddQuestion from "./components/AddQuestion";
import ProtectedRoute from "./components/ProtectedRoute";
import CandidateDetails from "./components/CandidateDetails";
import CandidateJobs from "./page/CandidateJobs";
import JobApplicants from "./components/JobApplicants";
import MyApplications from "./components/MyApplications";
import RecruiterAnalytics from "./page/RecruiterAnalytics";
import RucruiterCreateJob from "./page/RucruiterCreateJob";
import RecruiterJobs from "./page/RecruiterJobs";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/candidate-dashboard"
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute allowedRole="candidate">
            <TestPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter-dashboard"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-question"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <AddQuestion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate-details/:applicationId"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <CandidateDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate-jobs"
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-applicants/:id"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <JobApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-applications"
        element={
          <ProtectedRoute allowedRole="candidate">
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route path="/recruiter-jobs" element={<RecruiterJobs />} />
      <Route path="/add-job" element={<RucruiterCreateJob />} />


     

      <Route path="/recruiter-analytics" element={<RecruiterAnalytics />} />
      
    </Routes>
  );
}

export default App;
