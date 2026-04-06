import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/server'
import { runIngestionForSchool } from '@/lib/ingestion'
import { generateWithOllama, parseJsonFromOllama } from '@/lib/ollama'
import type { School } from '@/lib/supabase/types'

export const maxDuration = 300 // 5 minutes for Vercel

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.INGEST_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const supabase = getAdminClient()

  try {
    const body = await request.json()
    const schoolSlug = body.school_slug as string

    if (!schoolSlug) {
      return NextResponse.json({ error: 'Missing school_slug' }, { status: 400 })
    }

    // 1. Get school
    const { data: school } = await supabase
      .from('schools')
      .select('*')
      .eq('slug', schoolSlug)
      .single()

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    if (school.is_live) {
      return NextResponse.json({ already_live: true, school: schoolSlug })
    }

    // Mark as building
    await supabase
      .from('schools')
      .update({ build_status: 'building' })
      .eq('slug', schoolSlug)

    const s = school as School
    let searchTermsCreated = 0
    let productsIngested = 0
    let pagesCreated = 0
    let articlesPublished = 0
    const errors: string[] = []

    // 2. Generate search terms via Ollama
    try {
      const prompt = `Generate eBay search terms for ${s.name} (${s.nickname}, ${s.mascot}) fan gear. Return ONLY valid JSON with these exact keys:
{
  "football": ["term1", "term2", "term3", "term4", "term5"],
  "basketball": ["term1", "term2", "term3", "term4", "term5"],
  "volleyball": ["term1", "term2", "term3"],
  "baseball": ["term1", "term2", "term3"],
  "wrestling": ["term1", "term2"],
  "softball": ["term1", "term2"],
  "track": ["term1", "term2"],
  "general": ["term1", "term2", "term3", "term4", "term5"]
}
Each term should be a realistic eBay search specific to ${s.name} or ${s.nickname}. Example: '${s.slug} ${s.mascot.toLowerCase()} football jersey'. Return ONLY the JSON, nothing else.`

      const raw = await generateWithOllama(prompt)
      const parsed = parseJsonFromOllama(raw)

      if (parsed) {
        const rows: { school_slug: string; term: string; sport: string }[] = []
        for (const [sport, terms] of Object.entries(parsed)) {
          if (Array.isArray(terms)) {
            for (const term of terms) {
              if (typeof term === 'string' && term.length > 3) {
                rows.push({ school_slug: schoolSlug, term, sport })
              }
            }
          }
        }

        if (rows.length > 0) {
          await supabase
            .from('school_search_terms')
            .upsert(rows, { onConflict: 'school_slug,term' })
          searchTermsCreated = rows.length
        }
      } else {
        // Fallback: generate basic search terms
        const fallbackTerms = [
          { term: `${s.name} football jersey`, sport: 'football' },
          { term: `${s.short_name} football shirt`, sport: 'football' },
          { term: `${s.nickname} football hoodie`, sport: 'football' },
          { term: `${s.name} basketball gear`, sport: 'basketball' },
          { term: `${s.nickname} basketball shirt`, sport: 'basketball' },
          { term: `${s.name} volleyball shirt`, sport: 'volleyball' },
          { term: `${s.mascot} merchandise`, sport: 'general' },
          { term: `${s.short_name} hoodie`, sport: 'general' },
          { term: `${s.nickname} hat`, sport: 'general' },
          { term: `${s.name} gear`, sport: 'general' },
          { term: `${s.short_name} shirt`, sport: 'general' },
        ].map(t => ({ ...t, school_slug: schoolSlug }))

        await supabase
          .from('school_search_terms')
          .upsert(fallbackTerms, { onConflict: 'school_slug,term' })
        searchTermsCreated = fallbackTerms.length
        errors.push('Ollama parse failed, used fallback search terms')
      }
    } catch (err) {
      // Ollama unreachable — use fallback terms
      const fallbackTerms = [
        `${s.name} football jersey`,
        `${s.short_name} hoodie`,
        `${s.nickname} shirt`,
        `${s.mascot} gear`,
        `${s.name} hat`,
        `${s.short_name} merchandise`,
      ].map(term => ({ school_slug: schoolSlug, term, sport: 'general' }))

      await supabase
        .from('school_search_terms')
        .upsert(fallbackTerms, { onConflict: 'school_slug,term' })
      searchTermsCreated = fallbackTerms.length
      errors.push(`Ollama error: ${err}. Used fallback search terms.`)
    }

    // 3. Run eBay ingestion
    try {
      const result = await runIngestionForSchool(schoolSlug)
      productsIngested = result.upserted
      pagesCreated = result.pages_created
      if (result.errors.length > 0) {
        errors.push(...result.errors)
      }
    } catch (err) {
      errors.push(`Ingestion error: ${err}`)
    }

    // 4. Generate 3 seed articles via Ollama
    const articlePrompts = [
      {
        prompt: `Write a 400-word fan gear guide for ${s.name} fans. Title it 'Best ${s.name} Fan Gear \u2014 ${s.mascot} Apparel Guide'. Include jerseys, hoodies, hats. Sound like a passionate fan, not corporate. End with: Browse ${s.name} gear at DieHardNation.com/${s.slug}. Return ONLY valid JSON: {"title": "...", "slug": "url-safe-slug", "excerpt": "one sentence under 160 chars", "content": "<p>html paragraphs</p>"}`,
        fallbackTitle: `Best ${s.name} Fan Gear \u2014 ${s.mascot} Apparel Guide`,
        fallbackSlug: `best-${s.slug}-fan-gear-guide`,
      },
      {
        prompt: `Write a 400-word fan article about ${s.name} football fan gear and game day culture. Sound like a passionate fan. End with: Shop ${s.nickname} football gear at DieHardNation.com/${s.slug}. Return ONLY valid JSON: {"title": "...", "slug": "url-safe-slug", "excerpt": "one sentence", "content": "<p>html paragraphs</p>"}`,
        fallbackTitle: `${s.name} Football Gear \u2014 What Fans Are Wearing`,
        fallbackSlug: `${s.slug}-football-gear-fans`,
      },
      {
        prompt: `Write a 400-word gift guide for ${s.name} fans. Title it 'Top ${s.mascot} Fan Gifts \u2014 ${s.name} Gift Ideas'. Include price ranges, product types. Sound like a fan. End with: Find gifts at DieHardNation.com/${s.slug}. Return ONLY valid JSON: {"title": "...", "slug": "url-safe-slug", "excerpt": "one sentence", "content": "<p>html paragraphs</p>"}`,
        fallbackTitle: `Top ${s.mascot} Fan Gifts \u2014 ${s.name} Gift Ideas`,
        fallbackSlug: `${s.slug}-fan-gift-guide`,
      },
    ]

    for (const ap of articlePrompts) {
      try {
        const raw = await generateWithOllama(ap.prompt, { temperature: 0.8 })
        const parsed = parseJsonFromOllama(raw)

        if (parsed && parsed.title && parsed.content) {
          const slug = (parsed.slug as string) || ap.fallbackSlug
          await supabase.from('news_posts').upsert(
            {
              school_slug: schoolSlug,
              slug: slug.replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').slice(0, 80),
              title: parsed.title as string,
              content: parsed.content as string,
              excerpt: (parsed.excerpt as string) || '',
              is_published: true,
              published_at: new Date().toISOString(),
            },
            { onConflict: 'school_slug,slug' }
          )
          articlesPublished++
        } else {
          errors.push(`Article parse failed for: ${ap.fallbackTitle}`)
        }
      } catch (err) {
        errors.push(`Article generation error: ${err}`)
      }
    }

    // 5. Activate school
    await supabase
      .from('schools')
      .update({
        is_active: true,
        is_live: true,
        build_status: 'complete',
      })
      .eq('slug', schoolSlug)

    const durationMs = Date.now() - startTime

    return NextResponse.json({
      success: true,
      school: schoolSlug,
      products_ingested: productsIngested,
      pages_created: pagesCreated,
      articles_published: articlesPublished,
      search_terms_created: searchTermsCreated,
      duration_ms: durationMs,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    // Mark as failed
    try {
      const body = await request.clone().json()
      if (body.school_slug) {
        await supabase
          .from('schools')
          .update({ build_status: 'failed' })
          .eq('slug', body.school_slug)
      }
    } catch { /* ignore */ }

    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
