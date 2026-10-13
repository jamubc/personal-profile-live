import { Component } from 'react';
import type { ReactNode } from 'react';

interface State {
  failed: boolean;
}

/** Catches a failed route chunk (for example a stale tab after a deploy) and offers a reload. */
export class RouteErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main id="main" className="mx-auto max-w-measure px-4 py-24">
        <h1 className="t-h1">This sheet failed to load</h1>
        <p className="t-lead mt-4">The site may have been updated while this tab was open. Reloading should fix it.</p>
        <button type="button" className="btn btn-primary btn-lg mt-8" onClick={() => window.location.reload()}>
          Reload
        </button>
      </main>
    );
  }
}
