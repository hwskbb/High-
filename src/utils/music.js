// 内置示例音乐（使用公开免费的音频直链）
export const sampleTracks = [
  {
    id: 'sample-1',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    album: 'Demo Album',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/music1/300/300',
    lyrics: '',
    source: 'sample',
  },
  {
    id: 'sample-2',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    album: 'Demo Album',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/music2/300/300',
    lyrics: '',
    source: 'sample',
  },
  {
    id: 'sample-3',
    title: 'SoundHelix Song 3',
    artist: 'SoundHelix',
    album: 'Demo Album',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/music3/300/300',
    lyrics: '',
    source: 'sample',
  },
]

// 解析 LRC 格式歌词
export function parseLRC(lrc) {
  if (!lrc) return []
  const lines = lrc.split('\n')
  const result = []
  const timeRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g

  for (const line of lines) {
    const matches = [...line.matchAll(timeRegex)]
    const text = line.replace(timeRegex, '').trim()
    if (!text && matches.length === 0) continue
    for (const m of matches) {
      const minutes = parseInt(m[1], 10)
      const seconds = parseInt(m[2], 10)
      const millis = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0
      const time = minutes * 60 + seconds + millis / 1000
      result.push({ time, text })
    }
  }
  return result.sort((a, b) => a.time - b.time)
}

// 格式化时间 mm:ss
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
