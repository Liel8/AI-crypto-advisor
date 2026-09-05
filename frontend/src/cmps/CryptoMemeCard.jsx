import React from 'react'
import { VotingBar } from './VotingBar.jsx'

export function CryptoMemeCard({ meme, userVote, onVote, onNextMeme }) {
  return (
    <div className="dash-section-card" id="section-meme">
      <div className="card-top-bar">
        <div className="card-title-group">
          <div className="card-section-icon icon-bg-meme">🎭</div>
          <div>
            <h2 className="card-heading">Daily Crypto Meme</h2>
            <span className="api-source-badge">Local Meme Collection • Dynamic</span>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#f472b6' }}>Community Culture</span>
      </div>

      <div className="meme-container">
        {meme ? (
          <>
            <div className="meme-wrapper">
              <img
                src={meme.imgUrl}
                alt="Daily Crypto Meme"
                className="meme-img"
              />
            </div>

            <p className="meme-caption">{meme.caption}</p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-muted)' }}>
            <p>Meme unavailable</p>
          </div>
        )}

        <div className="meme-controls">
          <button
            type="button"
            className="meme-next-btn"
            onClick={onNextMeme}
          >
            <span>🎲</span>
            <span>Show Another Meme</span>
          </button>
        </div>
      </div>

      <VotingBar
        prompt="😂 Did this meme brighten your trading day?"
        userVote={userVote}
        sectionName="meme"
        onVote={(vote) => onVote?.('meme', vote)}
      />
    </div>
  )
}
