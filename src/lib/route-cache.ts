/**
 * Route chunk and data cache (design spec 9.2). React.lazy cannot be prerendered with renderToString,
 * so routes load through this cache: the server and the client both await preloadRoute() before
 * rendering, and the route gate reads the result synchronously.
 */
export async function preloadRoute(_pathname: string): Promise<void> {
  // Implemented together with src/routes.tsx.
}
