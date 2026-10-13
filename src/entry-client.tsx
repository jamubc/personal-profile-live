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
// If that load fails (a flaky network, or a deploy between the HTML and its chunks), the prerendered
// page is complete and readable, so it is left as it is rather than replaced by an error screen.
preloadRoute(window.location.pathname).then(
  () => {
    if (container.childElementCount > 0) hydrateRoot(container, tree);
    else createRoot(container).render(tree);
  },
  (error: unknown) => {
    console.error(error);
    if (container.childElementCount === 0) createRoot(container).render(tree);
  },
);
