import { useState } from 'react'
import { formatTime } from '../utils/music'

// iTunes Search API: 免费、官方、提供 30 秒试听片段
const API_URL = 'https://itunes.apple.com/search'

export default function SearchMusic({ onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const search = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])

    try {
      const url = `${API_URL}?term=${encodeURIComponent(query)}&entity=song&limit=30`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const tracks = (data.results || [])
        .filter((item) => item.previewUrl)
        .map((item, i) => ({
          id: `itunes-${item.trackId || i}`,
          title: item.trackName,
          artist: item.artistName,
          album: item.collectionName,
          url: item.previewUrl,
          // 将 100x100 封面升级为 300x300
          cover: (item.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
          lyrics: '',
          source: 'online',
          duration: item.trackTimeMillis ? item.trackTimeMillis / 1000 : 0,
        }))

      setResults(tracks)
      if (tracks.length === 0) setError('未找到匹配结果，请尝试其他关键词')
    } catch (err) {
      setError('搜索失败，请检查网络后重试（仅支持官方试听片段）')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-music">
      <form className="search-bar" onSubmit={search}>
        <input
          type="text"
          placeholder="搜索歌曲 / 艺术家 / 专辑（iTunes 官方试听片段）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? '搜索中...' : '🔍 搜索'}
        </button>
      </form>

      {error && <p className="search-error">{error}</p>}

      {results.length > 0 && (
        <div className="search-results">
          <p className="results-count">找到 {results.length} 首试听片段</p>
          {results.map((track) => (
            <div key={track.id} className="search-item">
              <img
                src={track.cover}
                alt=""
                className="track-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div className="track-meta">
                <div className="track-title">{track.title}</div>
                <div className="track-artist">
                  {track.artist}
                  {track.duration ? ` · ${formatTime(track.duration)}` : ''}
                  <span className="badge">30s 试听</span>
                </div>
              </div>
              <button className="btn primary small" onClick={() => onAdd(track)}>
                + 添加
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
