import { useAuthBootstrap } from '../lib/useAuth.js';
export { useAppStore } from './appStore.js';

export function StoreBootstrap() {
  useAuthBootstrap();
  return null;
}
