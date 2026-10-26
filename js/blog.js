(function () {
  "use strict";

  var cfg = window.BLOG_CONFIG || {};
  var posts = (window.BLOG_POSTS || []).slice();
  var page = document.body.getAttribute("data-page") || "home";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function byId(id) { return document.getElementById(id); }
  function setAll(attr, value) {
    var nodes = document.querySelectorAll("[" + attr + "]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = value;
  }
  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso || "";
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  function readTime(p) {
    if (p.readMinutes) return p.readMinutes;
    var words = String(p.body || "").replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
  function sortNewest(list) {
    return list.slice().sort(function (a, b) {
      return String(b.published).localeCompare(String(a.published));
    });
  }
  function query() {
    var out = {}, q = window.location.search.replace(/^\?/, "");
    if (!q) return out;
    q.split("&").forEach(function (pair) {
      var kv = pair.split("=");
      out[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
    });
    return out;
  }

  function phoneLinks(separator) {
    var list = cfg.phones || [];
    return list.map(function (p) {
      return '<a href="tel:' + esc(p.tel || p.display) + '">' + esc(p.display) + "</a>";
    }).join(separator);
  }

  /* Shared chrome */
  function renderChrome() {
    setAll("data-site-name", cfg.siteName || "");
    setAll("data-site-tagline", cfg.tagline || "");
    setAll("data-footer-line", cfg.footerLine || "");

    var phoneWrap = byId("top-bar-phone-wrap");
    if (phoneWrap) {
      var links = phoneLinks(" &nbsp;|&nbsp; ");
      phoneWrap.innerHTML = links && cfg.phoneLabel ? esc(cfg.phoneLabel) + ": " + links : links;
    }
    var cta = byId("top-bar-cta");
    if (cta) {
      cta.textContent = cfg.topCtaLabel || "Contact";
      cta.setAttribute("href", cfg.topCtaHref || "contact.html");
    }

    var nav = byId("site-nav");
    if (nav) {
      var here = window.location.pathname.split("/").pop() || "index.html";
      nav.innerHTML = (cfg.navLinks || []).map(function (l) {
        var cur = (l.href === here || (here === "post.html" && l.href === "index.html")) ? ' aria-current="page"' : "";
        return '<li><a href="' + esc(l.href) + '"' + cur + ">" + esc(l.label) + "</a></li>";
      }).join("");
    }
  }

  /* Home */
  function cardHtml(p) {
    var href = "post.html#" + encodeURIComponent(p.slug);
    var media = p.image
      ? '<img src="' + esc(p.image) + '" alt="" loading="lazy" />'
      : "";
    return '<li class="post-card">' +
      '<a class="post-card__media" href="' + href + '" aria-hidden="true" tabindex="-1">' + media + "</a>" +
      '<div class="post-card__body">' +
      (p.kicker ? '<p class="card-kicker">' + esc(p.kicker) + "</p>" : "") +
      '<h3 class="post-card__title"><a href="' + href + '">' + esc(p.title) + "</a></h3>" +
      '<p class="post-card__excerpt">' + esc(p.excerpt) + "</p>" +
      '<p class="post-meta">' + esc(p.author || cfg.siteName) + " &middot; " + esc(formatDate(p.published)) + " &middot; " + readTime(p) + " min read</p>" +
      "</div></li>";
  }

  function renderHome() {
    document.title = (cfg.homeDocumentTitle || "Blog") + " | " + (cfg.siteName || "");
    setAll("data-hero-intro", cfg.heroIntro || "");
    setAll("data-blog-title-1", cfg.blogTitleLine1 || "");
    setAll("data-blog-title-2", cfg.blogTitleLine2 || "");
    var heroCta = byId("hero-cta");
    if (heroCta) {
      heroCta.textContent = cfg.heroCtaLabel || "Get in touch";
      heroCta.setAttribute("href", cfg.heroCtaHref || "contact.html");
    }
    var strip = byId("footer-cta-strip");
    if (strip) {
      if (cfg.footerCtaLine) { setAll("data-footer-cta", cfg.footerCtaLine); strip.hidden = false; }
      else { strip.hidden = true; }
    }

    var q = query();
    var feed = q.feed === "popular" ? "popular" : "newest";
    var pageNo = Math.max(1, parseInt(q.page, 10) || 1);
    var perPage = cfg.postsPerPage || 6;

    var list;
    if (feed === "popular") {
      var order = cfg.popularSlugs || [];
      list = order.map(function (s) {
        return posts.filter(function (p) { return p.slug === s; })[0];
      }).filter(Boolean);
      if (!list.length) list = sortNewest(posts);
    } else {
      list = sortNewest(posts);
    }

    var links = document.querySelectorAll("#feed-switcher a");
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute("data-feed") === feed) links[i].className = "is-active";
    }

    var feedEl = byId("blog-feed");
    var pagEl = byId("blog-pagination");

    if (!list.length) {
      feedEl.outerHTML = '<p class="empty-state">The first posts are on their way. Please check back soon.</p>';
      pagEl.innerHTML = "";
      return;
    }

    var pages = Math.max(1, Math.ceil(list.length / perPage));
    if (pageNo > pages) pageNo = pages;
    var slice = list.slice((pageNo - 1) * perPage, pageNo * perPage);
    feedEl.innerHTML = slice.map(cardHtml).join("");

    if (pages > 1) {
      var base = "index.html?feed=" + feed + "&page=";
      var html = pageNo > 1
        ? '<a href="' + base + (pageNo - 1) + '">Previous</a>'
        : '<span class="is-disabled">Previous</span>';
      for (var n = 1; n <= pages; n++) {
        html += n === pageNo
          ? '<span class="is-current" aria-current="page">' + n + "</span>"
          : '<a href="' + base + n + '">' + n + "</a>";
      }
      html += pageNo < pages
        ? '<a href="' + base + (pageNo + 1) + '">Next</a>'
        : '<span class="is-disabled">Next</span>';
      pagEl.innerHTML = html;
    } else {
      pagEl.innerHTML = "";
    }
  }

  /* Post */
  function renderRelated(current) {
    var box = byId("related-root");
    if (!box) return;
    var others = sortNewest(posts).filter(function (x) { return x.slug !== current.slug; }).slice(0, 3);
    if (!others.length) { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="related-inner"><h2 class="related-title">Keep reading</h2>' +
      '<ul class="post-grid">' + others.map(cardHtml).join("") + "</ul></div>";
  }

  function renderPost() {
    var root = byId("article-root");
    var slug = decodeURIComponent((window.location.hash || "").replace(/^#/, ""));
    var p = posts.filter(function (x) { return x.slug === slug; })[0];
    var rel = byId("related-root");
    if (!p) {
      document.title = "Post not found | " + (cfg.siteName || "");
      root.innerHTML = '<header class="article-header"><h1>Post not found</h1></header>' +
        '<p>We could not find that post. It may have moved.</p>' +
        '<p><a class="back-link" href="index.html">&larr; Back to the blog</a></p>';
      if (rel) rel.innerHTML = "";
      return;
    }
    document.title = p.title + " | " + (cfg.siteName || "");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", p.excerpt || "");
    root.innerHTML =
      '<header class="article-header">' +
      (p.kicker ? '<p class="card-kicker">' + esc(p.kicker) + "</p>" : "") +
      "<h1>" + esc(p.title) + "</h1>" +
      '<p class="post-meta">' + esc(p.author || cfg.siteName) + " &middot; " + esc(formatDate(p.published)) + " &middot; " + readTime(p) + " min read</p>" +
      "</header>" +
      (p.image ? '<img class="article-cover" src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || "") + '" />' : "") +
      '<article class="article-body">' + p.body + "</article>" +
      '<p><a class="back-link" href="index.html">&larr; Back to the blog</a></p>';
    renderRelated(p);
    window.scrollTo(0, 0);
  }

  /* Contact */
  function renderContact() {
    var ph = byId("contact-phone-wrap");
    var em = byId("contact-email-wrap");
    if (ph) {
      var phoneHtml = phoneLinks("<br />");
      if (phoneHtml) { ph.innerHTML = phoneHtml; }
      else if (ph.parentNode) { ph.parentNode.style.display = "none"; }
    }
    if (em) {
      em.innerHTML = cfg.contactEmail
        ? '<a href="mailto:' + esc(cfg.contactEmail) + '">' + esc(cfg.contactEmail) + "</a>"
        : "Not listed";
    }
  }

  renderChrome();
  if (page === "home") renderHome();
  else if (page === "post") {
    renderPost();
    window.addEventListener("hashchange", renderPost);
  }
  else if (page === "contact") renderContact();
})();
