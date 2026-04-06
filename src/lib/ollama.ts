const OLLAMA_HOST = () => (process.env.OLLAMA_HOST || 'http://100.93.179.28:11434').trim()

export async function generateWithOllama(prompt: string, options?: {
  model?: string
  temperature?: number
}): Promise<string> {
  const model = options?.model || 'llama3.2'
  const temperature = options?.temperature ?? 0.7

  const res = await fetch(`${OLLAMA_HOST()}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ollama error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.response || ''
}

export function parseJsonFromOllama(raw: string): Record<string, unknown> | null {
  // Strip markdown fences
  let clean = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

  // Try direct parse
  try {
    return JSON.parse(clean)
  } catch {
    // Try extracting JSON object
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}
