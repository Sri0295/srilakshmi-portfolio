/**
 * Central site configuration — the single place to update portfolio-wide
 * settings without touching components.
 */
export const site = {
  /** Update after first deployment (also update index.html, robots.txt, sitemap.xml) */
  url: 'https://srilakshmi-s-portfolio.vercel.app',

  resumePath: '/resume/Srilakshmi-S-Resume.pdf',

  availability: {
    open: true,
    label: 'Open to opportunities',
  },

  contactForm: {
    provider: 'formspree' as const,
    /** Owner-supplied Formspree endpoint (live). */
    endpoint: 'https://formspree.io/f/mrppvpjn',
  },
}
