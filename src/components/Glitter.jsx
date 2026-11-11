import { useMemo, useRef } from 'react'
import { useInView } from 'framer-motion'

// Bộ số ngẫu nhiên có seed → vị trí sao ổn định giữa các lần render
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

// Lớp sao lấp lánh + mũ cử nhân bay lơ lửng. Đặt vào 1 khung `relative`/`absolute`, tự pointer-events-none.
// tone: 'light' (nền tối) | 'dark' (nền sáng)
export default function Glitter({ count = 24, caps = 0, seed = 7, tone = 'light', paused = false, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '80px' })   // ra khỏi màn hình → dừng hẳn animation, không tốn GPU khi cuộn
  const { stars, capList } = useMemo(() => {
    const r = rng(seed)
    const palette = tone === 'dark' ? ['#2b5cff', '#6fa0ff', '#ffc94d', '#9ec5ff'] : ['#ffffff', '#ffe9a8', '#9ec5ff', '#ffc94d']
    return {
      stars: Array.from({ length: count }, () => ({
        x: r() * 100, y: r() * 100, s: 8 + r() * 16, d: r() * 5, t: 2.4 + r() * 3.2, c: palette[Math.floor(r() * palette.length)], g: r() > 0.5 ? '✦' : '✧',
      })),
      capList: Array.from({ length: caps }, (_, i) => ({
        x: 4 + r() * 88, s: 18 + r() * 16, d: (i / Math.max(caps, 1)) * 16 + r() * 3, t: 13 + r() * 9, dx: Math.round((r() - 0.5) * 90),
      })),
    }
  }, [count, caps, seed, tone])

  return (
    <div ref={ref} aria-hidden className={`glitter pointer-events-none overflow-hidden ${paused || !inView ? 'glitter-off' : ''} ${className}`}>
      {stars.map((p, i) => (
        <span key={i} className="twinkle" style={{ left: `${p.x}%`, top: `${p.y}%`, fontSize: p.s, color: p.c, animationDelay: `${p.d}s`, animationDuration: `${p.t}s` }}>{p.g}</span>
      ))}
      {capList.map((p, i) => (
        <span key={`c${i}`} className="cap-float" style={{ left: `${p.x}%`, fontSize: p.s, '--dx': `${p.dx}px`, animationDelay: `-${p.d}s`, animationDuration: `${p.t}s` }}>🎓</span>
      ))}
    </div>
  )
}
