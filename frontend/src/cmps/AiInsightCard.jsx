import React, { useState } from 'react'
import { VotingBar } from './VotingBar.jsx'

export function AiInsightCard({ insight, isLoading = false, persona, userVote, onVote, onRegenerate }) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      await onRegenerate?.()
    } finally {
      setIsRegenerating(false)
    }
  }

  const isBusy = isLoading || isRegenerating
  const data = insight || null

  return (
    <div className="dash-section-card" id="section-ai">
      <div className="card-top-bar">
        <div className="card-title-group">
          <div>
            <h2 className="card-heading">AI Insight</h2>
            <span className="api-source-badge">Hugging Face Inference API</span>
          </div>
        </div>
        <span className="ai-sentiment-badge">
          {data?.sentiment || (isBusy ? 'Generating AI Insight...' : 'AI Market Perspective')}
        </span>
      </div>

      <div className="ai-insight-box">
        {isBusy && !data ? (
          <div className="ai-card-loading">
            <div className="ai-spinner"></div>
            <div className="ai-loading-text">
              <strong>Generating your personalized AI insight...</strong>
              <span>Based on your investor profile and selected assets</span>
            </div>
          </div>
        ) : (
          <p className="ai-insight-text" style={{ whiteSpace: 'pre-line' }}>
            {data?.text || 'No AI insight available at the moment.'}
          </p>
        )}

        <button
          type="button"
          className="ai-regenerate-btn"
          disabled={isBusy}
          onClick={handleRegenerate}
        >
          <span>{isBusy ? 'Querying Hugging Face...' : 'Regenerate Insight'}</span>
        </button>
      </div>

      <VotingBar
        prompt="Was this insight useful?"
        userVote={userVote}
        onVote={(vote) => onVote?.('aiInsight', vote)}
      />
    </div>
  )
}

