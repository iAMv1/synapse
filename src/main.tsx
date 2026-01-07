import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

// Routes
import LandingPage from './app/routes/_index';
import AppLayout from './app/routes/_app';
import DashboardPage from './app/routes/dashboard';
import BrainPage from './app/routes/brain';
import RoomsPage from './app/routes/rooms';
import SkillsPage from './app/routes/skills';
import { Login } from './features/auth/Login';
import { AuthProvider } from './components/providers/AuthProvider';

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
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'brain',
        element: <BrainPage />,
      },
      {
        path: 'rooms',
        element: <RoomsPage />,
      },
      {
        path: 'skills',
        element: <SkillsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
