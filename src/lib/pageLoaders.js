export const loadStudentShellPage = () =>
  Promise.all([
    import('../layouts/StudentShellLayout.jsx'),
    import('../pages/StudentShellPage.jsx'),
  ]);

export const loadTeacherShellPage = () =>
  Promise.all([
    import('../layouts/TeacherShellLayout.jsx'),
    import('../pages/TeacherShellPage.jsx'),
  ]);

export function preloadShellPage(profile) {
  if (profile === 'professor') {
    return loadTeacherShellPage();
  }

  return loadStudentShellPage();
}
