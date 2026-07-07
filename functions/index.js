export async function onRequest(context) {
  const { request, next } = context;
  const response = await next();
  let html = await response.text();

  try {
    const url = new URL('/api/products', request.url);
    const apiRes = await fetch(url.toString());
    if (apiRes.ok) {
      const products = await apiRes.json();
      if (Array.isArray(products) && products.length > 0) {
        const script = '<script>window.__INITIAL_PRODUCTS__ = ' + JSON.stringify(products) + ';</script>';
        html = html.replace('</head>', script + '</head>');
      }
    }
  } catch (e) {}

  return new Response(html, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
