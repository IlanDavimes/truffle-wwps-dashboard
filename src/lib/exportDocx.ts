import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
} from 'docx'
import type { Consultant } from '../data/types'

interface ExportOptions {
  consultant: Consultant
  revealed: boolean
  showcase?: boolean
}

const TRUFFLE_NAVY = '131A30'
const TRUFFLE_PURPLE = '7300E2'
const TRUFFLE_VIOLET = 'A123E7'
const MUTED = '5A6075'
const FAINT = '888888'

function heading(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: TRUFFLE_PURPLE, size: 22 })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
  })
}

function body(text: string, opts: { size?: number; color?: string; bold?: boolean; italic?: boolean } = {}): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: opts.size ?? 20, color: opts.color, bold: opts.bold, italics: opts.italic })],
  })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    bullet: { level: 0 },
  })
}

function buildSections(c: Consultant, revealed: boolean, showcase: boolean = false): Paragraph[] {
  const out: Paragraph[] = []
  const surnameInitial = c.surname?.trim()?.[0] ?? ''
  const showcaseName = surnameInitial ? `${c.firstName} ${surnameInitial}.` : c.firstName
  const fullName = showcase
    ? showcaseName
    : revealed
      ? `${c.firstName} ${c.surname}`
      : `${c.firstName} [surname concealed]`

  out.push(
    new Paragraph({
      children: [new TextRun({ text: 'Truffle Consulting · Talent Profile', size: 18, color: MUTED })],
      spacing: { after: 120 },
    }),
  )
  out.push(
    new Paragraph({
      children: [new TextRun({ text: fullName, bold: true, size: 36, color: TRUFFLE_NAVY })],
      spacing: { after: 60 },
    }),
  )
  out.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Truffle suggests for: ', italics: true, color: MUTED, size: 20 }),
        new TextRun({ text: c.suggestedRole, italics: true, bold: true, color: TRUFFLE_VIOLET, size: 20 }),
      ],
      spacing: { after: 60 },
    }),
  )
  out.push(body(c.currentRole, { size: 22, color: MUTED }))

  if (!showcase) {
    out.push(heading('Contact'))
    out.push(body(`Location: ${c.contact.location}`))
    if (revealed) {
      out.push(body(`Email: ${c.contact.email}`))
      out.push(body(`Phone: ${c.contact.phone}`))
      out.push(body(`LinkedIn: ${c.contact.linkedin}`))
      out.push(body(`Work permit: ${c.contact.permitNumber}`))
    } else {
      out.push(body('Email, phone, LinkedIn, and permit number concealed in this download. Enter the access password and re-download to include.', { italic: true, color: FAINT, size: 18 }))
    }
  } else if (c.contact?.location) {
    out.push(heading('Location'))
    out.push(body(c.contact.location))
  }

  out.push(heading('Availability'))
  out.push(body(c.availability.status, { bold: true }))
  out.push(body(c.availability.details))

  out.push(heading('Professional summary'))
  out.push(body(c.summary))

  if (c.badges.length) {
    out.push(heading('Key areas'))
    out.push(body(c.badges.map((b) => b.label).join(' · ')))
  }

  if (c.readiness.length) {
    out.push(heading('Key qualifications'))
    for (const r of c.readiness) out.push(bullet(r))
  }

  if (c.industries.length) {
    out.push(heading('Focus industries'))
    out.push(body(c.industries.join(' · ')))
  }

  if (c.experience.length) {
    out.push(heading('Work history'))
    for (const job of c.experience) {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: job.title, bold: true, size: 22, color: TRUFFLE_NAVY }),
            ...(job.isCurrent
              ? [new TextRun({ text: '   · Current', color: TRUFFLE_VIOLET, size: 18 })]
              : []),
          ],
          spacing: { before: 160 },
        }),
      )
      out.push(body(`${job.company} · ${job.location} · ${job.period}`, { size: 18, color: MUTED }))
      for (const b of job.bullets) out.push(bullet(b))
      if (job.achievement) {
        out.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Achievement: ', bold: true, color: TRUFFLE_VIOLET, size: 18 }),
              new TextRun({ text: job.achievement, italics: true, size: 18 }),
            ],
            spacing: { after: 80 },
          }),
        )
      }
    }
  }

  if (c.skills.length) {
    out.push(heading('Skills matrix'))
    for (const s of c.skills) {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${s.category}: `, bold: true, size: 20 }),
            new TextRun({ text: s.items.join(', '), size: 20 }),
          ],
        }),
      )
    }
  }

  if (c.education.length) {
    out.push(heading('Education & designations'))
    for (const e of c.education) {
      out.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.degree, bold: true, size: 20 }),
            new TextRun({ text: `  ·  ${e.institution}  ·  ${e.year}`, size: 18, color: MUTED }),
          ],
        }),
      )
      if (e.highlight) out.push(body(e.highlight, { italic: true, size: 18, color: MUTED }))
    }
  }

  if (!showcase && c.references.length) {
    out.push(heading('References'))
    for (const r of c.references) {
      out.push(body(r.name, { bold: true }))
      out.push(body(`${r.role} · ${r.company}`, { size: 18, color: TRUFFLE_PURPLE }))
      if (revealed) {
        out.push(body(r.contact, { size: 18 }))
      } else {
        out.push(body('Contact concealed — request reveal access to include.', { italic: true, color: FAINT, size: 16 }))
      }
    }
  }

  out.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}  ·  © 2026 Truffle Consulting`,
          size: 16,
          color: FAINT,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    }),
  )

  return out
}

function makeFilename(c: Consultant, revealed: boolean, showcase: boolean = false): string {
  const initial = c.surname?.trim()?.[0] ?? ''
  const surname = showcase
    ? (initial || 'redacted')
    : revealed
      ? c.surname
      : 'redacted'
  const date = new Date().toISOString().split('T')[0]
  const safe = (s: string) => s.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return `${safe(c.firstName)}_${safe(surname) || 'redacted'}_${date}.docx`
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export async function exportConsultantDocx({ consultant, revealed, showcase = false }: ExportOptions): Promise<void> {
  const surnameForTitle = showcase
    ? (consultant.surname?.trim()?.[0] ?? '') + '.'
    : revealed
      ? consultant.surname
      : ''
  const doc = new Document({
    creator: 'Truffle Consulting',
    title: `${consultant.firstName} ${surnameForTitle} · Truffle CV`.trim(),
    description: 'Consultant profile generated by Truffle Consultants dashboard',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri' },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: buildSections(consultant, revealed, showcase),
      },
    ],
  })
  const blob = await Packer.toBlob(doc)
  triggerDownload(blob, makeFilename(consultant, revealed, showcase))
}
