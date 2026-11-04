const crypto = require('crypto');
const { square, LOCATION_ID } = require('./_square');

const DELIVERY_FEE = 1500;        // $15.00
const FREE_DELIVERY_AT = 10000;   // free on $100+

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const items = Array.isArray(body.items) ? body.items.slice(0, 60) : [];
    const lines = items
      .map(i => ({ id: String(i.id || ''), qty: Math.floor(Number(i.qty)) }))
      .filter(i => /^[A-Z0-9]{10,40}$/.test(i.id) && i.qty >= 1 && i.qty <= 99);
    if (!lines.length) return res.status(400).json({ error: 'Your bag is empty.' });

    const delivery = body.method === 'delivery';
    const needBy = String(body.needBy || '').slice(0, 40);
    const note = String(body.note || '').replace(/\s+/g, ' ').slice(0, 300);

    // Look up real prices from Square so nobody can change them in the browser.
    const found = await square('/catalog/batch-retrieve', { object_ids: [...new Set(lines.map(l => l.id))] });
    const price = {};
    (found.objects || []).forEach(o => {
      if (o.type === 'ITEM_VARIATION' && !o.is_deleted && o.item_variation_data.price_money) price[o.id] = o.item_variation_data.price_money.amount;
    });
    const good = lines.filter(l => price[l.id] != null);
    if (!good.length) return res.status(400).json({ error: 'Those items are no longer available.' });
    const subtotal = good.reduce((s, l) => s + price[l.id] * l.qty, 0);

    const site = (req.headers['x-forwarded-proto'] || 'https') + '://' + req.headers.host;
    const parts = ['Website order', delivery ? 'DELIVERY' : 'PICKUP'];
    if (needBy) parts.push('Needed by ' + needBy);
    if (note) parts.push('Note: ' + note);

    const checkout_options = {
      redirect_url: site + '/thank-you.html',
      merchant_support_email: 'sweetes262@gmail.com',
      ask_for_shipping_address: delivery,
      allow_tipping: false
    };
    if (delivery && subtotal < FREE_DELIVERY_AT) {
      checkout_options.shipping_fee = { name: 'Local delivery', charge: { amount: DELIVERY_FEE, currency: 'USD' } };
    }

    const link = await square('/online-checkout/payment-links', {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: LOCATION_ID,
        line_items: good.map(l => ({ catalog_object_id: l.id, quantity: String(l.qty) })),
        pricing_options: { auto_apply_taxes: true, auto_apply_discounts: true }
      },
      checkout_options,
      payment_note: parts.join(' | ').slice(0, 500)
    });
    res.status(200).json({ url: link.payment_link.url });
  } catch (e) {
    const msg = e.code === 'NO_TOKEN' ? 'Online checkout is almost ready. Please email sweetes262@gmail.com to order for now.' : 'Checkout could not start. Please try again, or email sweetes262@gmail.com.';
    res.status(e.code === 'NO_TOKEN' ? 503 : 502).json({ error: msg, detail: e.message });
  }
};
