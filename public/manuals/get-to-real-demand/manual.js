(function () {
  // ── Manifest: change the manual once, every section page picks it up ──
  var MANIFEST = {
    slug: 'get-to-real-demand',
    title: 'Find real demand',
    number: '002',
    basePath: '/manuals/get-to-real-demand/',
    sections: [
      { slug: '',                          title: 'Introduction',             isIntro: true },
      { slug: 'start-with-the-problem',    title: 'Start with the problem',
        summary: 'Pin down the specific problem, who has it, and how badly it hurts before you propose a solution.' },
      { slug: 'find-your-ideal-customer',  title: 'Find your ideal customer',
        summary: 'Pick a specific person with real urgency — specificity is leverage when you have no traction yet.' },
      { slug: 'validate-your-app-idea',    title: 'Validate your app idea',
        summary: 'Run small, fast tests that produce evidence — not opinions — about whether to keep going.' },
      { slug: 'capture-early-users',       title: 'Capture early users',
        summary: 'Build a small pipeline of real users you can talk to, learn from, and ship to weekly.' },
      { slug: 'define-your-positioning',   title: 'Define your positioning',
        summary: 'Write a one-line positioning statement so sharp the right customer recognizes themselves in it.' },
      { slug: 'the-new-alternative',       title: 'The new alternative is AI',
        summary: 'Most builders compete with another product. Today the real competitor is whatever the customer can do themselves with AI.' },
      { slug: 'does-your-idea-have-a-moat', title: 'Does your idea have a moat?',
        summary: 'Speed of building has collapsed. Durable advantage now comes from data, network, distribution, or trust — not feature parity.' }
    ]
  };

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function hrefFor(s) { return MANIFEST.basePath + (s.slug ? s.slug + '/' : ''); }

  var currentSlug = document.body.dataset.section || '';
  var idx = -1;
  for (var i = 0; i < MANIFEST.sections.length; i++) {
    if (MANIFEST.sections[i].slug === currentSlug) { idx = i; break; }
  }
  if (idx === -1) return;
  var current = MANIFEST.sections[idx];
  var total = MANIFEST.sections.length;

  // ── Document title ──
  document.title = current.isIntro
    ? MANIFEST.title + ' | Mantle Compass'
    : MANIFEST.title + ' — ' + current.title + ' | Mantle Compass';

  // ── Breadcrumb row: removed — collapse the empty container so it takes no space ──
  var bc = document.querySelector('.manual-breadcrumb');
  if (bc) {
    bc.innerHTML = '';
    bc.style.display = 'none';
  }

  // ── Hero: trail (Manuals / [Manual name]) + copy-link button + h1 ──
  var hero = document.querySelector('.manual-hero');
  if (hero) {
    hero.innerHTML =
      '<div class="manual-hero-row">' +
        '<div class="manual-hero-trail">' +
          '<a href="/compass/manuals">Manuals</a>' +
          '<span class="manual-hero-trail-sep">/</span>' +
          '<a class="current" href="' + MANIFEST.basePath + '">' + MANIFEST.title + '</a>' +
        '</div>' +
        '<button type="button" class="manual-copy-link" aria-live="polite">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
          '<span class="manual-copy-link-label">Copy link</span>' +
        '</button>' +
      '</div>' +
      '<h1>' + MANIFEST.title + '</h1>';

    var copyBtn = hero.querySelector('.manual-copy-link');
    var copyLabel = copyBtn && copyBtn.querySelector('.manual-copy-link-label');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = window.location.href;
        var done = function () {
          copyBtn.classList.add('is-copied');
          if (copyLabel) copyLabel.textContent = 'Copied';
          setTimeout(function () {
            copyBtn.classList.remove('is-copied');
            if (copyLabel) copyLabel.textContent = 'Copy link';
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) {}
          document.body.removeChild(ta);
          done();
        }
      });
    }
  }

  // ── Sidebar: "› 00 Introduction" style ──
  var sidebar = document.querySelector('.manual-sidebar');
  if (sidebar) {
    var links = MANIFEST.sections.map(function (s, i) {
      var num = pad2(i);
      var cls = (s.slug === currentSlug) ? ' class="active"' : '';
      return '<a' + cls + ' href="' + hrefFor(s) + '">' +
               '<span class="manual-sidebar-num">' + num + '</span>' +
               '<span class="manual-sidebar-title">' + s.title + '</span>' +
             '</a>';
    }).join('');
    var subscribeHtml =
      '<div class="manual-sidebar-subscribe" data-subscribe>' +
        '<div class="manual-sidebar-subscribe-title">15k+ serious builders read this newsletter</div>' +
        '<div class="manual-sidebar-subscribe-desc">Weekly manuals, frameworks, and field notes.</div>' +
        '<form class="manual-sidebar-subscribe-form" data-subscribe-form novalidate>' +
          '<input class="manual-sidebar-subscribe-input" type="email" placeholder="Enter your email" required aria-label="Email address" />' +
          '<button class="manual-sidebar-subscribe-button" type="submit">Get on the list</button>' +
        '</form>' +
      '</div>';
    sidebar.innerHTML = '<div class="manual-sidebar-label">Sections</div>' + links + subscribeHtml;
  }

  // ── Sidebar subscribe: reveal once 50% of the article has been scrolled past ──
  (function () {
    var subscribe = document.querySelector('[data-subscribe]');
    var article = document.querySelector('.manual-content');
    if (!subscribe || !article) return;
    var ticking = false;
    function check() {
      ticking = false;
      var rect = article.getBoundingClientRect();
      var articleTop = rect.top + window.pageYOffset;
      var articleHeight = article.offsetHeight;
      var halfwayY = articleTop + articleHeight * 0.5;
      var viewportMid = window.pageYOffset + window.innerHeight * 0.5;
      if (viewportMid >= halfwayY) subscribe.classList.add('is-visible');
      else subscribe.classList.remove('is-visible');
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(check);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    check();
    var form = subscribe.querySelector('[data-subscribe-form]');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        var btn = form.querySelector('button[type="submit"]');
        if (!input || !input.value) return;
        if (btn) {
          btn.textContent = 'Subscribed ✓';
          btn.disabled = true;
          input.value = '';
        }
      });
    }
  })();

  // ── Section summary: inject below the section heading from manifest ──
  if (current.summary) {
    var content = document.querySelector('.manual-content .manual-section');
    if (content) {
      var heading = content.querySelector('h1') || content.querySelector('h2');
      if (heading && !content.querySelector('.manual-section-summary')) {
        var summary = document.createElement('p');
        summary.className = 'manual-section-summary';
        summary.textContent = current.summary;
        heading.parentNode.insertBefore(summary, heading.nextSibling);
      }
    }
  }

  // ── Prev / next ──
  var pn = document.querySelector('.manual-prev-next');
  if (pn) {
    var prev = MANIFEST.sections[idx - 1];
    var next = MANIFEST.sections[idx + 1];
    var chevLeft  = '<svg class="pn-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
    var chevRight = '<svg class="pn-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    var html = '';
    if (prev) {
      html +=
        '<a class="prev" href="' + hrefFor(prev) + '">' +
          '<span class="pn-label">' + chevLeft + 'Previous</span>' +
          '<span class="pn-title">' + prev.title + '</span>' +
        '</a>';
    } else {
      html += '<span class="placeholder"></span>';
    }
    if (next) {
      html +=
        '<a class="next" href="' + hrefFor(next) + '">' +
          '<span class="pn-label">Next' + chevRight + '</span>' +
          '<span class="pn-title">' + next.title + '</span>' +
        '</a>';
    } else {
      html +=
        '<a class="next" href="/mantle-compass-manuals.html">' +
          '<span class="pn-label">Manual complete' + chevRight + '</span>' +
          '<span class="pn-title">Back to all manuals</span>' +
        '</a>';
    }
    pn.innerHTML = html;
  }
})();
