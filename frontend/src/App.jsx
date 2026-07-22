import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/shared/Dashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import TestPage from "./pages/candidate/TestPage";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import AddQuestion from "./pages/recruiter/AddQuestion";
import ProtectedRoute from "./routes/ProtectedRoute";
import CandidateDetails from "./pages/recruiter/CandidateDetails";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import JobApplicants from "./pages/recruiter/JobApplicants";
import MyApplications from "./pages/candidate/MyApplications";
import RecruiterAnalytics from "./pages/recruiter/RecruiterAnalytics";
import RecruiterCreateJob from "./pages/recruiter/RecruiterCreateJob";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import CandidateInterviewKit from "./pages/candidate/CandidateInterviewKit";
import CandidateAIChat from "./pages/candidate/CandidateAIChat";
import RecruiterCandidateAnalysis from "./pages/recruiter/RecruiterCandidateAnalysis";
import RecruiterAIAssistant from "./pages/recruiter/RecruiterAIAssistant";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import TestResult from "./pages/candidate/TestResult";
import CandidateProfile from "./pages/candidate/CandidateProfile";

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
        path="/candidate-profile"
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test/:applicationId"
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
        path="/recruiter-profile"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterProfile />
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
      <Route
        path="/recruiter-jobs"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-job"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterCreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter-analytics"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterAnalytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/interview-kit/:applicationId"
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateInterviewKit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/candidate/ai-chat/:applicationId"
        element={
          <ProtectedRoute allowedRole="candidate">
            <CandidateAIChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/candidate-analysis/:applicationId"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterCandidateAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/ai-assistant"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterAIAssistant />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-result/:application_id"
        element={
          <ProtectedRoute allowedRole="candidate">
            <TestResult />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
