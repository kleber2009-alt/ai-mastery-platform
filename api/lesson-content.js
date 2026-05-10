import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const n2m = new NotionToMarkdown({ notionClient: notion })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const { pageId } = req.query
  if (!pageId) return res.status(400).json({ error: 'pageId required' })

  try {
    const page = await notion.pages.retrieve({ page_id: pageId })
    const mdblocks = await n2m.pageToMarkdown(pageId)
    const md = n2m.toMarkdownString(mdblocks)
    res.status(200).json({
      title: page.properties?.title?.title?.[0]?.plain_text || '',
      content: md.parent || ''
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
