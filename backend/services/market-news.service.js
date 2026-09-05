export const marketNewsService = {
  getMarketNews
}

const STATIC_MARKET_NEWS = [
  {
    id: 'news-1',
    source: 'CoinDesk',
    publishedDate: 'Sep 1, 2026',
    category: 'Macro Outlook',
    title: 'Bitcoin and the September Market Outlook',
    snippet: 'Historical September seasonality and macroeconomic rate hike considerations influence Bitcoin market momentum following August trading.',
    url: 'https://www.coindesk.com/markets/2026/09/01/bitcoin-enters-rektember-as-rate-hike-risks-threaten-its-august-rally'
  },
  {
    id: 'news-2',
    source: 'The Block',
    publishedDate: 'Sep 3, 2026',
    category: 'Market Cap',
    title: 'Crypto Market Moves Higher Alongside Stocks',
    snippet: 'Total digital asset market capitalization expands in tandem with equities as broad risk sentiment improves across global financial markets.',
    url: 'https://www.theblock.co/news/markets/2026-09-03-crypto-market-cap-surges-2-82-trillion-zcash-leads-rally-alongside-stocks-413478'
  },
  {
    id: 'news-3',
    source: 'Decrypt',
    publishedDate: 'Sep 2, 2026',
    category: 'Adoption',
    title: 'Major Banks Plan Joint U.S. Dollar Stablecoin',
    snippet: 'A group of major global banks and financial institutions is working on a shared U.S. dollar stablecoin for digital payments and settlement.',
    url: 'https://decrypt.co/377216/goldman-sachs-bofa-banks-stablecoin'
  },
  {
    id: 'news-4',
    source: 'Decrypt',
    publishedDate: 'Sep 2, 2026',
    category: 'Regulation',
    title: 'Crypto Industry Pushes SEC for Tailored ETF Rules',
    snippet: 'Crypto firms and financial groups are urging the SEC to develop appropriate rules for a new generation of exchange-traded products.',
    url: 'https://decrypt.co/377184/crypto-groups-sec-novel-etfs'
  }
]

async function getMarketNews() {
  return STATIC_MARKET_NEWS
}
