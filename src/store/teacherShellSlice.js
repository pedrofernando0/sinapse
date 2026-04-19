export const getInitialTeacherShellState = () => ({
  selectedTeacherStudentId: null,
  teacherAllowedViews: [],
  teacherCurrentView: 'overview',
});

export const sanitizeTeacherShellView = ({
  allowedViews = [],
  fallbackView = 'overview',
  view,
}) => {
  if (!view) {
    return fallbackView;
  }

  if (allowedViews.length > 0 && !allowedViews.includes(view)) {
    return fallbackView;
  }

  return view;
};

export const createTeacherShellSlice = (set) => ({
  initializeTeacherShell: ({
    allowedViews = [],
    initialView = 'overview',
    students = [],
  } = {}) => {
    set({
      selectedTeacherStudentId: students[0]?.id ?? null,
      teacherAllowedViews: allowedViews,
      teacherCurrentView: sanitizeTeacherShellView({
        allowedViews,
        view: initialView,
      }),
    });
  },
  navigateTeacherShell: (nextView) => {
    set((state) => ({
      teacherCurrentView: sanitizeTeacherShellView({
        allowedViews: state.teacherAllowedViews,
        view: nextView,
      }),
      teacherSidebarOpen: false,
    }));
  },
  setSelectedTeacherStudentId: (selectedTeacherStudentId) => {
    set({
      selectedTeacherStudentId,
    });
  },
  resetTeacherShellState: () => {
    set(getInitialTeacherShellState());
  },
});
