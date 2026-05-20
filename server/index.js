import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))

const port = Number(process.env.PORT || 3003)
const geminiApiKey = process.env.GEMINI_API_KEY
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

console.log(`PersonalityMaster API server starting on port ${port}`)
console.log(`Using Gemini model: ${geminiModel}`)
console.log(`GEMINI_API_KEY ${geminiApiKey ? 'FOUND' : 'MISSING'}`)

const ai = new GoogleGenAI({ apiKey: geminiApiKey ?? '' })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: geminiModel })
})

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model } = req.body

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' })
    }

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' })
    }

    const response = await ai.models.generateContent({
      model: model || geminiModel,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    })

    const text = response.text ?? ''
    return res.json({ text, raw: response })
  } catch (error) {
    console.error('AI generate error:', error)
    return res.status(500).json({ error: error instanceof Error ? error.message : 'AI request failed' })
  }
})

app.listen(port, () => {
  console.log(`✅ PersonalityMaster API server listening on http://localhost:${port}`)
})
