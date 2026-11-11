const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://odtechlab.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/legal-pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/posts/*', '/legal/*', '/llms.txt'],
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/posts/*', '/legal/*', '/llms.txt'],
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/posts/*', '/legal/*', '/llms.txt'],
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/posts/*', '/legal/*', '/llms.txt'],
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/posts/*', '/legal/*', '/llms.txt'],
        disallow: ['/admin/*', '/api/*', '/next/*'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/legal-pages-sitemap.xml`,
    ],
  },
}
