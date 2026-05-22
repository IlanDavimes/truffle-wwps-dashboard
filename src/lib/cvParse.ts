import type { Consultant } from '../data/types'

const SYSTEM_PROMPT = `You are an expert CV parser for Truffle Consulting, an actuarial and analytics talent recruitment firm. Extract structured data from a candidate CV into the JSON schema below.

Return ONLY a single JSON object. No markdown fences, no prose. Stick to the schema exactly. If a field is missing from the CV, use an empty string or empty array — do NOT invent data.

For "suggestedRole": leave it empty — Truffle staff fill this in manually per RFP.
For "status": always "draft".
For "videoEnabled": always false.
For "videoUrl": always "".
For "avatar": always "".
For "permitNumber": fill in if mentioned, else "".
For "linkedin": fill in if mentioned, else "".
For badges.style: pick from "premium", "accent", or "default" based on prominence.
For experience[].isCurrent: true only for the most recent role with no end date.

Schema:
{
  "id": "lowercase-hyphenated-slug-from-name",
  "status": "draft",
  "firstName": "First and middle initial(s) — e.g. 'Jane S.'",
  "surname": "Surname only",
  "suggestedRole": "",
  "currentRole": "Their actual current/most-recent role title",
  "summary": "3-4 sentence professional summary capturing expertise, experience, and value",
  "avatar": "",
  "videoUrl": "",
  "videoEnabled": false,
  "contact": {
    "location": "City, Country",
    "email": "Email",
    "phone": "Phone (with country code if possible)",
    "linkedin": "LinkedIn URL or handle",
    "permitNumber": "Work permit / visa / citizenship reference"
  },
  "badges": [
    { "label": "Key area", "style": "premium" }
  ],
  "availability": { "status": "Available now", "details": "Location and remote/relocate stance" },
  "readiness": ["Headline qualification or credential"],
  "industries": ["Sector focus"],
  "skills": [
    { "category": "Skill grouping", "items": ["Specific skill"] }
  ],
  "experience": [
    {
      "title": "Job title",
      "company": "Company",
      "location": "Location",
      "period": "Start – End or Present",
      "duration": "X months/years",
      "isCurrent": false,
      "bullets": ["Responsibility / achievement"],
      "achievement": "One standout achievement, one sentence"
    }
  ],
  "education": [
    { "degree": "Degree / certification", "institution": "Institution", "year": "Year", "highlight": "Optional distinction" }
  ],
  "references": [
    { "name": "Referee name or 'Available on request'", "role": "Role", "company": "Company", "contact": "Contact or 'Provided upon shortlisting'" }
  ]
}`

interface ParseOptions {
  apiKey: string
  rawText: string
  model?: string
  onAttempt?: (attempt: number, modelTried: string) => void
}

const ANTHROPIC_VERSION = '2023-06-01'
const MODELS_IN_ORDER = ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6']
const MAX_ATTEMPTS = 4
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529])

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callClaude(apiKey: string, model: string, rawText: string): Promise<Response> {
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Parse this CV and return ONLY the JSON object. CV text follows:\n\n${rawText}`,
        },
      ],
    }),
  })
}

export async function parseCV({ apiKey, rawText, onAttempt }: ParseOptions): Promise<Consultant> {
  let lastError = ''
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const model = attempt <= 2 ? MODELS_IN_ORDER[0] : MODELS_IN_ORDER[1] ?? MODELS_IN_ORDER[0]
    onAttempt?.(attempt, model)
    let response: Response
    try {
      response = await callClaude(apiKey, model, rawText)
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err)
      if (attempt === MAX_ATTEMPTS) break
      await sleep(1000 * attempt)
      continue
    }

    if (response.ok) {
      const data = (await response.json()) as { content?: { type: string; text?: string }[] }
      const textBlock = data.content?.find((b) => b.type === 'text')?.text ?? ''
      const jsonText = stripJsonFences(textBlock).trim()
      try {
        const parsed = JSON.parse(jsonText) as Consultant
        return normalise(parsed)
      } catch {
        throw new Error(`Claude returned non-JSON output. First 400 chars: ${jsonText.slice(0, 400)}`)
      }
    }

    const errBody = await response.text()
    lastError = `${response.status}: ${errBody.slice(0, 300)}`
    if (!RETRYABLE_STATUSES.has(response.status) || attempt === MAX_ATTEMPTS) {
      throw new Error(`Claude API error ${lastError}`)
    }
    await sleep(1200 * attempt)
  }
  throw new Error(`Claude API still failing after ${MAX_ATTEMPTS} attempts. Last error — ${lastError}. Anthropic may be overloaded; wait a minute and try again.`)
}

function stripJsonFences(text: string): string {
  let t = text.trim()
  if (t.startsWith('```')) {
    const firstNewline = t.indexOf('\n')
    if (firstNewline > -1) t = t.slice(firstNewline + 1)
    if (t.endsWith('```')) t = t.slice(0, -3)
  }
  return t.trim()
}

function normalise(c: Consultant): Consultant {
  return {
    ...c,
    status: 'draft',
    avatar: c.avatar ?? '',
    videoEnabled: false,
    videoUrl: '',
    suggestedRole: c.suggestedRole ?? '',
    badges: c.badges ?? [],
    readiness: c.readiness ?? [],
    industries: c.industries ?? [],
    skills: c.skills ?? [],
    experience: c.experience ?? [],
    education: c.education ?? [],
    references: c.references ?? [],
    contact: {
      location: c.contact?.location ?? '',
      email: c.contact?.email ?? '',
      phone: c.contact?.phone ?? '',
      linkedin: c.contact?.linkedin ?? '',
      permitNumber: c.contact?.permitNumber ?? '',
    },
    availability: {
      status: c.availability?.status ?? 'Available now',
      details: c.availability?.details ?? '',
    },
  }
}
