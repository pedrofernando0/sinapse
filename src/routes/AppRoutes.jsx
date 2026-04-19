import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';

const StudentShellLayout = lazy(() => import('../layouts/StudentShellLayout.jsx'));
const TeacherShellLayout = lazy(() => import('../layouts/TeacherShellLayout.jsx'));
const StudentShellPage = lazy(() => import('../pages/StudentShellPage.jsx'));
const TeacherShellPage = lazy(() => import('../pages/TeacherShellPage.jsx'));

const PageFallback = () => <div className="min-h-screen bg-[#050505]" />;

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student domain */}
        <Route path="/aluno" element={<StudentShellLayout />}>
          <Route index element={<StudentShellPage />} />
        </Route>

        {/* Teacher domain */}
        <Route path="/professor" element={<TeacherShellLayout />}>
          <Route index element={<TeacherShellPage />} />
        </Route>

        {/* Legacy module deep-links → redirect to shell query-param */}
        <Route path="/modulos/aprovacao-fuvest"  element={<Navigate to="/aluno?view=aprovacao-fuvest"  replace />} />
        <Route path="/modulos/discursiva-ia"     element={<Navigate to="/aluno?view=discursiva-ia"     replace />} />
        <Route path="/modulos/medidor-de-humor"  element={<Navigate to="/aluno?view=humor"             replace />} />
        <Route path="/modulos/redacao-ia-fuvest" element={<Navigate to="/aluno?view=redacao-ia-fuvest" replace />} />
        <Route path="/modulos/rede-de-apoio"     element={<Navigate to="/aluno?view=rede-de-apoio"     replace />} />
        <Route path="/modulos/simulador-tri"     element={<Navigate to="/aluno?view=simulador-tri"     replace />} />
        <Route path="/modulos/tutoria"           element={<Navigate to="/aluno?view=tutoria"           replace />} />
        <Route path="/modulos/tutoria-ia"        element={<Navigate to="/aluno?view=tutoria"           replace />} />
        <Route path="/modulos/mentoria"          element={<Navigate to="/aluno?view=mentoria"          replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
