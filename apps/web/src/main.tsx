import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { DashboardPage } from './routes/dashboard-page';
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
      { path: 'dashboard', element: <DashboardPage /> },
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