import { lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import StudentShell from '../features/student/StudentShell.jsx';

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
  const { session, safeInitialView, onViewChange, onLogout } = useOutletContext();

  return (
    <StudentShell
      initialView={safeInitialView}
      session={session}
      externalViews={STUDENT_SHELL_EXTERNAL_VIEWS}
      onViewChange={onViewChange}
      onLogout={onLogout}
    />
  );
}
