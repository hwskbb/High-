import { useEffect, useRef } from 'react'

export default function Visualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null)
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    const setupAudio = () => {
      const audio = audioRef.current
      if (!audio) return
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyserRef.current = audioCtxRef.current.createAnalyser()
        analyserRef.current.fftSize = 128
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audio)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioCtxRef.current.destination)
      }
    }

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      const analyser = analyserRef.current
      const bufferLength = analyser ? analyser.frequencyBinCount : 64
      const dataArray = analyser ? new Uint8Array(bufferLength) : new Uint8Array(64)
      if (analyser) analyser.getByteFrequencyData(dataArray)

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const bars = 48
      const barWidth = w / bars
      const step = Math.floor(dataArray.length / bars)

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step] || 0
        const barHeight = (value / 255) * h * 0.9
        const x = i * barWidth
        const y = h - barHeight
        const gradient = ctx.createLinearGradient(0, y, 0, h)
        gradient.addColorStop(0, '#a78bfa')
        gradient.addColorStop(1, '#7c3aed')
        ctx.fillStyle = gradient
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight)
      }
    }

    // 延迟设置音频源，避免跨域问题
    const timer = setTimeout(setupAudio, 100)
    draw()

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [audioRef])

  return (
    <canvas
      ref={canvasRef}
      className="visualizer"
      style={{ opacity: isPlaying ? 1 : 0.4 }}
    />
  )
}
