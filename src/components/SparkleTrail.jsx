import { useEffect, useRef } from 'react'

// Vệt sao lấp lánh theo con trỏ chuột + nổ sao khi chạm/bấm (canvas, chỉ chạy khi có hạt)
export default function SparkleTrail() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = ref.current, ctx = c.getContext('2d')
    const colors = ['#ffffff', '#ffe9a8', '#9ec5ff', '#ffc94d']
    let dpr = 1, ps = [], raf = 0, lx = -999, ly = -999
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = innerWidth * dpr; c.height = innerHeight * dpr
      c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const add = (x, y, n, boost = 1) => {
      for (let i = 0; i < n; i++) ps.push({ x, y, vx: (Math.random() - 0.5) * 1.6 * boost, vy: (Math.random() - 0.6) * 1.6 * boost + 0.25, life: 1, decay: 0.014 + Math.random() * 0.016, s: 4 + Math.random() * 7, rot: Math.random() * Math.PI, c: colors[(Math.random() * colors.length) | 0] })
    }
    const star = (x, y, r, rot) => {
      ctx.beginPath()
      for (let i = 0; i < 8; i++) { const a = rot + (i * Math.PI) / 4, rr = i % 2 ? r * 0.32 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) }
      ctx.closePath(); ctx.fill()
    }
    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ps = ps.filter((p) => p.life > 0)
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life -= p.decay; p.rot += 0.04
        ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.c; ctx.shadowColor = p.c; ctx.shadowBlur = 10
        star(p.x, p.y, p.s * (0.5 + p.life * 0.5), p.rot)
      }
      raf = ps.length ? requestAnimationFrame(tick) : 0
      if (!raf) { ctx.clearRect(0, 0, innerWidth, innerHeight); c.style.display = 'none' }
    }
    const kick = () => { c.style.display = 'block'; if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return
      lx = e.clientX; ly = e.clientY; add(lx, ly, 2); kick()
    }
    const down = (e) => { add(e.clientX, e.clientY, 12, 3); kick() }
    resize()
    addEventListener('resize', resize); addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', down, { passive: true })
    return () => { removeEventListener('resize', resize); removeEventListener('pointermove', move); removeEventListener('pointerdown', down); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ display: 'none' }} />
}
