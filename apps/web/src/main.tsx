import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
import { DashboardPage } from './routes/dashboard-page';
import { queryClient } from './lib/query-client';
import './index.css';

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