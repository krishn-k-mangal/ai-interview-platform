import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import TestPage from "./pages/TestPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AddQuestion from "./pages/AddQuestion";
import ProtectedRoute from "./components/ProtectedRoute";
import CandidateDetails from "./pages/CandidateDetails";
import CandidateJobs from "./pages/CandidateJobs";
import JobApplicants from "./components/JobApplicants";
import MyApplications from "./pages/MyApplications";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";
import RucruiterCreateJob from "./pages/RucruiterCreateJob";
import RecruiterJobs from "./pages/RecruiterJobs";
import CandidateInterviewKit from "./pages/CandidateInterviewKit";
import CandidateAIChat from "./pages/CandidateAIChat";
import RecruiterCandidateAnalysis from "./pages/RecruiterCandidateAnalysis";
import RecruiterAIAssistant from "./pages/RecruiterAIAssistant";
import TestResult from "./pages/TestResult";

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

      <Route
        path="/candidate/interview-kit/:applicationId"
        element={<CandidateInterviewKit />}
      />
      <Route
        path="/candidate/ai-chat/:applicationId"
        element={<CandidateAIChat />}
      />
      <Route
        path="/recruiter/candidate-analysis/:applicationId"
        element={<RecruiterCandidateAnalysis />}
      />
      <Route
        path="/recruiter/ai-assistant"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterAIAssistant />
          </ProtectedRoute>
        }
      />
      <Route path="/test-result/:application_id" element={<TestResult />} />
    </Routes>
  );
}

export default App;
