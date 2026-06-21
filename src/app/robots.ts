import type { MetadataRoute } from 'next'

// AI / answer-engine crawlers we explicitly welcome. Two kinds matter for AEO:
//   • index/training bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
//     — get our content into the models' knowledge.
//   • fetch-at-query "user" bots (ChatGPT-User, Perplexity-User, Claude-User,
//     OAI-SearchBot…) — these retrieve a page live to CITE it in an answer.
// The second group is what actually drives AI-search referrals, so allow both.
const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',            // OpenAI / ChatGPT
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', // Anthropic / Claude
  'PerplexityBot', 'Perplexity-User',                   // Perplexity
  'Google-Extended',                                    // Gemini / AI Overviews
  'Applebot', 'Applebot-Extended',                      // Apple Intelligence / Siri
  'Amazonbot',                                          // Alexa / Rufus
  'Bingbot',                                            // Copilot (Bing index)
  'DuckAssistBot',                                      // DuckDuckGo AI
  'Meta-ExternalAgent', 'FacebookBot',                  // Meta AI
  'cohere-ai', 'YouBot', 'Diffbot', 'Timpibot',         // other answer engines
  'CCBot',                                              // Common Crawl (feeds many LLMs)
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: open to all, with non-content areas excluded.
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/*?conference='],
      },
      // Explicitly welcome AI/answer-engine crawlers to the full content set
      // (kept separate so a future tightening of '*' never silently blocks them).
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://diehardnation.com/sitemap.xml',
    host: 'https://diehardnation.com',
  }
}
