import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { DashboardPage } from './routes/dashboard-page';
import { LoginPage } from './routes/login-page';
import { RegisterPage } from './routes/register-page';
import { RedirectIfAuthed, RequireAuth } from './features/auth/components/require-auth';
import { queryClient } from './lib/query-client';
import './index.css';

// React Router 7 — `v7_relativeSplatPath` is now the default behaviour, so no
// future flags are needed. Upgraded from 6.30.6 to 7.x to clear two advisories
// (open redirect via `Link`/`useNavigate`, and SSR hydration deserialization).
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, loader: () => redirect('/dashboard') },

      // Protected. The guard is a convenience redirect only — the API enforces
      // authorization server-side (architecture §36, PRD §33).
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        ),
      },

      // Public entry points. RedirectIfAuthed keeps a signed-in user off them.
      {
        path: 'login',
        element: (
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        ),
      },
      {
        path: 'register',
        element: (
          <RedirectIfAuthed>
            <RegisterPage />
          </RedirectIfAuthed>
        ),
      },
    ],
  },
]);

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found.');
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
