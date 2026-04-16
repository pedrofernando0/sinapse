import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import {
  loadStudentShellPage,
  loadTeacherShellPage,
} from './lib/pageLoaders.js';

const StudentShellPage = lazy(loadStudentShellPage);
const TeacherShellPage = lazy(loadTeacherShellPage);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505]" />
      }
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aluno" element={<StudentShellPage />} />
        <Route path="/professor" element={<TeacherShellPage />} />

        <Route path="/modulos/aprovacao-fuvest" element={<Navigate to="/aluno?view=aprovacao-fuvest" replace />} />
        <Route path="/modulos/discursiva-ia" element={<Navigate to="/aluno?view=discursiva-ia" replace />} />
        <Route path="/modulos/medidor-de-humor" element={<Navigate to="/aluno?view=humor" replace />} />
        <Route path="/modulos/redacao-ia-fuvest" element={<Navigate to="/aluno?view=redacao-ia-fuvest" replace />} />
        <Route path="/modulos/rede-de-apoio" element={<Navigate to="/aluno?view=rede-de-apoio" replace />} />
        <Route path="/modulos/simulador-tri" element={<Navigate to="/aluno?view=simulador-tri" replace />} />
        <Route path="/modulos/tutoria" element={<Navigate to="/aluno?view=tutoria" replace />} />
        <Route path="/modulos/tutoria-ia" element={<Navigate to="/aluno?view=tutoria" replace />} />
        <Route path="/modulos/mentoria" element={<Navigate to="/aluno?view=mentoria" replace />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
