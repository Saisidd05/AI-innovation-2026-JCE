import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import HackerAI from './pages/HackerAI';
import UploadCSV from './pages/UploadCSV';
import CaseManagement from './pages/CaseManagement';
import EvidenceLocker from './pages/EvidenceLocker';
import GraphExplorer from './pages/GraphExplorer';
import TimelineAnalysis from './pages/TimelineAnalysis';
import AuditLogs from './pages/AuditLogs';

const Unauthorized = () => (
  <div className="p-8 max-w-md mx-auto my-12 bg-panel border border-status-flagged/30 rounded-lg text-center space-y-4">
    <div className="text-status-flagged font-mono font-bold text-lg">ACCESS RESTRICTED</div>
    <p className="text-text-secondary text-sm">Your security clearance level does not permit access to this module.</p>
  </div>
);

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hacker-ai" element={<HackerAI />} />
          <Route path="cases" element={<CaseManagement />} />
          <Route path="upload" element={<UploadCSV />} />
          <Route path="datasets" element={<UploadCSV />} />
          <Route path="evidence" element={<EvidenceLocker />} />
          <Route path="review" element={<EvidenceLocker />} />
          <Route path="graph" element={<GraphExplorer />} />
          <Route path="timeline" element={<TimelineAnalysis />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
