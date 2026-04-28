// Cloudflare Pages Functions — catch-all worker
// Handles SPA routing by serving index.html for all non-asset paths

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Let asset requests (js, css, images, etc.) pass through to static files
  const assetExtensions = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|map|txt|webmanifest)$/;
  if (assetExtensions.test(url.pathname)) {
    return env.ASSETS.fetch(request);
  }

  // For all other paths, serve index.html (SPA client-side routing)
  const assetUrl = new URL('/index.html', request.url);
  return env.ASSETS.fetch(new Request(assetUrl, request));
}
