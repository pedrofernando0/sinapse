import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppErrorBoundary } from './components/AppErrorBoundary.jsx';
import { AuthBootstrap } from './lib/useAuth.js';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthBootstrap />
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </AppErrorBoundary>
  );
}
