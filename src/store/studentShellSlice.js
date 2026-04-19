export const DEFAULT_STUDENT_USER = Object.freeze({
  level: 12,
  name: 'Diogo Medrado',
  turma: 'Extensivo',
  xp: 1250,
});

export const getInitialStudentShellState = () => ({
  studentAllowedViews: [],
  studentCurrentView: 'dashboard',
  studentHiddenViews: [],
  studentUser: DEFAULT_STUDENT_USER,
});

export const getHiddenStudentViews = (session) =>
  session?.hiddenStudentViews ?? [];

export const buildStudentUser = ({ session = null, user = null } = {}) => ({
  ...DEFAULT_STUDENT_USER,
  ...(session?.name ? { name: session.name } : {}),
  ...(user?.fullName ? { name: user.fullName } : {}),
});

export const sanitizeStudentShellView = ({
  allowedViews = [],
  fallbackView = 'dashboard',
  hiddenViews = [],
  view,
}) => {
  if (!view || hiddenViews.includes(view)) {
    return fallbackView;
  }

  if (allowedViews.length > 0 && !allowedViews.includes(view)) {
    return fallbackView;
  }

  return view;
};

export const createStudentShellSlice = (set, get) => ({
  initializeStudentShell: ({
    allowedViews = [],
    initialView = 'dashboard',
    session = null,
    user = null,
  } = {}) => {
    const hiddenViews = getHiddenStudentViews(session);

    set({
      studentAllowedViews: allowedViews,
      studentCurrentView: sanitizeStudentShellView({
        allowedViews,
        hiddenViews,
        view: initialView,
      }),
      studentHiddenViews: hiddenViews,
      studentUser: buildStudentUser({ session, user }),
    });
  },
  navigateStudentShell: (nextView) => {
    const { studentAllowedViews, studentHiddenViews } = get();

    set({
      studentCurrentView: sanitizeStudentShellView({
        allowedViews: studentAllowedViews,
        hiddenViews: studentHiddenViews,
        view: nextView,
      }),
      studentSidebarOpen: false,
    });
  },
  addStudentXp: (amount) => {
    const currentUser = get().studentUser;
    const nextXp = currentUser.xp + amount;

    set({
      studentUser: {
        ...currentUser,
        level: Math.floor(nextXp / 100) + 1,
        xp: nextXp,
      },
    });
  },
  resetStudentShellState: () => {
    set(getInitialStudentShellState());
  },
});
