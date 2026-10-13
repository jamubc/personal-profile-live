import './fonts';
import './index.css';
import { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { App } from './App';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { preloadRoute } from './lib/route-cache';

const container = document.getElementById('root')!;

const tree = (
  <StrictMode>
    <RouteErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </BrowserRouter>
    </RouteErrorBoundary>
    <Analytics />
  </StrictMode>
);

// Load the current route's chunk and data first, so hydration matches the prerendered HTML exactly.
preloadRoute(window.location.pathname)
  .catch(() => undefined)
  .then(() => {
    if (container.childElementCount > 0) hydrateRoot(container, tree);
    else createRoot(container).render(tree);
  });
