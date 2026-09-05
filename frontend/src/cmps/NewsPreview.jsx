import React from 'react'

export function NewsPreview({ news }) {
  return (
    <a
      href={news.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="news-item"
    >
      <div className="news-meta-row">
        <span className="news-source">{news.source}</span>
        <span className="news-tag">{news.category} • {news.publishedDate}</span>
      </div>
      <h3 className="news-headline">{news.title}</h3>
      <p className="news-snippet">{news.snippet}</p>
    </a>
  )
}
