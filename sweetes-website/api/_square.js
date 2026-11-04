// Shared helpers for talking to Erin's Square account.
// The access key lives in Vercel as SQUARE_ACCESS_TOKEN (never in this code).

const SQUARE_BASE = 'https://connect.squareup.com/v2';
const SQUARE_VERSION = '2025-01-23';
const LOCATION_ID = 'L88844CHX7SJF'; // Sweet Es Homemade Confections, Waukesha

async function square(path, body) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) { const e = new Error('Square key is not set up yet'); e.code = 'NO_TOKEN'; throw e; }
  const res = await fetch(SQUARE_BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Authorization': 'Bearer ' + token, 'Square-Version': SQUARE_VERSION, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) { const e = new Error((data.errors && data.errors[0] && data.errors[0].detail) || 'Square error'); e.status = res.status; throw e; }
  return data;
}

async function listAll(types) {
  let cursor, out = [];
  do {
    const q = '/catalog/list?types=' + encodeURIComponent(types) + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
    const d = await square(q);
    out = out.concat(d.objects || []);
    cursor = d.cursor;
  } while (cursor);
  return out;
}

// Turn raw catalog objects into the menu the website shows.
function buildMenu(objects, seasonCategory) {
  const cats = {}, images = {};
  objects.forEach(o => {
    if (o.type === 'CATEGORY' && !o.is_deleted) cats[o.id] = (o.category_data.name || '').trim().toLowerCase();
    if (o.type === 'IMAGE' && o.image_data && o.image_data.url) images[o.id] = o.image_data.url;
  });
  const season = (seasonCategory || '').toLowerCase();
  const sections = { season: [], boxes: [], treats: [] };

  objects.forEach(o => {
    if (o.type !== 'ITEM' || o.is_deleted) return;
    const d = o.item_data;
    if (d.is_archived || d.ecom_visibility !== 'VISIBLE') return;
    const names = (d.categories || []).map(c => cats[c.id]).filter(Boolean);
    const variations = (d.variations || [])
      .filter(v => !v.is_deleted && v.item_variation_data.sellable !== false && v.item_variation_data.price_money)
      .map(v => ({ id: v.id, name: v.item_variation_data.name, price: v.item_variation_data.price_money.amount }));
    if (!variations.length) return;
    const item = {
      id: o.id,
      name: d.name,
      description: (d.description_plaintext || '').trim(),
      image: (d.image_ids || []).map(id => images[id]).find(Boolean) || null,
      variations
    };
    if (season && names.includes(season)) sections.season.push(item);
    else if (names.includes('all the time')) (names.includes('box sets') ? sections.boxes : sections.treats).push(item);
  });
  return sections;
}

module.exports = { square, listAll, buildMenu, LOCATION_ID };
