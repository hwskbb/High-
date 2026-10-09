import { useState, useRef, useEffect, useCallback } from 'react'
import Player from './components/Player'
import Playlist from './components/Playlist'
import Lyrics from './components/Lyrics'
import Visualizer from './components/Visualizer'
import AddTrack from './components/AddTrack'
import SearchMusic from './components/SearchMusic'
import { sampleTracks } from './utils/music'

const PLAY_MODES = ['list', 'single', 'shuffle']

export default function App() {
  const [tracks, setTracks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [mode, setMode] = useState('list')
  const [tab, setTab] = useState('playlist') // playlist | search | lyrics

  const audioRef = useRef(null)

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null

  // 播放指定索引
  const playTrack = useCallback((index) => {
    if (index < 0 || index >= tracks.length) return
    setCurrentIndex(index)
    setIsPlaying(true)
  }, [tracks.length])

  // 添加歌曲
  const handleAddTrack = (track) => {
    setTracks((prev) => {
      const next = [...prev, track]
      if (currentIndex === -1) {
        setCurrentIndex(0)
        setIsPlaying(true)
      }
      return next
    })
  }

  // 加载示例
  const handleLoadSamples = () => {
    setTracks((prev) => {
      const existing = new Set(prev.filter(t => t.source === 'sample').map(t => t.id))
      const newSamples = sampleTracks.filter(s => !existing.has(s.id))
      const next = [...prev, ...newSamples]
      if (currentIndex === -1 && next.length) {
        setCurrentIndex(0)
        setIsPlaying(true)
      }
      return next
    })
  }

  // 删除歌曲
  const handleRemove = (index) => {
    setTracks((prev) => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) {
        setCurrentIndex(-1)
        setIsPlaying(false)
      } else if (index === currentIndex) {
        const newIndex = Math.min(index, next.length - 1)
        setCurrentIndex(newIndex)
        setIsPlaying(true)
      } else if (index < currentIndex) {
        setCurrentIndex((i) => i - 1)
      }
      return next
    })
  }

  // 切换播放/暂停
  const togglePlay = () => {
    if (!currentTrack) return
    setIsPlaying((p) => !p)
  }

  // 上一首
  const playPrev = () => {
    if (mode === 'shuffle' && tracks.length > 1) {
      let r = Math.floor(Math.random() * tracks.length)
      if (r === currentIndex) r = (r + 1) % tracks.length
      playTrack(r)
    } else {
      const idx = (currentIndex - 1 + tracks.length) % tracks.length
      playTrack(idx)
    }
  }

  // 下一首
  const playNext = () => {
    if (mode === 'shuffle' && tracks.length > 1) {
      let r = Math.floor(Math.random() * tracks.length)
      if (r === currentIndex) r = (r + 1) % tracks.length
      playTrack(r)
    } else {
      const idx = (currentIndex + 1) % tracks.length
      playTrack(idx)
    }
  }

  // 播放结束处理
  const handleEnded = () => {
    if (mode === 'single') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      playNext()
    }
  }

  // 控制 audio 元素
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying && currentTrack) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [isPlaying, currentIndex])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // 切换歌曲时重置
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [currentIndex])

  const handleSeek = (time) => {
    if (audioRef.current) audioRef.current.currentTime = time
  }

  const toggleMode = () => {
    setMode((m) => {
      const i = PLAY_MODES.indexOf(m)
      return PLAY_MODES[(i + 1) % PLAY_MODES.length]
    })
  }

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      <header className="app-header">
        <h1>🎵 网络音乐播放器</h1>
        <p className="subtitle">支持本地上传 / 网络直链 / 示例音乐</p>
      </header>

      <div className="app-body">
        <div className="left-panel">
          <Player
            track={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            mode={mode}
            onPlayPause={togglePlay}
            onPrev={playPrev}
            onNext={playNext}
            onSeek={handleSeek}
            onVolume={setVolume}
            onToggleMode={toggleMode}
          />
          <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
        </div>

        <div className="right-panel">
          <AddTrack onAdd={handleAddTrack} onLoadSamples={handleLoadSamples} />

          <div className="tabs">
            <button
              className={`tab ${tab === 'playlist' ? 'active' : ''}`}
              onClick={() => setTab('playlist')}
            >
              播放列表 ({tracks.length})
            </button>
            <button
              className={`tab ${tab === 'search' ? 'active' : ''}`}
              onClick={() => setTab('search')}
            >
              🔍 在线搜索
            </button>
            <button
              className={`tab ${tab === 'lyrics' ? 'active' : ''}`}
              onClick={() => setTab('lyrics')}
            >
              歌词
            </button>
          </div>

          {tab === 'playlist' ? (
            <Playlist
              tracks={tracks}
              currentId={currentTrack?.id}
              onSelect={playTrack}
              onRemove={handleRemove}
            />
          ) : tab === 'search' ? (
            <SearchMusic onAdd={handleAddTrack} />
          ) : (
            <Lyrics lyricsText={currentTrack?.lyrics || ''} currentTime={currentTime} />
          )}
        </div>
      </div>

      <footer className="app-footer">
        <span>🎧 提示：上传本地音乐或粘贴音频直链即可播放</span>
      </footer>
    </div>
  )
}
