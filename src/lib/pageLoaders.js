export const loadStudentShellPage = () => import('../pages/StudentShellPage.jsx');
export const loadTeacherShellPage = () => import('../pages/TeacherShellPage.jsx');

export function preloadShellPage(profile) {
  if (profile === 'professor') {
    return loadTeacherShellPage();
  }

  return loadStudentShellPage();
}
