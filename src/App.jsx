import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthBootstrap } from './lib/useAuth.js';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <>
      <AuthBootstrap />
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
