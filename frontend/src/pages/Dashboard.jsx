import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadDashboard,
  fetchNextMeme,
  regenerateInsight,
  voteSection
} from '../store/dashboard.actions.js'
import { CLEAR_DASHBOARD } from '../store/dashboard.reducer.js'
import { CoinList } from '../cmps/CoinList.jsx'
import { NewsFeed } from '../cmps/NewsFeed.jsx'
import { AiInsightCard } from '../cmps/AiInsightCard.jsx'
import { CryptoMemeCard } from '../cmps/CryptoMemeCard.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userModule.user)
  const dashboard = useSelector(state => state.dashboardModule.data)
  const isLoading = useSelector(state => state.dashboardModule.isLoading)
  const isAiLoading = useSelector(state => state.dashboardModule.isAiLoading)


  useEffect(() => {
    if (user?._id) {
      dispatch(loadDashboard(user?.preferences, user?._id))
    }
    return () => {
      dispatch({ type: CLEAR_DASHBOARD })
    }
  }, [dispatch, user?._id, JSON.stringify(user?.preferences)])

  const handleRefreshCoins = async () => {
    try {
      const freshDashboard = await dispatch(loadDashboard(user?.preferences, user?._id))
      const coins = freshDashboard?.sections?.coins?.items || []
      const hasValidPrice = coins.some(c => c.current_price !== null && c.current_price !== undefined)
      if (coins.length > 0 && !hasValidPrice) {
        showErrorMsg('CoinGecko prices temporarily unavailable')
        return
      }
    } catch (err) {
      showErrorMsg('Failed to update CoinGecko prices')
    }
  }

  const handleRegenerateAi = async () => {
    const insight = await dispatch(regenerateInsight(user?._id))

    if (!insight) {
      showErrorMsg('Failed to generate AI insight')
    }
  }

  const handleNextMeme = async () => {
    try {
      const currentId = dashboard?.sections?.meme?.data?.id
      await dispatch(fetchNextMeme(currentId))
    } catch (err) {
      showErrorMsg('Failed to load next meme')
    }
  }

  const handleVote = (section, vote) => {
    dispatch(voteSection(section, vote, user?.preferences?.persona))
  }

  // Strictly render loading state while fetching or when no dashboard exists
  if (isLoading || !dashboard) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <h2 className="loading-title">Curating Personalized Dashboard...</h2>
        <p className="loading-subtext">Fetching real-time market data, AI insights, and your personalized preferences</p>
      </div>
    )
  }

  const sections = dashboard?.sections || {}
  const rawPersona = user?.preferences?.persona || user?.preferences?.personaBadge || dashboard?.personaBadge || 'HODLer'
  const personaName = rawPersona.replace(/^[^\w\s]+\s*/, '').trim() || 'HODLer'
  const assets = user?.preferences?.assets || dashboard?.assets || []
  const contentPreferences = user?.preferences?.content || dashboard?.content || ['Market News', 'Price Charts', 'AI Insights', 'Memes & Culture']

  // Determine section visibility based on user preferences in MongoDB
  const showCoins = contentPreferences.includes('Price Charts') || contentPreferences.includes('Charts') || contentPreferences.length === 0
  const showNews = contentPreferences.includes('Market News') || contentPreferences.length === 0
  const showAi = contentPreferences.includes('AI Insights') || contentPreferences.length === 0
  const showMeme = contentPreferences.includes('Memes & Culture') || contentPreferences.includes('Fun') || contentPreferences.length === 0

  return (
    <div>
      {/* Dashboard Greeting Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dash-greeting">
            Welcome, {user?.fullname || 'Investor'}!
          </h1>
          <div className="active-profile-pills">
            <span className="filter-pill persona-pill">{personaName}</span>
            {assets.map((asset) => (
              <span key={asset} className="filter-pill">{asset}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Core Sections Grid - Personalized by User Content Preferences */}
      <div className="dashboard-grid">
        {/* 1. Coin Prices */}
        {showCoins && (
          <CoinList
            coins={sections.coins?.items}
            userVote={sections.coins?.userVote}
            onVote={handleVote}
            onRefresh={handleRefreshCoins}
          />
        )}

        {/* 2. Market News */}
        {showNews && (
          <NewsFeed
            news={sections.news?.items}
            userVote={sections.news?.userVote}
            onVote={handleVote}
          />
        )}

        {/* 3. AI Insight of the Day */}
        {showAi && (
          <AiInsightCard
            insight={sections.aiInsight?.data}
            isLoading={isAiLoading || !sections.aiInsight?.data}
            persona={personaName}
            userVote={sections.aiInsight?.userVote}
            onVote={handleVote}
            onRegenerate={handleRegenerateAi}
          />
        )}


        {/* 4. Fun Crypto Meme */}
        {showMeme && (
          <CryptoMemeCard
            meme={sections.meme?.data}
            userVote={sections.meme?.userVote}
            onVote={handleVote}
            onNextMeme={handleNextMeme}
          />
        )}
      </div>
    </div>
  )
}
