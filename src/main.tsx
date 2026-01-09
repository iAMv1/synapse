import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Static imports for critical path (Landing, Auth, Layout)
import LandingPage from './app/routes/_index';
import AppLayout from './app/routes/_app';
import { Login } from './features/auth/Login';
import { AuthProvider } from './components/providers/AuthProvider';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/ToastContainer';

// Lazy load non-critical routes for code splitting
const DashboardPage = React.lazy(() => import('./app/routes/dashboard'));
const BrainPage = React.lazy(() => import('./app/routes/brain'));
const RoomsPage = React.lazy(() => import('./app/routes/rooms'));
const SkillsPage = React.lazy(() => import('./app/routes/skills'));

import { TerminalLoader } from './components/ui/TerminalLoader';

// Loading fallback for lazy-loaded routes
const LoadingFallback = () => <TerminalLoader variant="fullscreen" />;

const queryClient = new QueryClient();

// Protected route wrapper - only initializes auth for /app routes
const ProtectedAppLayout = () => (
  <AuthProvider>
    <AppLayout />
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,  // No auth check - renders instantly
  },
  {
    path: '/login',
    element: <Login />,  // No auth check - renders instantly
  },
  {
    path: '/auth',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/app',
    element: <ProtectedAppLayout />,  // Auth only for protected routes
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'brain',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <BrainPage />
          </Suspense>
        ),
      },
      {
        path: 'rooms',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RoomsPage />
          </Suspense>
        ),
      },
      {
        path: 'skills',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SkillsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <ToastContainer />
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
);

