import { useOutletContext } from 'react-router-dom';
import TeacherShell from '../features/teacher/TeacherShell.jsx';

export default function TeacherShellPage() {
  const { session, safeInitialView, onViewChange, onLogout } = useOutletContext();

  return (
    <TeacherShell
      initialView={safeInitialView}
      session={session}
      onViewChange={onViewChange}
      onLogout={onLogout}
    />
  );
}
