import { Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
import { SeoContext, renderHead } from './lib/seo';
import type { Seo } from './lib/seo';
import { preloadRoute } from './lib/route-cache';

export { checkRegistry, llmsTxt, prerenderPaths, sitemapXml } from './seo/generate';

/** Render one route to static markup plus its <head> tags. Used by scripts/prerender.mjs. */
export async function render(url: string): Promise<{ html: string; head: string; seo: Seo | null }> {
  await preloadRoute(url);
  let seo: Seo | null = null;
  const html = renderToString(
    <SeoContext.Provider
      value={{
        collect: (s) => {
          seo = s;
        },
      }}
    >
      <StaticRouter location={url}>
        {/* Same boundary as the client tree: hydration needs the matching Suspense markers in the markup. */}
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </StaticRouter>
    </SeoContext.Provider>,
  );
  return { html, head: seo ? renderHead(seo) : '', seo };
}
