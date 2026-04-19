export const getInitialUiState = () => ({
  studentSidebarOpen: false,
  teacherSidebarOpen: false,
});

export const createUiSlice = (set) => ({
  ...getInitialUiState(),
  setStudentSidebarOpen: (open) =>
    set({
      studentSidebarOpen: Boolean(open),
    }),
  setTeacherSidebarOpen: (open) =>
    set({
      teacherSidebarOpen: Boolean(open),
    }),
  closeAllSidebars: () =>
    set({
      studentSidebarOpen: false,
      teacherSidebarOpen: false,
    }),
});
