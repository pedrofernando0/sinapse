import AppRoutes from './routes/AppRoutes.jsx';
import { StoreBootstrap } from './store/index.js';

export default function App() {
  return (
    <>
      <StoreBootstrap />
      <AppRoutes />
    </>
  );
}
