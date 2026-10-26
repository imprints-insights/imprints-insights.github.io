/**
 * =============================================================================
 * EDIT THIS FILE to change the blog.
 * =============================================================================
 * BLOG_CONFIG  : blog name, author name, tagline, email and menu.
 * BLOG_POSTS   : your posts.
 *
 * To add a post, copy the example block at the bottom, remove the two
 * slash-star marks around it, and fill in your own words.
 * Keep the comma after each closing brace.
 */

window.BLOG_CONFIG = {
  /* The author name shown at the top of every page. */
  siteName: "Dellar Zvinavashe Sibanda",
  tagline: "A journal of life and humanity",
  homeDocumentTitle: "Imprints & Insights",
  footerLine: "© 2026 Dellar Zvinavashe Sibanda",

  /* Phone numbers are left out for privacy. To show some, add them like this:
     phones: [ { display: "+263 77 000 0000", tel: "+263770000000" } ],
  */
  phones: [],
  phoneLabel: "",

  topCtaLabel: "Contact",
  topCtaHref: "contact.html",

  /* Shown on the Contact page. */
  contactEmail: "zvinavashe.d@gmail.com",

  /* Welcome block on the home page. */
  heroIntro:
    "Welcome. Imprints & Insights is a space for reflective writing about life, humanity, personal experiences and the things we notice around us.",
  heroCtaLabel: "Get in touch",
  heroCtaHref: "contact.html",

  /* Message above the footer. Use "" to hide it. */
  footerCtaLine:
    "Every life leaves an imprint. If something here speaks to you, you are not alone.",

  postsPerPage: 6,

  navLinks: [
    { label: "Blog", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ],

  /* Slugs listed here appear in the "Popular" view, in this order. */
  popularSlugs: [],
};

window.BLOG_POSTS = [
  /*
  {
    slug: "my-first-post",              // lower case, hyphens, no spaces
    title: "The title of my post",
    published: "2026-10-27",            // year-month-day
    author: "Dellar Zvinavashe Sibanda",
    kicker: "Reflection",               // small label above the title
    image: "",                          // optional: images/photo.jpg
    readMinutes: 4,                     // optional
    excerpt: "Two short sentences shown on the card on the home page.",
    body: `
      <p>Your first paragraph.</p>
      <h2>A heading if you need one</h2>
      <p>Your next paragraph.</p>
    `,
  },
  */
];
