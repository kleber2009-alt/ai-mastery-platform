// src/lib/notion.js
// Загружает контент урока из Notion через публичный API
// Используем notion-to-md через serverless function чтобы не светить токен

export async function fetchLessonContent(notionPageId) {
  // В продакшене — вызов своего API endpoint
  // В dev — прямой вызов (нужен CORS proxy)
  try {
    const res = await fetch(`/api/lesson-content?pageId=${notionPageId}`)
    if (!res.ok) throw new Error('Failed to fetch lesson')
    return await res.json()
  } catch (err) {
    console.error('Notion fetch error:', err)
    return null
  }
}

// ─── API ROUTE (api/lesson-content.js для Vercel) ──────────
// Сохрани этот файл как api/lesson-content.js в корне проекта
export const LESSON_CONTENT_API = `
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion })

export default async function handler(req, res) {
  const { pageId } = req.query

  if (!pageId) {
    return res.status(400).json({ error: 'pageId required' })
  }

  try {
    // Получаем мета-данные страницы
    const page = await notion.pages.retrieve({ page_id: pageId })

    // Конвертируем контент в Markdown
    const mdblocks = await n2m.pageToMarkdown(pageId)
    const mdString = n2m.toMarkdownString(mdblocks)

    res.status(200).json({
      title: page.properties?.title?.title?.[0]?.plain_text || '',
      content: mdString.parent,
      url: page.url
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
`
