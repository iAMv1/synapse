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

// Loading fallback for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500" />
      <span className="text-sm text-white/50">Loading...</span>
    </div>
  </div>
);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/app',
    element: <AppLayout />,
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
      <AuthProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
          <ToastContainer />
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

