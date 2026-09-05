import React, { useState, useEffect } from 'react'

export function VotingBar({ prompt, userVote = null, onVote, sectionName = 'section' }) {
  const [activeVote, setActiveVote] = useState(userVote || null)

  useEffect(() => {
    setActiveVote(userVote || null)
  }, [userVote])

  const handleVote = (voteType) => {
    if (activeVote === voteType) {
      // Repeated click on the same choice does not create an additional vote
      return
    }

    // Change vote (up -> down or down -> up or first vote)
    setActiveVote(voteType)
    onVote?.(voteType)
  }

  return (
    <div className="section-voting-bar">
      <div className="voting-prompt">
        <span>{prompt}</span>
      </div>
      <div className="voting-btns">
        <button
          type="button"
          className={`vote-btn ${activeVote === 'up' ? 'voted-up' : ''}`}
          onClick={() => handleVote('up')}
          title="Relevant / Good (Thumbs Up)"
        >
          <span>👍</span>
        </button>
        <button
          type="button"
          className={`vote-btn ${activeVote === 'down' ? 'voted-down' : ''}`}
          onClick={() => handleVote('down')}
          title="Not Relevant / Dislike (Thumbs Down)"
        >
          <span>👎</span>
        </button>
      </div>
    </div>
  )
}
