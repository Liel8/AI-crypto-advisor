import React from 'react'
import { NewsPreview } from './NewsPreview.jsx'
import { VotingBar } from './VotingBar.jsx'

export function NewsFeed({ news = [], userVote, onVote }) {
  return (
    <div className="dash-section-card" id="section-news">
      <div className="card-top-bar">
        <div className="card-title-group">
          <div>
            <h2 className="card-heading">Market News</h2>
            <span className="api-source-badge">Static News Digest</span>
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Curated Digest</span>
      </div>

      <div className="news-feed">
        {news.map((item) => (
          <NewsPreview key={item.id} news={item} />
        ))}
      </div>

      <VotingBar
        prompt="Was this news useful?"
        userVote={userVote}
        onVote={(vote) => onVote?.('news', vote)}
      />
    </div>
  )
}
