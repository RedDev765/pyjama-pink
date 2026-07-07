const SUPABASE_URL = 'https://opjplhklqnndjceacvqn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanBsaGtscW5uZGpjZWFjdnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MzQ2OTIsImV4cCI6MjA5OTAxMDY5Mn0.NXuzjoMtu25WZOarR3X6jVfdBDLyNycftM56-79tHkg';

const STORAGE_KEY = 'pyjamapink_products';

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Pyjama Feuilles Corail', category: 'pyjama', price: 149, stock: 6, photo: 'https://images.unsplash.com/photo-1770294758981-484ef12c1815?w=500&h=625&fit=crop', desc: 'Matinées douces et brunchs tranquilles. Coupe classique, tissu léger et respirant parfait pour traîner à la maison.' },
  { id: 'p2', name: 'Pyjama Pêche Douceur', category: 'pyjama', price: 149, stock: 4, photo: 'https://images.unsplash.com/photo-1766056278948-dbb10f6d82bf?w=500&h=625&fit=crop', desc: 'Une teinte pêche qui illumine le quotidien. Col rond, manches courtes, idéal pour les soirées d\'été.' },
  { id: 'p3', name: 'Pyjama Zébrures Bordeaux', category: 'pyjama', price: 149, stock: 3, photo: 'https://images.unsplash.com/photo-1766056278825-55168658f120?w=500&h=625&fit=crop', desc: 'Motif zébrure raffiné sur fond bordeaux. Coupe moderne, confortable, pour celles qui aiment le style sans sacrifier le confort.' },
  { id: 'p6', name: 'Pyjama Papillons Mauve', category: 'pyjama', price: 149, stock: 5, photo: 'https://images.unsplash.com/photo-1768696082668-411638a55476?w=500&h=625&fit=crop', desc: 'Imprimé papillons délicat sur fond mauve. Short assorti, tissu tout doux pour des nuits paisibles.' },
  { id: 'p7', name: 'Pyjama Cheval Ocre', category: 'pyjama', price: 149, stock: 4, photo: 'https://images.unsplash.com/photo-1767785829300-28722d89e696?w=500&h=625&fit=crop', desc: 'Motif cheval bohème aux teintes ocres. Un pyjama qui sort de l\'ordinaire, pour les soirées à la cool.' },
  { id: 'p8', name: 'Pyjama Noeuds Ciel', category: 'pyjama', price: 149, stock: 3, photo: 'https://images.unsplash.com/photo-1770294760762-1cd821ecc567?w=500&h=625&fit=crop', desc: 'Petits noeuds célestes sur fond bleu ciel. Ensemble chemise-short, léger et aérien.' },
  { id: 'p4', name: 'Ensemble Dentelle Nuit', category: 'lingerie', price: 290, stock: 5, photo: 'https://images.unsplash.com/photo-1624035203840-8121a20672d5?w=500&h=625&fit=crop', desc: 'Ensemble dentelle noir intemporel. Soutien-gorge triangle ajustable et shorty taille haute. Pour se sentir belle en toute intimité.' },
  { id: 'p5', name: 'Nuisette Satin Élégance', category: 'lingerie', price: 340, stock: 2, photo: 'https://images.unsplash.com/photo-1584061554353-f8c337f5dbb9?w=500&h=625&fit=crop', desc: 'Nuisette en satin brillant, bretelles fines réglables. Tombe fluide sur le corps, idéale pour les occasions spéciales.' },
  { id: 'p9', name: 'Ensemble Rétro Chic', category: 'lingerie', price: 310, stock: 4, photo: 'https://images.unsplash.com/photo-1620228757753-b28dacf3015a?w=500&h=625&fit=crop', desc: 'Inspiration rétro avec une touche moderne. Dentelle fleurie, coupe taille haute, soutien-gorge à armatures.' },
  { id: 'p10', name: 'Body Dentelle Fine', category: 'lingerie', price: 260, stock: 3, photo: 'https://images.unsplash.com/photo-1599839770015-53df36f312a8?w=500&h=625&fit=crop', desc: 'Body en dentelle fine, fermeture à pression. Parfait sous un chemisier ou porté seul. Confortable et élégant.' },
  { id: 'p11', name: 'Ensemble Tulle Doré', category: 'lingerie', price: 355, stock: 2, photo: 'https://images.unsplash.com/photo-1560011081-a5dbd7c6b1d2?w=500&h=625&fit=crop', desc: 'Ensemble tulle avec accents dorés. Soutien-gorge corbeille et string assorti. Pour les soirées où on veut briller.' },
  { id: 'p12', name: 'Nuisette Minimaliste', category: 'lingerie', price: 245, stock: 4, photo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=625&fit=crop', desc: 'Nuisette minimaliste en microfibre douce. Coupe épurée, confort absolu. L\'essentiel pour se sentir bien.' },
];

function supabaseHeaders() {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };
}

async function getProducts() {
  const url = SUPABASE_URL + '/rest/v1/store?key=eq.' + STORAGE_KEY + '&select=value';
  const res = await fetch(url, { headers: supabaseHeaders() });
  if (res.ok) {
    const rows = await res.json();
    if (rows.length > 0 && rows[0].value && rows[0].value.length > 0) {
      return rows[0].value;
    }
  }
  await saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

async function saveProducts(products) {
  const url = SUPABASE_URL + '/rest/v1/store';
  await fetch(url, {
    method: 'POST',
    headers: Object.assign({}, supabaseHeaders(), { 'Prefer': 'resolution=merge-duplicates' }),
    body: JSON.stringify({ key: STORAGE_KEY, value: products })
  });
}

function jsonResponse(data, status) {
  if (status === undefined) status = 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // POST /api/products/reorder — batch save
  if (method === 'POST' && path === '/api/products/reorder') {
    const body = await request.json();
    if (!Array.isArray(body)) return jsonResponse({ error: 'invalid body' }, 400);
    await saveProducts(body);
    return jsonResponse({ ok: true, count: body.length });
  }

  // GET /api/products — list all
  if (method === 'GET' && path === '/api/products') {
    const products = await getProducts();
    return jsonResponse(products);
  }

  // POST /api/products — create
  if (method === 'POST' && path === '/api/products') {
    const body = await request.json();
    const products = await getProducts();
    products.push(body);
    await saveProducts(products);
    return jsonResponse(body, 201);
  }

  // PUT /api/products/:id — update
  const putMatch = path.match(/^\/api\/products\/(.+)$/);
  if (method === 'PUT' && putMatch) {
    const id = putMatch[1];
    const body = await request.json();
    let products = await getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return jsonResponse({ error: 'not found' }, 404);
    products[idx] = Object.assign({}, products[idx], body, { id: id });
    await saveProducts(products);
    return jsonResponse(products[idx]);
  }

  // DELETE /api/products/:id — delete
  if (method === 'DELETE' && putMatch) {
    const id = putMatch[1];
    let products = await getProducts();
    products = products.filter(p => p.id !== id);
    await saveProducts(products);
    return jsonResponse({ ok: true });
  }

  // GET /api/seed — re-seed to defaults
  if (method === 'GET' && path === '/api/seed') {
    await saveProducts(DEFAULT_PRODUCTS);
    return jsonResponse({ ok: true, count: DEFAULT_PRODUCTS.length });
  }

  // POST /api/upload — store photo as URL reference
  if (method === 'POST' && path === '/api/upload') {
    const { id, photo } = await request.json();
    if (!id || !photo) return jsonResponse({ error: 'missing id or photo' }, 400);
    const purl = SUPABASE_URL + '/rest/v1/product_photos';
    const pres = await fetch(purl, {
      method: 'POST',
      headers: Object.assign({}, supabaseHeaders(), { 'Prefer': 'resolution=merge-duplicates' }),
      body: JSON.stringify({ id: id, photo: photo })
    });
    if (!pres.ok) return jsonResponse({ error: 'upload failed' }, 500);
    return jsonResponse({ url: '/api/photo/' + id });
  }

  // GET /api/photo/:id — serve stored photo
  const photoMatch = path.match(/^\/api\/photo\/(.+)$/);
  if (method === 'GET' && photoMatch) {
    const id = photoMatch[1];
    const purl = SUPABASE_URL + '/rest/v1/product_photos?id=eq.' + id + '&select=photo';
    const pres = await fetch(purl, { headers: supabaseHeaders() });
    if (!pres.ok) return jsonResponse({ error: 'not found' }, 404);
    const rows = await pres.json();
    if (rows.length === 0) return jsonResponse({ error: 'not found' }, 404);
    const raw = rows[0].photo;
    const comma = raw.indexOf(',');
    const b64 = comma >= 0 ? raw.slice(comma + 1) : raw;
    const binary = Uint8Array.from(atob(b64), function(c) { return c.charCodeAt(0); });
    return new Response(binary, {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000' }
    });
  }

  return jsonResponse({ error: 'not found' }, 404);
}
