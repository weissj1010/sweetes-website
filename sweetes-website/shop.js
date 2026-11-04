(function () {
  var s = SEASONS[ACTIVE_SEASON] || SEASONS.everyday;
  Object.keys(s.colors).forEach(function (k) { document.documentElement.style.setProperty('--' + k, s.colors[k]); });
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(c) { return '$' + (c / 100).toFixed(2); }
  $('banner').textContent = s.banner;
  $('year').textContent = new Date().getFullYear();

  /* My own photos win over the Square ones when we have them. */
  var PHOTOS = {
    'buckeyes': 'images/products/buckeyes.jpg',
    'nellas': 'images/products/nellas.jpg',
    'nonpareils': 'images/products/nonpareils.jpg',
    '3 pack vanilla wafers': 'images/products/vanilla-wafers.jpg',
    'or-e-os': 'images/products/or-e-os.jpg',
    'mini peanut butter puddles': 'images/products/peanut-butter-puddles.jpg',
    'turtles (pecan or cashew)': 'images/products/turtles.jpg',
    'gummy bears': 'images/products/gummy-bears.jpg',
    'sea salt caramels': 'images/products/sea-salt-caramels.jpg',
    'kissed cookie': 'images/products/kissed-cookie.jpg',
    'graham cracker': 'images/products/graham-cracker.jpg',
    'malted milk balls': 'images/products/malted-milk-balls.jpg',
    '2 pack large pretzel rods': 'images/products/pretzel-rods.jpg',
    'signature favorites box': 'images/products/signature-favorites-box.jpg',
    'chocolate lovers box': 'images/products/chocolate-lovers-box.jpg',
    'sampler box': 'images/products/sampler-box.jpg',
    'strawberries': 'images/products/strawberries.jpg',
    'soft caramel gems': 'images/products/soft-caramel-gems.jpg',
    'mini rice krispie': 'images/products/mini-rice-krispie.jpg',
    'bare peanut brittle 6oz': 'images/products/bare-peanut-brittle.jpg',
    'drizzled pecan brittle - 1lb': 'images/products/drizzled-pecan-brittle-1lb.jpg',
    'bare pecan brittle 6oz': 'images/products/bare-pecan-brittle.jpg',
    'drizzle pecan brittle 10oz': 'images/products/drizzle-pecan-brittle-10oz.jpg',
    'pretzel bits': 'images/products/pretzel-bits.jpg',
    'turtles & caramels': 'images/products/turtles-and-caramels.jpg',
    'rudolph': 'images/christmas/rudolph.jpg',
    'lump of coal': 'images/christmas/lump-of-coal.jpg',
    'solid ornament - round': 'images/christmas/ornament-round.jpg',
    'gingerbread sucker': 'images/christmas/gingerbread-sucker.jpg',
    'christmas tree sucker': 'images/christmas/tree-sucker.jpg',
    'present sucker': 'images/christmas/present-sucker.jpg',
    'xl happy holidays bar': 'images/christmas/plaque-happy-holidays.jpg',
    'seasons greetings bar': 'images/christmas/plaque-seasons-greetings.jpg',
    'merry christmas bar': 'images/christmas/plaque-merry-christmas.jpg',
    'noel bar': 'images/christmas/plaque-noel.jpg'
  };
  var hide = (typeof HIDE_ITEMS !== 'undefined' ? HIDE_ITEMS : []).map(function (n) { return n.toLowerCase(); });

  function clean(name) { return name.replace(/"/g, ''); }
  function split(name) {
    var n = clean(name), i = n.lastIndexOf(' - ');
    if (i > 0 && /assorted|all dark|all milk/i.test(n.slice(i + 3))) return [n.slice(0, i), n.slice(i + 3)];
    return [n, ''];
  }
  function photo(item) { return PHOTOS[clean(item.name).toLowerCase()] || item.image || null; }

  /* ---------- bag (kept in this browser only) ---------- */
  var KEY = 'sweetes-bag-v1', bag = [];
  try { bag = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { bag = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} }

  function add(entry) {
    var hit = bag.find(function (b) { return b.id === entry.id; });
    if (hit) hit.qty = Math.min(99, hit.qty + entry.qty); else bag.push(entry);
    save(); renderBag(); toast(entry.qty + ' x ' + entry.name + ' added to your bag');
  }

  function renderBag() {
    var count = bag.reduce(function (n, b) { return n + b.qty; }, 0);
    $('bag-count').textContent = count;
    $('bag-empty').hidden = bag.length > 0;
    $('bag-options').hidden = bag.length === 0;
    $('bag-foot').hidden = bag.length === 0;
    $('bag-list').innerHTML = bag.map(function (b, i) {
      return '<li class="bag-item">' +
        (b.img ? '<img src="' + esc(b.img) + '" alt="">' : '<span class="ph"></span>') +
        '<div class="bi-text"><p class="bi-name">' + esc(b.name) + '</p><p class="bi-var">' + esc(b.variation) + '</p>' +
        '<div class="qty small"><button type="button" data-dec="' + i + '" aria-label="One less">&minus;</button><span>' + b.qty + '</span><button type="button" data-inc="' + i + '" aria-label="One more">+</button></div></div>' +
        '<div class="bi-right"><p class="bi-price">' + money(b.price * b.qty) + '</p><button type="button" class="link-btn" data-rm="' + i + '">Remove</button></div></li>';
    }).join('');
    var sub = bag.reduce(function (n, b) { return n + b.price * b.qty; }, 0);
    $('bag-subtotal').textContent = money(sub);
    var delivery = $('method-delivery').checked;
    $('bag-delivery-row').hidden = !delivery;
    $('bag-delivery').textContent = sub >= 10000 ? 'Free' : '$15.00';
    $('delivery-price').textContent = sub >= 10000 ? 'Free' : '$15';
  }

  $('bag-list').addEventListener('click', function (e) {
    var t = e.target, i;
    if ((i = t.getAttribute('data-inc')) != null) bag[i].qty = Math.min(99, bag[i].qty + 1);
    else if ((i = t.getAttribute('data-dec')) != null) { bag[i].qty -= 1; if (bag[i].qty < 1) bag.splice(i, 1); }
    else if ((i = t.getAttribute('data-rm')) != null) bag.splice(i, 1);
    else return;
    save(); renderBag();
  });
  ['method-pickup', 'method-delivery'].forEach(function (id) { $(id).addEventListener('change', renderBag); });

  var drawer = $('drawer');
  function openBag() { $('toast').classList.remove('show'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); document.body.classList.add('no-scroll'); }
  function closeBag() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); document.body.classList.remove('no-scroll'); }
  $('bag-open').addEventListener('click', openBag);
  drawer.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeBag(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBag(); });

  var tt;
  function toast(msg) {
    var el = $('toast'); el.innerHTML = esc(msg) + ' <button type="button" class="link-btn" id="toast-view">View bag</button>';
    el.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('show'); }, 3200);
    $('toast-view').onclick = function () { el.classList.remove('show'); openBag(); };
  }

  $('checkout').addEventListener('click', function () {
    var btn = this, msg = $('checkout-msg');
    btn.disabled = true; btn.textContent = 'Opening checkout...'; msg.textContent = '';
    fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: bag.map(function (b) { return { id: b.id, qty: b.qty }; }),
        method: $('method-delivery').checked ? 'delivery' : 'pickup',
        needBy: $('need-by').value, note: $('order-note').value
      })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (r) {
        if (r.ok && r.d.url) { window.location.href = r.d.url; return; }
        throw new Error(r.d.error || 'Checkout could not start.');
      })
      .catch(function (err) {
        msg.textContent = err.message && err.message.indexOf('Failed to fetch') < 0 ? err.message : 'Checkout could not start. Please try again, or email sweetes262@gmail.com.';
        btn.disabled = false; btn.textContent = 'Checkout';
      });
  });

  /* ---------- menu ---------- */
  var cat = s.squareCategory || '';
  function load() {
    return fetch('/api/menu?category=' + encodeURIComponent(cat))
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .catch(function () { return fetch(cat ? 'menu-christmas.json' : 'menu-everyday.json').then(function (r) { return r.json(); }); });
  }

  function card(item) {
    var nm = split(item.name), img = photo(item), multi = item.variations.length > 1;
    var prices = item.variations.map(function (v) { return v.price; });
    var lo = Math.min.apply(null, prices), hi = Math.max.apply(null, prices);
    return '<article class="p-card" data-item="' + esc(item.id) + '">' +
      '<div class="p-photo">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(nm[0]) + '" loading="lazy">' : '<span class="ph big"><img src="images/logo.png" alt=""></span>') + '</div>' +
      '<div class="p-body"><h3>' + esc(nm[0]) + '</h3>' + (nm[1] ? '<p class="p-tag">' + esc(nm[1]) + '</p>' : '') +
      (item.description ? '<p class="p-desc">' + esc(item.description) + '</p>' : '') +
      '<div class="p-buy">' +
      (multi ? '<label class="sr-only" for="v-' + esc(item.id) + '">Choose an option</label><select class="input sel" id="v-' + esc(item.id) + '">' +
        item.variations.map(function (v) { return '<option value="' + esc(v.id) + '">' + esc(v.name) + ' &middot; ' + money(v.price) + '</option>'; }).join('') + '</select>'
        : '<p class="p-price">' + money(lo) + '</p>') +
      '<div class="buy-row"><div class="qty"><button type="button" data-q="-1" aria-label="One less">&minus;</button><span class="q">1</span><button type="button" data-q="1" aria-label="One more">+</button></div>' +
      '<button type="button" class="btn btn-add">Add to bag</button></div>' +
      (multi && lo !== hi ? '' : '') +
      '</div></div></article>';
  }

  load().then(function (menu) {
    var sec = menu.sections, byId = {};
    var groups = [];
    if (sec.season && sec.season.length && s.shopTitle) groups.push({ id: 'seasonal', title: s.shopTitle, items: sec.season });
    groups.push({ id: 'boxes', title: 'Gift box sets', items: sec.boxes || [] });
    groups.push({ id: 'treats', title: 'Treats, bags and packs', items: sec.treats || [] });
    groups.forEach(function (g) {
      g.items = g.items.filter(function (i) { return hide.indexOf(i.name.toLowerCase()) < 0; });
      g.items.sort(function (a, b) { return (photo(b) ? 1 : 0) - (photo(a) ? 1 : 0); });
      g.items.forEach(function (i) { byId[i.id] = i; });
    });
    groups = groups.filter(function (g) { return g.items.length; });

    $('shop-nav').innerHTML = groups.map(function (g) { return '<a href="#' + g.id + '">' + esc(g.title) + '</a>'; }).join('');
    $('shop').innerHTML = '<nav class="chips" aria-label="Menu sections">' + groups.map(function (g) { return '<a href="#' + g.id + '">' + esc(g.title) + '</a>'; }).join('') + '</nav>' +
      groups.map(function (g) {
        return '<section class="menu-sec" id="' + g.id + '"><div class="sec-head"><h2>' + esc(g.title) + '</h2><div class="rule left"></div></div>' +
          '<div class="p-grid">' + g.items.map(card).join('') + '</div></section>';
      }).join('');

    $('shop').addEventListener('click', function (e) {
      var c = e.target.closest('.p-card'); if (!c) return;
      var q = c.querySelector('.q');
      if (e.target.hasAttribute('data-q')) { q.textContent = Math.max(1, Math.min(99, +q.textContent + +e.target.getAttribute('data-q'))); return; }
      if (!e.target.classList.contains('btn-add')) return;
      var item = byId[c.getAttribute('data-item')], sel = c.querySelector('select');
      var v = sel ? item.variations.find(function (x) { return x.id === sel.value; }) : item.variations[0];
      var nm = split(item.name);
      add({ id: v.id, name: nm[0], variation: item.variations.length > 1 ? v.name : (nm[1] || ''), price: v.price, qty: +q.textContent, img: photo(item) });
      q.textContent = '1';
    });
    renderBag();
  }).catch(function () {
    $('shop').innerHTML = '<p class="loading">The menu could not load. Please refresh, or email sweetes262@gmail.com to order.</p>';
  });

  renderBag();
  if (location.hash === '#bag') openBag();
})();
