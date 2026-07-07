export async function onRequest(context) {
  const { request, env, next } = context;
  const response = await next();
  let html = await response.text();

  try {
    let products = null;

    if (env && env.PRODUCTS_KV) {
      const raw = await env.PRODUCTS_KV.get('pyjamapink_products');
      if (raw) products = JSON.parse(raw);
    }

    if (!products) {
      const url = new URL('/api/products', request.url);
      const apiRes = await fetch(url.toString());
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (Array.isArray(data) && data.length > 0) products = data;
      }
    }

    if (products && products.length > 0) {
      const script = '<script>window.__INITIAL_PRODUCTS__ = ' + JSON.stringify(products) + ';</script>';
      html = html.replace('</head>', script + '</head>');
    }
  } catch (e) {
    // fallback silencieux
  }

  return new Response(html, {
    status: response.status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}
