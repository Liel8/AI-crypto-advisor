import axios from 'axios'
import { logger } from './logger.service.js'

export const coingeckoService = {
  getCoinPrices
}

let cache = {
  timestamp: 0,
  data: null
}
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

const COIN_ID_MAP = {
  BTC: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿', iconClass: 'icon-btc' },
  ETH: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', iconClass: 'icon-eth' },
  SOL: { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎', iconClass: 'icon-sol' },
  ADA: { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳', iconClass: 'icon-ada' },
  XRP: { id: 'ripple', name: 'Ripple', symbol: 'XRP', icon: '✕', iconClass: 'icon-xrp' },
  AVAX: { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', icon: '▲', iconClass: 'icon-avax' },
  DOGE: { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', icon: 'Ð', iconClass: 'icon-doge' },
  LINK: { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', icon: '⬡', iconClass: 'icon-link' }
}

async function getCoinPrices(requestedAssets = ['BTC', 'ETH', 'SOL']) {
  const assets = requestedAssets.length ? requestedAssets : ['BTC', 'ETH', 'SOL']

  // Return from cache if fresh
  if (cache.data && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return _formatCoinsForUser(cache.data, assets)
  }

  try {
    const ids = Object.values(COIN_ID_MAP).map(c => c.id).join(',')
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`

    const res = await axios.get(url, { timeout: 4000 })
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      cache = {
        timestamp: Date.now(),
        data: res.data
      }
      return _formatCoinsForUser(res.data, assets)
    }
  } catch (err) {
    logger.warn('CoinGecko API error or rate limit:', err.message)
  }

  // If CoinGecko fails and no cache, return coins with unavailable status (no fabricated data)
  return assets.map(ticker => {
    const meta = COIN_ID_MAP[ticker] || { id: ticker.toLowerCase(), name: ticker, symbol: ticker, icon: '🪙', iconClass: 'icon-btc' }
    return {
      id: meta.id,
      symbol: meta.symbol,
      name: meta.name,
      icon: meta.icon,
      iconClass: meta.iconClass,
      current_price: null,
      price_change_percentage_24h: null,
      error: 'Price unavailable'
    }
  })
}

function _formatCoinsForUser(apiData, requestedAssets) {
  return requestedAssets.map(ticker => {
    const meta = COIN_ID_MAP[ticker] || { id: ticker.toLowerCase(), name: ticker, symbol: ticker, icon: '🪙', iconClass: 'icon-btc' }
    const matched = apiData.find(c => c.id === meta.id || c.symbol.toUpperCase() === ticker)

    if (matched && matched.current_price !== undefined && matched.current_price !== null) {
      return {
        id: matched.id,
        symbol: ticker,
        name: matched.name,
        icon: meta.icon,
        iconClass: meta.iconClass,
        current_price: matched.current_price,
        price_change_percentage_24h: matched.price_change_percentage_24h ?? null
      }
    }

    return {
      id: meta.id,
      symbol: meta.symbol,
      name: meta.name,
      icon: meta.icon,
      iconClass: meta.iconClass,
      current_price: null,
      price_change_percentage_24h: null,
      error: 'Price unavailable'
    }
  })
}
