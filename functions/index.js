// Serve index.html with no-cache headers to force fresh load on all devices
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Only handle the root path
  if (url.pathname !== '/') {
    return env.ASSETS.fetch(request);
  }

  const response = await env.ASSETS.fetch(request);
  const html = await response.text();

  return new Response(html, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}
