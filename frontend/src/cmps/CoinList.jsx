import React from 'react'
import { CoinPreview } from './CoinPreview.jsx'
import { VotingBar } from './VotingBar.jsx'

export function CoinList({ coins = [], userVote, onVote, onRefresh }) {
  return (
    <div className="dash-section-card" id="section-prices">
      <div className="card-top-bar">
        <div className="card-title-group">
          <div>
            <h2 className="card-heading">Coin Prices</h2>
            <span className="api-source-badge">CoinGecko API • Market Data</span>
          </div>
        </div>
        <button
          type="button"
          className="btn-ghost-sm"
          onClick={onRefresh}
          title="Refresh CoinGecko prices"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="coin-list">
        {coins.map((coin) => (
          <CoinPreview key={coin.id || coin.symbol} coin={coin} />
        ))}
      </div>

      <VotingBar
        prompt="Was this market snapshot useful?"
        userVote={userVote}
        onVote={(vote) => onVote?.('coins', vote)}
      />
    </div>
  )
}
