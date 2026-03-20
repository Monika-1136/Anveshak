import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { LoginScreen } from "./components/LoginScreen";
import { MFAScreen } from "./components/MFAScreen";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { EvidenceIntake } from "./components/EvidenceIntake";
import { AIAnalysisDashboard } from "./components/AIAnalysisDashboard";
import { TimelineReconstruction } from "./components/TimelineReconstruction";
import { CaseManagement, Column } from "./components/CaseManagement";
// ThreatIntelligence import removed
import { CreateInvestigationPage } from "./components/CreateInvestigationPage";
import { ReportGenerator } from "./components/ReportGenerator";
import { ReportsChooser } from "./components/ReportsChooser";
import { ChainOfCustody } from "./components/ChainOfCustody";
import { Settings } from "./components/Settings";
import { UserManagement } from "./components/UserManagement";
import { CaseDetails } from "./components/CaseDetails";

type AuthStep = "login" | "mfa" | "authenticated";

const initialColumns: Column[] = [
  {
    id: "new",
    title: "New",
    color: "#7A5CFF",
    cases: [
      { id: "FR-1048", title: "Suspicious Network Traffic", severity: "high", investigator: "Unassigned", attachments: 3, comments: 0, date: "2025-10-08" },
      { id: "FR-1047", title: "Malware Detection Alert", severity: "critical", investigator: "Unassigned", attachments: 5, comments: 1, date: "2025-10-08" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#00FFFF",
    cases: [
      { id: "FR-1045", title: "Unauthorized Access", severity: "critical", investigator: "Alex Rivera", attachments: 12, comments: 8, date: "2025-10-07" },
  // Threat-related case removed
      { id: "FR-1042", title: "Phishing Campaign", severity: "medium", investigator: "Sam Chen", attachments: 4, comments: 3, date: "2025-10-06" },
    ],
  },
  {
    id: "review",
    title: "Under Review",
    color: "#FFB800",
    cases: [
      { id: "FR-1040", title: "Data Exfiltration", severity: "high", investigator: "Morgan Taylor", attachments: 9, comments: 6, date: "2025-10-05" },
  // Threat-related case removed
    ],
  },
  {
    id: "closed",
    title: "Closed",
    color: "#00FFB3",
    cases: [
      { id: "FR-1035", title: "False Positive - Port Scan", severity: "low", investigator: "Jordan Lee", attachments: 2, comments: 2, date: "2025-10-03" },
    ],
  },
];

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentPage');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleCreateCase = (caseDetails: { 
    caseName: string; 
    caseId: string; 
    description: string; 
    assignedInvestigator: string; 
    priority: "critical" | "high" | "medium" | "low"; 
    startDate: string; 
  }) => {
    const newCase = {
      id: caseDetails.caseId || `FR-${Math.floor(Math.random() * 1000) + 1049}`,
      title: caseDetails.caseName,
      severity: caseDetails.priority,
      investigator: caseDetails.assignedInvestigator || "Unassigned",
      attachments: 0,
      comments: 0,
      date: caseDetails.startDate || new Date().toISOString().split("T")[0],
      description: caseDetails.description,
    };
    const newColumns = columns.map(c => {
      if (c.id === 'new') {
        return { ...c, cases: [newCase, ...c.cases] };
      }
      return c;
    });
    setColumns(newColumns);
    // Navigation will now be handled by the component that calls this.
  };

  const handleLogin = () => navigate('/mfa');

  const handleMfaSuccess = () => {
    const fakeToken = `token_${Date.now()}`;
    localStorage.setItem('authToken', fakeToken);
    setIsAuthenticated(true);
    const lastPage = localStorage.getItem('currentPage') || '/dashboard';
    navigate(lastPage);
  };

  // This effect ensures that if the auth token is removed (e.g., from another tab),
  // the user is logged out.
  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem('authToken') && isAuthenticated) {
        handleLogout();
      }
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
      <Route path="/mfa" element={<MFAScreen onMfaSuccess={handleMfaSuccess} />} />
      
      {isAuthenticated ? (
        <Route path="/" element={<DashboardLayout onLogout={handleLogout} />}>
          <Route index element={<Navigate to={localStorage.getItem('currentPage') || '/dashboard'} replace />} />
          <Route path="dashboard" element={<DashboardHome onCreateCase={handleCreateCase} />} />
          <Route path="create-investigation" element={<CreateInvestigationPage onCreateCase={handleCreateCase} />} />
          <Route path="intake" element={<EvidenceIntake />} />
          <Route path="analysis" element={<AIAnalysisDashboard />} />
          <Route path="timeline" element={<TimelineReconstruction />} />
          <Route path="cases" element={<CaseManagement columns={columns} setColumns={setColumns} />} />
          <Route path="cases/:caseId" element={<CaseDetails />} />
          {/* ThreatIntelligence route removed */}
          <Route path="reports" element={<ReportsChooser />} />
          <Route path="reports/generate" element={<ReportGenerator />} />
          <Route path="custody" element={<ChainOfCustody />} />
          <Route path="settings" element={<Settings />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
