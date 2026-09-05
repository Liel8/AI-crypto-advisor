export const memeService = {
  getRandomMeme
}

const MEMES_COLLECTION = [
  {
    id: 'meme-1',
    imgUrl: '/assets/meme1.jpg',
    caption: '“The duality of man: Bull vs Bear watching 1-minute crypto candles.”'
  },
  {
    id: 'meme-2',
    imgUrl: '/assets/meme2.jpg',
    caption: '“I bought the dip, but it kept dipping! 😭💀”'
  },
  {
    id: 'meme-3',
    imgUrl: '/assets/meme3.jpg',
    caption: '“Holding on for dear life on the Bitcoin volatility roller coaster!”'
  },
  {
    id: 'meme-4',
    imgUrl: '/assets/meme4.jpg',
    caption: '“Market panic and red candles everywhere, but my Diamond Hands are steady.”'
  },
  {
    id: 'meme-5',
    imgUrl: '/assets/meme5.jpg',
    caption: '“One small step for Doge, one giant leap for crypto to the moon!”'
  },
  {
    id: 'meme-6',
    imgUrl: '/assets/meme6.jpg',
    caption: '“When the transaction fee receipt costs more than your entire portfolio.”'
  },
  {
    id: 'meme-7',
    imgUrl: '/assets/meme7.jpg',
    caption: '“Just checking the 15-minute candlestick chart one last time at 3:00 AM...”'
  }
]

async function getRandomMeme(excludeId = null) {
  const available = MEMES_COLLECTION.filter(m => m.id !== excludeId)
  const pool = available.length ? available : MEMES_COLLECTION
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}
