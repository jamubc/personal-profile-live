import { Component } from 'react';
import type { ReactNode } from 'react';

interface State {
  failed: boolean;
}

const RETRY_KEY = 'route-reload';

/**
 * Catches a sheet that failed to load during client navigation (typically a tab left open across a
 * deploy, whose chunk names no longer exist). Every route is prerendered, so the first response is a
 * full page load of the same URL; only if that already happened in the last half minute does it show
 * the reload screen. Back and Forward clear the error, since the other sheets are already loaded.
 */
export class RouteErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidMount() {
    window.addEventListener('popstate', this.reset);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.reset);
  }

  componentDidCatch(error: Error) {
    console.error(error);
    let last = 0;
    try {
      last = Number(sessionStorage.getItem(RETRY_KEY) ?? 0);
      sessionStorage.setItem(RETRY_KEY, String(Date.now()));
    } catch {
      return; // no storage: no loop guard, so do not reload automatically
    }
    if (Date.now() - last > 30_000) window.location.reload();
  }

  reset = () => {
    if (this.state.failed) this.setState({ failed: false });
  };

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
