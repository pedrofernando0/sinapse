import { lazy, useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import StudentShell, { STUDENT_VIEW_IDS } from '../features/student/StudentShell.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';

const ReadingsView = lazy(() => import('../features/student/Readings.jsx'));
const RevisionsView = lazy(() => import('../features/student/Revisions.jsx'));
const SimuladosView = lazy(() => import('../features/assessments/Simulados.jsx'));
const FuvestApprovalView = lazy(() => import('../features/assessments/FuvestApproval.jsx'));
const DiscursiveAIView = lazy(() => import('../features/ai-tools/DiscursiveAI.jsx'));
const EssayReviewView = lazy(() => import('../features/ai-tools/EssayReview.jsx'));
const TriSimulatorView = lazy(() => import('../features/assessments/TriSimulator.jsx'));
const TutoriaView = lazy(() => import('../features/ai-tools/Tutoria.jsx'));
const MentorshipView = lazy(() => import('../features/student/Mentorship.jsx'));
const MoodTrackerView = lazy(() => import('../features/student/MoodTracker.jsx'));
const SupportNetworkView = lazy(() => import('../features/student/SupportNetwork.jsx'));

const STUDENT_SHELL_EXTERNAL_VIEWS = {
  ReadingsView,
  RevisionsView,
  SimuladosView,
  FuvestApprovalView,
  DiscursiveAIView,
  EssayReviewView,
  TriSimulatorView,
  TutoriaView,
  MentorshipView,
  MoodTrackerView,
  SupportNetworkView,
};

export default function StudentShellPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getStoredDemoSession('aluno');

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const requestedView = searchParams.get('view');
  const initialView = requestedView || 'dashboard';
  const safeInitialView = !STUDENT_VIEW_IDS.includes(initialView) || session.hiddenStudentViews?.includes(initialView)
    ? 'dashboard'
    : initialView;

  useEffect(() => {
    if (requestedView === safeInitialView) {
      return;
    }
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', safeInitialView);
    setSearchParams(nextSearchParams, { replace: true });
  }, [requestedView, safeInitialView, searchParams, setSearchParams]);

  const handleViewChange = useCallback((nextView) => {
    if (requestedView === nextView) {
      return;
    }
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', nextView);
    setSearchParams(nextSearchParams);
  }, [requestedView, searchParams, setSearchParams]);

  return (
    <StudentShell
      initialView={safeInitialView}
      session={session}
      externalViews={STUDENT_SHELL_EXTERNAL_VIEWS}
      onViewChange={handleViewChange}
      onLogout={() => {
        clearDemoSession();
        navigate('/login');
      }}
    />
  );
}
