import { useEffect, useRef } from 'react'
import { parseLRC } from '../utils/music'

export default function Lyrics({ lyricsText, currentTime }) {
  const containerRef = useRef(null)
  const activeRef = useRef(null)

  const lines = parseLRC(lyricsText)

  let activeIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (currentTime >= lines[i].time) activeIndex = i
    else break
  }

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current
      const active = activeRef.current
      const offset = active.offsetTop - container.clientHeight / 2 + active.clientHeight / 2
      container.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }, [activeIndex])

  if (!lines.length) {
    return (
      <div className="lyrics empty">
        <p>暂无歌词</p>
        <p className="hint">可在添加歌曲时粘贴 LRC 格式歌词</p>
      </div>
    )
  }

  return (
    <div className="lyrics" ref={containerRef}>
      {lines.map((line, i) => (
        <p
          key={i}
          ref={i === activeIndex ? activeRef : null}
          className={`lyric-line ${i === activeIndex ? 'active' : ''}`}
        >
          {line.text || '♪'}
        </p>
      ))}
    </div>
  )
}
