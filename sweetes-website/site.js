(function () {
  var s = SEASONS[ACTIVE_SEASON] || SEASONS.everyday;
  var root = document.documentElement.style;
  Object.keys(s.colors).forEach(function (k) { root.setProperty('--' + k, s.colors[k]); });

  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  $('banner').textContent = s.banner;
  $('hero-eyebrow').textContent = s.hero.eyebrow;
  $('hero-italic').textContent = s.hero.titleItalic;
  $('hero-title').textContent = s.hero.title;
  $('hero-text').textContent = s.hero.text;
  $('hero-button').textContent = s.hero.button;
  if ($('hero-image')) $('hero-image').src = s.hero.image;
  $('hero-image').alt = s.hero.imageAlt;
  if (s.storyImage) $('story-image').src = s.storyImage;

  if (s.featured) {
    $('season').hidden = false;
    $('feat-eyebrow').textContent = s.featured.eyebrow;
    $('feat-title').textContent = s.featured.title;
    $('feat-text').textContent = s.featured.text;
    $('feat-grid').innerHTML = s.featured.items.map(function (i) {
      return '<article class="card"><div class="photo tall"><img src="' + esc(i.image) + '" alt="' + esc(i.name) + '" loading="lazy"></div>' +
        '<h3>' + esc(i.name) + '</h3><p class="note">' + esc(i.note) + '</p><p class="price">' + esc(i.price) + '</p></article>';
    }).join('');
    $('nav-season').textContent = s.navLabel || 'Seasonal';
  } else {
    $('nav-season').remove();
  }

  if (s.giftSets) {
    $('giftsets').hidden = false;
    $('gift-eyebrow').textContent = s.giftSets.eyebrow;
    $('gift-title').textContent = s.giftSets.title;
    $('gift-text').textContent = s.giftSets.text;
    $('gift-list').innerHTML = s.giftSets.items.map(function (i) {
      return '<li><span class="n">' + esc(i.name) + '</span><span class="p">' + esc(i.price) + '</span><span class="d">' + esc(i.note) + '</span></li>';
    }).join('');
  }

  document.querySelectorAll('.order-link').forEach(function (a) { a.href = ORDER_URL; if (/^https?:/.test(ORDER_URL)) { a.target = '_blank'; a.rel = 'noopener'; } });
  $('year').textContent = new Date().getFullYear();

  /* gentle snowfall in the hero */
  var c = $('snow');
  if (!s.snow || !c.getContext || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { c.remove(); return; }
  var ctx = c.getContext('2d'), flakes = [], w, h, dpr = window.devicePixelRatio || 1;
  function size() { w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); window.addEventListener('resize', size);
  var count = Math.round(Math.min(70, w / 16));
  for (var i = 0; i < count; i++) flakes.push({ x: Math.random() * w, y: Math.random() * h, r: 1 + Math.random() * 2.4, v: .25 + Math.random() * .6, d: Math.random() * 6.28 });
  (function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = s.colors.gold;
    flakes.forEach(function (f) {
      f.y += f.v; f.d += .01; f.x += Math.sin(f.d) * .3;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
      ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.28); ctx.fill();
    });
    requestAnimationFrame(tick);
  })();
})();
