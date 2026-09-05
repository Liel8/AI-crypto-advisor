import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePreferences } from '../store/user.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const AVAILABLE_ASSETS = [
  { ticker: 'BTC', name: 'Bitcoin', icon: '₿', iconClass: 'icon-btc' },
  { ticker: 'ETH', name: 'Ethereum', icon: 'Ξ', iconClass: 'icon-eth' },
  { ticker: 'SOL', name: 'Solana', icon: '◎', iconClass: 'icon-sol' },
  { ticker: 'ADA', name: 'Cardano', icon: '₳', iconClass: 'icon-ada' },
  { ticker: 'XRP', name: 'Ripple', icon: '✕', iconClass: 'icon-xrp' },
  { ticker: 'AVAX', name: 'Avalanche', icon: '▲', iconClass: 'icon-avax' },
  { ticker: 'DOGE', name: 'Dogecoin', icon: 'Ð', iconClass: 'icon-doge' },
  { ticker: 'LINK', name: 'Chainlink', icon: '⬡', iconClass: 'icon-link' }
]

const PERSONAS = [
  {
    id: 'HODLer',
    badge: '💎 HODLer',
    emoji: '💎',
    title: 'HODLer',
    desc: 'Long-term accumulation, dollar-cost averaging (DCA), and multi-cycle conviction.'
  },
  {
    id: 'Day Trader',
    badge: '⚡ Day Trader',
    emoji: '⚡',
    title: 'Day Trader',
    desc: 'Short-term momentum tracking, intra-day volatility focus, and active risk discipline.'
  },
  {
    id: 'NFT Collector',
    badge: '🎨 NFT Collector',
    emoji: '🎨',
    title: 'NFT Collector',
    desc: 'Digital collectibles, Web3 communities, and on-chain ecosystem activity.'
  },
  {
    id: 'DeFi Yield Farmer',
    badge: '🌾 DeFi Farmer',
    emoji: '🌾',
    title: 'DeFi Farmer',
    desc: 'Liquidity pools, decentralized protocol yields, and on-chain staking focus.'
  }
]

const CONTENT_TYPES = [
  { id: 'Market News', title: 'Market News', desc: 'Curated market updates, macro shifts, and breaking industry news.', icon: '📰' },
  { id: 'Price Charts', title: 'Coin Prices & Trends', desc: 'Live CoinGecko market prices, 24h percentage changes, and trendlines.', icon: '📈' },
  { id: 'AI Insights', title: 'AI Insight of the Day', desc: 'Hugging Face AI executive summary tailored to your investment persona.', icon: '🧠' },
  { id: 'Memes & Culture', title: 'Crypto Memes', desc: 'Dynamic crypto meme refreshed with each dashboard update.', icon: '🎭' }
]

export function Onboarding() {
  const user = useSelector(state => state.userModule.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedAssets, setSelectedAssets] = useState(user?.preferences?.assets || ['BTC', 'ETH', 'SOL'])
  const [selectedPersona, setSelectedPersona] = useState(user?.preferences?.persona || 'HODLer')
  const [selectedContent, setSelectedContent] = useState(user?.preferences?.content || ['Market News', 'Price Charts', 'AI Insights', 'Memes & Culture'])

  const toggleAsset = (ticker) => {
    setSelectedAssets(prev =>
      prev.includes(ticker)
        ? prev.filter(t => t !== ticker)
        : [...prev, ticker]
    )
  }

  const toggleContent = (id) => {
    setSelectedContent(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleReset = () => {
    setSelectedAssets(['BTC', 'ETH', 'SOL'])
    setSelectedPersona('HODLer')
    setSelectedContent(['Market News', 'Price Charts', 'AI Insights', 'Memes & Culture'])
    showSuccessMsg('Selections reset to defaults')
  }

  const handleFinish = async () => {
    const hasAssets = Array.isArray(selectedAssets) && selectedAssets.length > 0
    const hasContent = Array.isArray(selectedContent) && selectedContent.length > 0

    if (!hasAssets && !hasContent) {
      showErrorMsg('Please select at least 1 crypto asset and at least 1 content type')
      return
    }

    if (!hasAssets) {
      showErrorMsg('Please select at least 1 crypto asset')
      return
    }

    if (!hasContent) {
      showErrorMsg('Please select at least 1 content type')
      return
    }

    const personaObj = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0]
    const preferences = {
      assets: selectedAssets,
      persona: selectedPersona,
      personaBadge: personaObj.badge,
      content: selectedContent
    }

    try {
      await dispatch(savePreferences(preferences))
      showSuccessMsg('Preferences saved successfully!')
      navigate('/dashboard')
    } catch (err) {
      const errMsg = err?.response?.data?.err || 'Error saving preferences, please try again'
      showErrorMsg(errMsg)
    }
  }

  return (
    <div className="onboarding-card">
      <div className="onboarding-progress-bar">
        <div className="progress-fill"></div>
      </div>

      <div className="quiz-header">
        <span className="quiz-badge">Personalization Engine</span>
        <h1 className="quiz-title">Let's Tailor Your AI Advisor</h1>
        <p className="quiz-desc">
          Answer 3 quick questions to help our AI curate daily insights, coin alerts, and market signals tailored to you.
        </p>
      </div>

      {/* Question 1: Assets */}
      <div className="question-block">
        <h2 className="question-title">
          <span className="q-num">1</span>
          <span>What crypto assets are you interested in?</span>
        </h2>
        <p className="question-subtext">
          Select the tokens you want featured on your daily price tracker and AI digests.
        </p>

        <div className="asset-grid">
          {AVAILABLE_ASSETS.map((asset) => {
            const isSelected = selectedAssets.includes(asset.ticker)
            return (
              <div
                key={asset.ticker}
                className={`asset-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleAsset(asset.ticker)}
              >
                <div className="asset-info">
                  <div className={`coin-icon ${asset.iconClass}`}>
                    {asset.icon}
                  </div>
                  <div>
                    <div className="asset-name">{asset.name}</div>
                    <div className="asset-ticker">{asset.ticker}</div>
                  </div>
                </div>
                <div className="check-mark">✓</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Question 2: Investor Persona */}
      <div className="question-block">
        <h2 className="question-title">
          <span className="q-num">2</span>
          <span>What type of investor are you?</span>
        </h2>
        <p className="question-subtext">
          This defines the tone, risk factor, and actionable suggestions generated by the LLM.
        </p>

        <div className="persona-grid">
          {PERSONAS.map((persona) => {
            const isSelected = selectedPersona === persona.id
            return (
              <div
                key={persona.id}
                className={`persona-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPersona(persona.id)}
              >
                <div className="persona-emoji">{persona.emoji}</div>
                <h3 className="persona-title">{persona.title}</h3>
                <p className="persona-desc">{persona.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Question 3: Content Preferences */}
      <div className="question-block" style={{ borderBottom: 'none' }}>
        <h2 className="question-title">
          <span className="q-num">3</span>
          <span>What kind of content would you like to see?</span>
        </h2>
        <p className="question-subtext">
          Choose your daily feed composition (select all that match your routine).
        </p>

        <div className="content-grid">
          {CONTENT_TYPES.map((content) => {
            const isSelected = selectedContent.includes(content.id)
            return (
              <div
                key={content.id}
                className={`content-option ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleContent(content.id)}
              >
                <span className="content-icon">{content.icon}</span>
                <div>
                  <h3 className="content-title">{content.title}</h3>
                  <p className="content-desc">{content.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="onboarding-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleReset}
        >
          Reset Selections
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ maxWidth: '320px' }}
          onClick={handleFinish}
        >
          <span>Save Preferences & Open Dashboard</span>
          <span>✨</span>
        </button>
      </div>
    </div>
  )
}
