import { useState } from 'react'
import { formatTime } from '../utils/music'

const MODES = ['list', 'single', 'shuffle']
const MODE_LABELS = { list: '列表循环', single: '单曲循环', shuffle: '随机播放' }
const MODE_ICONS = { list: '🔁', single: '🔂', shuffle: '🔀' }

export default function Player({
  track, isPlaying, currentTime, duration, volume, mode,
  onPlayPause, onPrev, onNext, onSeek, onVolume, onToggleMode,
}) {
  const [showVolume, setShowVolume] = useState(false)

  const progress = duration ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    onSeek(pct * duration)
  }

  return (
    <div className="player">
      <div className="player-cover">
        <img
          src={track?.cover}
          alt={track?.title}
          className={isPlaying ? 'rotating' : ''}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/default/300/300` }}
        />
        <div className="cover-overlay">
          {!track?.url && <div className="no-track">请添加音乐</div>}
        </div>
      </div>

      <div className="player-info">
        <h2 className="player-title">{track?.title || '暂无歌曲'}</h2>
        <p className="player-artist">{track?.artist || '—'} {track?.album ? `· ${track.album}` : ''}</p>
      </div>

      <div className="progress-wrap" onClick={handleProgressClick}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <div className="progress-thumb" style={{ left: `${progress}%` }} />
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls">
        <button
          className="ctrl-btn mode"
          onClick={onToggleMode}
          title={MODE_LABELS[mode]}
        >
          {MODE_ICONS[mode]}
        </button>
        <button className="ctrl-btn" onClick={onPrev} disabled={!track}>⏮</button>
        <button
          className="ctrl-btn play"
          onClick={onPlayPause}
          disabled={!track}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="ctrl-btn" onClick={onNext} disabled={!track}>⏭</button>

        <div className="volume-wrap" onMouseEnter={() => setShowVolume(true)} onMouseLeave={() => setShowVolume(false)}>
          <button className="ctrl-btn vol">🔊</button>
          <div className={`volume-slider ${showVolume ? 'show' : ''}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolume(parseFloat(e.target.value))}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <div className="mode-label">当前模式：{MODE_LABELS[mode]}</div>
    </div>
  )
}
