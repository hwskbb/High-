import { useState, useRef } from 'react'

export default function AddTrack({ onAdd, onLoadSamples }) {
  const [showForm, setShowForm] = useState(false)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [cover, setCover] = useState('')
  const [lyrics, setLyrics] = useState('')
  const fileInputRef = useRef(null)

  const handleAddUrl = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    onAdd({
      id: `url-${Date.now()}`,
      title: title.trim() || '未知歌曲',
      artist: artist.trim() || '未知艺术家',
      album: '网络音乐',
      url: url.trim(),
      cover: cover.trim() || `https://picsum.photos/seed/${Date.now()}/300/300`,
      lyrics,
      source: 'url',
    })
    setUrl(''); setTitle(''); setArtist(''); setCover(''); setLyrics('')
    setShowForm(false)
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const fileUrl = URL.createObjectURL(file)
      onAdd({
        id: `local-${Date.now()}-${Math.random()}`,
        title: file.name.replace(/\.[^.]+$/, ''),
        artist: '本地音乐',
        album: '本地音乐',
        url: fileUrl,
        cover: `https://picsum.photos/seed/${file.name}/300/300`,
        lyrics: '',
        source: 'local',
      })
    })
    e.target.value = ''
  }

  return (
    <div className="add-track">
      <div className="add-actions">
        <button className="btn primary" onClick={() => fileInputRef.current?.click()}>
          📁 上传本地音乐
        </button>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          🔗 网络音频 URL
        </button>
        <button className="btn" onClick={onLoadSamples}>
          ✨ 加载示例音乐
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFiles}
        />
      </div>

      {showForm && (
        <form className="add-form" onSubmit={handleAddUrl}>
          <input
            type="url"
            placeholder="音频直链 URL (https://... .mp3)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="歌曲名（可选）"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="艺术家（可选）"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <input
            type="url"
            placeholder="封面图片 URL（可选）"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
          <textarea
            placeholder="LRC 歌词（可选，例：[00:12.00]歌词内容）"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={3}
          />
          <div className="form-actions">
            <button type="submit" className="btn primary">添加到列表</button>
            <button type="button" className="btn" onClick={() => setShowForm(false)}>取消</button>
          </div>
        </form>
      )}
    </div>
  )
}
