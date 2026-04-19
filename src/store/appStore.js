import { create } from 'zustand';
import {
  createSessionSlice,
  getInitialSessionState,
} from './sessionSlice.js';
import { createUiSlice, getInitialUiState } from './uiSlice.js';
import {
  createStudentShellSlice,
  getInitialStudentShellState,
} from './studentShellSlice.js';
import {
  createTeacherShellSlice,
  getInitialTeacherShellState,
} from './teacherShellSlice.js';

const buildInitialState = () => ({
  ...getInitialSessionState(),
  ...getInitialUiState(),
  ...getInitialStudentShellState(),
  ...getInitialTeacherShellState(),
});

export const useAppStore = create((set, get) => ({
  ...buildInitialState(),
  ...createSessionSlice(set, get),
  ...createUiSlice(set, get),
  ...createStudentShellSlice(set, get),
  ...createTeacherShellSlice(set, get),
  resetAppState: () => {
    set(buildInitialState());
  },
}));
