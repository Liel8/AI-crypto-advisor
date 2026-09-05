import React from 'react'

export function CoinPreview({ coin }) {
  const hasPrice = coin.current_price !== null && coin.current_price !== undefined
  const hasChange = coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
  const change = coin.price_change_percentage_24h
  const isUp = hasChange && change >= 0
  const changeClass = isUp ? 'change-up' : 'change-down'
  const changeSymbol = isUp ? '▲ +' : '▼ '

  return (
    <div className="coin-row">
      <div className="coin-lead">
        <div className={`coin-badge ${coin.iconClass || 'icon-btc'}`}>
          {coin.icon || '🪙'}
        </div>
        <div>
          <div className="coin-title">{coin.name}</div>
          <div className="coin-code">{coin.symbol?.toUpperCase()} / USD</div>
        </div>
      </div>

      <div className="coin-meta">
        {hasPrice ? (
          <>
            <div className="coin-price">
              ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {hasChange ? (
              <div className={`coin-change ${changeClass}`}>
                {changeSymbol}{Math.abs(change).toFixed(2)}%
              </div>
            ) : (
              <div className="coin-change" style={{ color: 'var(--text-muted)' }}>
                --
              </div>
            )}
          </>
        ) : (
          <>
            <div className="coin-price" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Unavailable
            </div>
            <div className="coin-change" style={{ color: 'var(--text-muted)' }}>
              --
            </div>
          </>
        )}
      </div>
    </div>
  )
}
