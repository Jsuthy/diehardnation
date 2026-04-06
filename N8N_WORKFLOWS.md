# DieHardNation — n8n Workflow Documentation

Content generation runs via **Ollama on the Mac Mini** — zero external AI API costs.
n8n orchestrates the workflows, Ollama generates articles, Next.js API routes publish them.

## Prerequisites

### Mac Mini Setup
```bash
# 1. n8n running
npx n8n  # or: pm2 start n8n
# Access at: http://100.93.179.28:5678

# 2. Ollama running
ollama serve
# Access at: http://100.93.179.28:11434

# 3. Model pulled
ollama pull llama3.2

# 4. Tailscale connected
# IP: 100.93.179.28
```

### Test Ollama
```bash
# Local test
curl http://localhost:11434/api/generate \
  -d '{"model":"llama3.2","prompt":"Say hello","stream":false}'

# Remote test (via Tailscale)
curl http://100.93.179.28:11434/api/generate \
  -d '{"model":"llama3.2","prompt":"Say hello","stream":false}'
```

### API Endpoints
| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/schools?active=true` | None | List active schools |
| `GET /api/schools/{slug}` | None | Get single school |
| `PATCH /api/schools/{slug}` | ADMIN_TOKEN | Activate/deactivate school |
| `GET /api/rss-sources?school_slug=X` | None | RSS feeds for school |
| `GET /api/content/topics?school_slug=X` | INGEST_SECRET | This week's topic |
| `GET /api/news/check?school_slug=X&title=Y` | None | Check if article exists |
| `POST /api/news` | INGEST_SECRET | Publish single article |
| `POST /api/content/publish` | INGEST_SECRET | Publish multiple articles |
| `POST /api/ingest` | INGEST_SECRET | Run eBay product ingestion |
| `POST /api/programmatic/generate` | INGEST_SECRET | Generate SEO pages |
| `POST /api/search-terms` | INGEST_SECRET | Upsert search terms |

### Auth Headers
```
Authorization: Bearer diehardnation_ingest_2026   (INGEST_SECRET)
Authorization: Bearer diehardnation_admin_2026    (ADMIN_TOKEN)
```

---

## Workflow 1: RSS News Monitor

**Trigger:** Schedule — every 30 minutes

### Nodes

**Node 1 — HTTP Request (Get active schools)**
- Method: `GET`
- URL: `https://diehardnation.com/api/schools?active=true`
- Returns: array of school objects with `slug`, `name`, `nickname`, `mascot`

**Node 2 — Split In Batches**
- Batch size: 1
- Process one school at a time

**Node 3 — HTTP Request (Get RSS feeds)**
- Method: `GET`
- URL: `https://diehardnation.com/api/rss-sources?school_slug={{$json.slug}}`
- Returns: array of RSS source objects with `url`, `sport`

**Node 4 — RSS Feed Read**
- URL: `{{$json.url}}`
- Limit: 5 items per feed

**Node 5 — IF (filter recent items)**
- Condition: `{{$json.pubDate}}` is within last 30 minutes
- Use expression: `{{new Date($json.pubDate).getTime() > Date.now() - 30 * 60 * 1000}}`
- True branch continues, false branch stops

**Node 6 — HTTP Request (check duplicate)**
- Method: `GET`
- URL: `https://diehardnation.com/api/news/check?school_slug={{$node["Node 2"].json.slug}}&title={{encodeURIComponent($json.title)}}`
- Continue only if response `exists` = false

**Node 7 — HTTP Request (Ollama — generate article)**
- Method: `POST`
- URL: `http://100.93.179.28:11434/api/generate`
- Body (JSON):
```json
{
  "model": "llama3.2",
  "prompt": "You are a passionate {{$node['Node 2'].json.name}} fan writing for DieHardNation.com — an independent fan gear site.\n\nWrite a fan article about this news: {{$json.title}} — {{$json.contentSnippet}}\n\nRequirements:\n- 350-400 words\n- Sounds like a real die-hard fan\n- Mention fan gear naturally (jerseys, hoodies, hats)\n- End with: 'Shop the latest {{$node['Node 2'].json.nickname}} gear at DieHardNation.com'\n- Return ONLY valid JSON: {\"title\": \"...\", \"slug\": \"url-safe-slug\", \"excerpt\": \"one sentence\", \"content\": \"<p>html paragraphs</p>\"}\n- No markdown, no explanation, just JSON",
  "stream": false,
  "options": { "temperature": 0.7 }
}
```

**Node 8 — Code (parse Ollama response)**
```javascript
const raw = $json.response;
const clean = raw.replace(/```json|```/g, '').trim();
try {
  const article = JSON.parse(clean);
  return [{
    json: {
      ...article,
      school_slug: $('Node 2').first().json.slug
    }
  }];
} catch (e) {
  // Try to extract JSON from the response
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) {
    const article = JSON.parse(match[0]);
    return [{
      json: {
        ...article,
        school_slug: $('Node 2').first().json.slug
      }
    }];
  }
  throw new Error('Failed to parse Ollama response: ' + clean.substring(0, 200));
}
```

**Node 9 — HTTP Request (publish)**
- Method: `POST`
- URL: `https://diehardnation.com/api/news`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Body (JSON):
```json
{
  "school_slug": "{{$json.school_slug}}",
  "slug": "{{$json.slug}}",
  "title": "{{$json.title}}",
  "content": "{{$json.content}}",
  "excerpt": "{{$json.excerpt}}"
}
```

---

## Workflow 2: Daily Scheduled Content

**Trigger:** Schedule — 9:00 AM CT daily (cron: `0 14 * * *`)

### Nodes

**Node 1 — HTTP Request (get active schools)**
- `GET https://diehardnation.com/api/schools?active=true`

**Node 2 — Split In Batches** (1 at a time)

**Node 3 — HTTP Request (get topic)**
- `GET https://diehardnation.com/api/content/topics?school_slug={{$json.slug}}`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Returns: `{ topic, type, sport, week }`

**Node 4 — HTTP Request (Ollama)**
- Method: `POST`
- URL: `http://100.93.179.28:11434/api/generate`
- Body:
```json
{
  "model": "llama3.2",
  "prompt": "You are a passionate {{$node['Node 2'].json.name}} fan writing for DieHardNation.com.\n\nWrite a fan article on this topic: {{$json.topic}}\n\nRequirements:\n- 350-400 words\n- Sounds like a real die-hard fan, not corporate\n- Naturally mention fan gear (jerseys, hoodies, hats) where relevant\n- End with: 'Find all the gear at DieHardNation.com/{{$node['Node 2'].json.slug}}'\n- Return ONLY valid JSON: {\"title\": \"...\", \"slug\": \"url-safe-slug\", \"excerpt\": \"one sentence under 160 chars\", \"content\": \"<p>html content</p>\"}\n- No markdown, just JSON",
  "stream": false,
  "options": { "temperature": 0.8 }
}
```

**Node 5 — Code (parse response)**
Same as Workflow 1 Node 8.

**Node 6 — HTTP Request (publish)**
Same as Workflow 1 Node 9.

---

## Workflow 3: Ingestion Cron

**Trigger:** Schedule — every 6 hours (cron: `0 */6 * * *`)

### Nodes

**Node 1 — HTTP Request (get active schools)**
- `GET https://diehardnation.com/api/schools?active=true`

**Node 2 — Split In Batches** (1 at a time)

**Node 3 — HTTP Request (ingest products)**
- Method: `POST`
- URL: `https://diehardnation.com/api/ingest`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Body: `{ "school_slug": "{{$json.slug}}" }`

**Node 4 — Wait** — 30 seconds (avoid eBay rate limits)

**Node 5 — HTTP Request (generate pages)**
- Method: `POST`
- URL: `https://diehardnation.com/api/programmatic/generate`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Body: `{ "school_slug": "{{$json.slug}}" }`

> **Note:** Run manually for Nebraska first to verify, then activate for all schools.

---

## Workflow 4: School Builder Agent

**Trigger:** Manual webhook — `{ "school_slug": "alabama" }`

This workflow fully bootstraps a new school: generates search terms,
ingests products, creates pages, writes seed articles, and activates.

### Nodes

**Node 1 — HTTP Request (validate school)**
- `GET https://diehardnation.com/api/schools/{{$json.school_slug}}`
- Verify `is_active` = false (not yet built)

**Node 2 — HTTP Request (Ollama — generate search terms)**
- Method: `POST`
- URL: `http://100.93.179.28:11434/api/generate`
- Body:
```json
{
  "model": "llama3.2",
  "prompt": "Generate eBay search terms for {{$node['Node 1'].json.name}} ({{$node['Node 1'].json.nickname}}, {{$node['Node 1'].json.mascot}}) fan gear.\n\nReturn ONLY valid JSON:\n{\n  \"football\": [\"term1\", \"term2\", \"term3\", \"term4\", \"term5\"],\n  \"basketball\": [\"term1\", \"term2\", \"term3\"],\n  \"volleyball\": [\"term1\", \"term2\"],\n  \"wrestling\": [\"term1\", \"term2\"],\n  \"baseball\": [\"term1\", \"term2\"],\n  \"softball\": [\"term1\"],\n  \"track\": [\"term1\"],\n  \"general\": [\"term1\", \"term2\", \"term3\", \"term4\", \"term5\"]\n}\nEach term should be a realistic eBay search like 'alabama crimson tide football jersey'",
  "stream": false
}
```

**Node 3 — Code (parse + POST search terms)**
```javascript
const raw = $json.response;
const clean = raw.replace(/```json|```/g, '').trim();
const match = clean.match(/\{[\s\S]*\}/);
const terms = JSON.parse(match[0]);
return [{ json: { school_slug: $('Webhook').json.school_slug, terms } }];
```
Then HTTP Request:
- `POST https://diehardnation.com/api/search-terms`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Body: `{ "school_slug": "{{$json.school_slug}}", "terms": {{$json.terms}} }`

**Node 4 — HTTP Request (ingest products)**
- `POST https://diehardnation.com/api/ingest`
- Body: `{ "school_slug": "{{$json.school_slug}}" }`

**Node 5 — Wait** — 10 seconds

**Node 6 — HTTP Request (generate pages)**
- `POST https://diehardnation.com/api/programmatic/generate`
- Body: `{ "school_slug": "{{$json.school_slug}}" }`

**Node 7 — Code (generate 3 seed article prompts)**
```javascript
const school = $('Node 1').first().json;
const topics = [
  `Best ${school.name} fan gear guide`,
  `${school.name} football gear — what fans are wearing`,
  `${school.name} gift guide for fans`,
];
return topics.map(topic => ({ json: { topic, school } }));
```

**Node 8 — HTTP Request (Ollama — for each topic)**
Same Ollama prompt template as Workflow 2 Node 4.

**Node 9 — Code (collect all articles)**
Aggregate into array.

**Node 10 — HTTP Request (bulk publish)**
- `POST https://diehardnation.com/api/content/publish`
- Headers: `Authorization: Bearer diehardnation_ingest_2026`
- Body: `{ "school_slug": "...", "articles": [...] }`

**Node 11 — HTTP Request (activate school)**
- Method: `PATCH`
- URL: `https://diehardnation.com/api/schools/{{$json.school_slug}}`
- Headers: `Authorization: Bearer diehardnation_admin_2026`
- Body: `{ "is_active": true, "is_live": true }`

**Node 12 — Done**
Log: `School {{school.name}} is live at diehardnation.com/{{school.slug}}`

---

## Manual Testing

### 1. Test article generation
```bash
curl http://100.93.179.28:11434/api/generate \
  -d '{
    "model": "llama3.2",
    "prompt": "Write a 350-word fan article about Nebraska Cornhuskers football gear. Return ONLY JSON: {\"title\": \"...\", \"slug\": \"...\", \"excerpt\": \"...\", \"content\": \"<p>...</p>\"}",
    "stream": false
  }'
```

### 2. Publish a test article
```bash
curl -X POST https://diehardnation.com/api/news \
  -H "Authorization: Bearer diehardnation_ingest_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "school_slug": "nebraska",
    "slug": "test-husker-gear-guide",
    "title": "Best Nebraska Husker Gear for Game Day",
    "content": "<p>Game day in Lincoln is unlike anything else in college sports.</p><p>Whether you are heading to Memorial Stadium or watching from home, you need the right gear.</p>",
    "excerpt": "The best Nebraska Cornhuskers gear picks for every game day."
  }'
```

### 3. Verify
Visit: `https://diehardnation.com/nebraska/news`

### 4. Get this week's content topic
```bash
curl -H "Authorization: Bearer diehardnation_ingest_2026" \
  "https://diehardnation.com/api/content/topics?school_slug=nebraska"
```

### 5. Bulk publish
```bash
curl -X POST https://diehardnation.com/api/content/publish \
  -H "Authorization: Bearer diehardnation_ingest_2026" \
  -H "Content-Type: application/json" \
  -d '{
    "school_slug": "nebraska",
    "articles": [
      {
        "title": "Article One",
        "slug": "article-one",
        "content": "<p>Content here</p>",
        "excerpt": "First article"
      },
      {
        "title": "Article Two",
        "slug": "article-two",
        "content": "<p>Content here</p>",
        "excerpt": "Second article"
      }
    ]
  }'
```
