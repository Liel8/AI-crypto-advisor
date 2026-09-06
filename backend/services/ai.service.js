import axios from 'axios'
import { logger } from './logger.service.js'

export const aiService = {
  generateDailyInsight
}

const HF_CHAT_MODEL = 'meta-llama/Llama-3.1-8B-Instruct'
const HF_CHAT_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'

/**
 * Generates personalized daily AI insight using Hugging Face Inference Providers (Chat Completions)
 * Tailored to user's persona and monitored assets.
 * Strict rule: No invented market metrics (no fake prices, RSI, support/resistance, APY, TVL, or targets).
 */
async function generateDailyInsight({ persona = 'HODLer', assets = ['BTC', 'ETH', 'SOL'] }) {
  const assetList = assets && assets.length ? assets : ['BTC', 'ETH', 'SOL']
  const assetStr = assetList.join(', ')
  const hfApiKey = process.env.HUGGINGFACE_API_KEY

  const prompt = `You are a professional crypto analyst providing a concise daily market overview.
Investor Profile: ${persona}
Monitored Assets: ${assetStr}

Provide a concise daily market insight in exactly two short paragraphs:
Paragraph 1: A qualitative market perspective for ${assetStr} tailored to the mindset of a ${persona}.
Paragraph 2: Practical, actionable risk management and strategic guidance for a ${persona}.

Important constraints:
- Do not invent or cite specific price numbers, RSI values, support/resistance levels, APY, TVL, or target prices.
- Focus on general market dynamics, risk discipline, asset diversification, and time horizon.
- Keep the tone professional, objective, and actionable. Do not include generic disclaimers.`

  // 1. Attempt Hugging Face Inference Providers via Chat Completion endpoint
  if (hfApiKey) {
    try {
      const generatedText = await _queryHuggingFace(prompt, hfApiKey)
      if (generatedText) {
        return {
          text: _cleanGeneratedText(generatedText),
          sentiment: `🧠 Hugging Face (${HF_CHAT_MODEL}): ${persona} Focus`,
          generatedAt: new Date().toISOString()
        }
      }
    } catch (err) {
      logger.warn(`Hugging Face Inference Providers call failed (${err.response?.data?.message || err.message}). Using persona fallback insight.`)
    }
  }

  // 2. Simple qualitative fallback based strictly on persona + assets (no fabricated metrics)
  return _synthesizePersonaInsight(persona, assetList)
}

/**
 * Queries Hugging Face Inference Providers using the Chat Completion endpoint
 */
async function _queryHuggingFace(prompt, apiKey) {
  const response = await axios.post(
    HF_CHAT_ENDPOINT,
    {
      model: HF_CHAT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional crypto advisor. Output exactly two concise paragraphs without headings, disclaimers, or invented market numbers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.6
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 12000
    }
  )

  const content = response.data?.choices?.[0]?.message?.content
  if (content) {
    return content.trim()
  }

  return null
}

/**
 * Cleans and formats generated LLM text into 2 readable paragraphs
 */
function _cleanGeneratedText(rawText) {
  const cleaned = rawText
    .replace(/^(\*\*.*?\*\*|#+\s*.*?)\n+/i, '')
    .trim()

  return cleaned.replace(/\n\n+/g, '\n\n')
}

/**
 * Fallback synthesizer strictly based on persona + assets without any fabricated metrics
 */
function _synthesizePersonaInsight(persona, assets) {
  const assetList = assets.join(', ')
  let text = ''

  if (persona === 'Day Trader') {
    text = `Momentum & Market Outlook: For an active Day Trader monitoring ${assetList}, a short-term trading approach requires disciplined execution and close attention to liquidity changes. Volatility across your selected assets can create frequent intra-day opportunities as market momentum shifts.
    Risk Management Guidance: Protect your capital by predefining stop-loss parameters before opening trades and avoiding emotional reactions to brief price movements. Focus on strict position sizing and prioritize capital preservation over chasing extended moves.`
  } else if (persona === 'NFT Collector') {
    text = `Ecosystem & On-Chain Activity: For an NFT Collector following ${assetList}, ecosystem engagement and smart contract activity are useful areas to monitor when evaluating communities and projects. Liquidity conditions across blockchain networks can also affect participation and trading activity.
    Advisory & Capital Allocation: Maintain sufficient liquid reserves in your primary wallet to handle network fees and minting opportunities. Focus on high-conviction communities and avoid overextending capital across highly speculative secondary-market activity.`
  } else if (persona === 'DeFi Yield Farmer') {
    text = `Protocol Dynamics & Liquidity Depth: For a DeFi Yield Farmer tracking ${assetList}, protocol security, borrowing demand, and liquidity depth are important factors when evaluating yield opportunities. Market changes can affect liquidity pools and fee-generation dynamics.
      Capital Efficiency & Security: Regularly monitor your active pool positions for impermanent loss exposure and contract changes. Prioritize established protocols with transparent reserves and strong security practices over short-lived incentive programs.`
  } else {
    // HODLer (Default)
    text = `Long-Term Perspective: As a long-term HODLer focused on ${assetList}, maintaining a clear investment thesis and a long time horizon is more important than reacting to short-term volatility. Crypto markets can experience significant price swings, so consistency and patience are important.
      Strategic Discipline: Maintain a systematic accumulation strategy that fits your risk tolerance and keep strong custody practices. Avoid making emotional decisions based on short-term market movements and focus on the long-term role of the assets in your portfolio.`
  }

  return {
    text,
    sentiment: `⚡ Market Perspective: ${persona} Focus`,
    generatedAt: new Date().toISOString()
  }
}
