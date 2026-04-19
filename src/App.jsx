import AppRoutes from './routes/AppRoutes.jsx';
import { AppErrorBoundary } from './components/AppErrorBoundary.jsx';
import { StoreBootstrap } from './store/index.js';

export default function App() {
  return (
    <AppErrorBoundary>
      <StoreBootstrap />
      <AppRoutes />
    </AppErrorBoundary>
  );
}
