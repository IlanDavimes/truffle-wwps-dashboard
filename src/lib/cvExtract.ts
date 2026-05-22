import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export interface ExtractedCV {
  text: string
  source: 'pdf' | 'docx' | 'txt'
  filename: string
}

export async function extractTextFromFile(file: File): Promise<ExtractedCV> {
  const filename = file.name
  const name = filename.toLowerCase()
  if (name.endsWith('.pdf')) {
    return { text: await extractPdf(file), source: 'pdf', filename }
  }
  if (name.endsWith('.docx')) {
    return { text: await extractDocx(file), source: 'docx', filename }
  }
  if (name.endsWith('.txt') || name.endsWith('.md')) {
    return { text: await file.text(), source: 'txt', filename }
  }
  throw new Error(`Unsupported file type: ${filename}. Use PDF, DOCX, or TXT.`)
}

async function extractPdf(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise
  const parts: string[] = []
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((it) => ('str' in it ? (it as { str: string }).str : ''))
      .join(' ')
    parts.push(pageText)
  }
  return parts.join('\n\n').replace(/\s+\n/g, '\n').trim()
}

async function extractDocx(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buf })
  return result.value.trim()
}
