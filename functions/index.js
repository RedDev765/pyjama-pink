// Serve index.html with products injected directly from KV (no client-side fetch needed)
export async function onRequest(context) {
  const { request, env } = context;
  const response = await context.next();
  let html = await response.text();

  // Get products from KV and inject as a global variable
  try {
    const raw = await env.PRODUCTS_KV.get('pyjamapink_products');
    const products = raw ? JSON.parse(raw) : [];
    const script = '<script>window.__INITIAL_PRODUCTS__ = ' + JSON.stringify(products) + ';</script>';
    html = html.replace('</head>', script + '</head>');
  } catch (e) {
    // If KV fails, products will be loaded from localStorage fallback
  }

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