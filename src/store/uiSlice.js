export const createUiSlice = (set) => ({
  studentSidebarOpen: false,
  teacherSidebarOpen: false,
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
