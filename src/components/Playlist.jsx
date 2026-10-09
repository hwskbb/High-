import { formatTime } from '../utils/music'

export default function Playlist({ tracks, currentId, onSelect, onRemove }) {
  if (!tracks.length) {
    return (
      <div className="playlist empty">
        <p>播放列表为空</p>
        <p className="hint">添加本地音乐、网络音频或使用示例音乐</p>
      </div>
    )
  }

  return (
    <div className="playlist">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={`playlist-item ${track.id === currentId ? 'playing' : ''}`}
          onClick={() => onSelect(index)}
        >
          <div className="track-info">
            <span className="track-index">{index + 1}</span>
            <img
              src={track.cover}
              alt=""
              className="track-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="track-meta">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist} {track.duration ? `· ${formatTime(track.duration)}` : ''}</div>
            </div>
          </div>
          <button
            className="btn-remove"
            onClick={(e) => { e.stopPropagation(); onRemove(index) }}
            title="删除"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
