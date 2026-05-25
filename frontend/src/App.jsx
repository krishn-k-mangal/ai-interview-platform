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
        path="/candidate-details/:id"
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
    </Routes>
  );
}

export default App;
