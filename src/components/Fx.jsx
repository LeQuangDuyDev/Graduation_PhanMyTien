import { useEffect, useRef } from 'react'
import { registerFx } from '../fx'

// Pháo hoa + vệt sao chuột, vẽ bằng 1 canvas duy nhất.
// - Không dùng thư viện ngoài, không dùng emoji/OffscreenCanvas → chạy ổn trên iPhone/Safari cũ
// - Hạt được vẽ sẵn thành "sprite" nhỏ rồi drawImage (rẻ hơn nhiều so với vẽ path + shadowBlur mỗi hạt)
// - Canvas ẩn hẳn (display:none) khi không có hạt nào
const CONF = ['#ffc94d', '#ffffff', '#9ec5ff', '#2b5cff', '#6fa0ff']
const TRAIL = ['#ffffff', '#ffe9a8', '#9ec5ff', '#ffc94d']

const sprite = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); return c }
const starPath = (g, cx, cy, R, r) => {
  g.beginPath()
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 - Math.PI / 2, rr = i % 2 ? r : R; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) }
  g.closePath()
}
let S = null
const sprites = () => S || (S = {
  star: CONF.map((c) => sprite(48, 48, (g) => { g.shadowColor = c; g.shadowBlur = 7; g.fillStyle = c; starPath(g, 24, 24, 19, 6.5); g.fill() })),
  dot: CONF.map((c) => sprite(24, 24, (g) => { g.fillStyle = c; g.beginPath(); g.arc(12, 12, 8, 0, 7); g.fill() })),
  bit: CONF.map((c) => sprite(24, 14, (g, w, h) => { g.fillStyle = c; g.fillRect(2, 2, w - 4, h - 4) })),
  trail: TRAIL.map((c) => sprite(48, 48, (g) => { g.shadowColor = c; g.shadowBlur = 8; g.fillStyle = c; starPath(g, 24, 24, 19, 6) ; g.fill() })),
  cap: [sprite(64, 64, (g) => {
    g.fillStyle = '#001a67'; g.beginPath(); g.moveTo(17, 30); g.lineTo(17, 43); g.quadraticCurveTo(32, 53, 47, 43); g.lineTo(47, 30); g.closePath(); g.fill()
    g.fillStyle = '#0a2a8a'; g.strokeStyle = '#9ec5ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 8); g.lineTo(61, 22); g.lineTo(32, 36); g.lineTo(3, 22); g.closePath(); g.fill(); g.stroke()
    g.fillStyle = '#ffc94d'; g.beginPath(); g.arc(32, 22, 3, 0, 7); g.fill()
    g.strokeStyle = '#ffc94d'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(32, 22); g.lineTo(54, 26); g.lineTo(54, 45); g.stroke(); g.fillRect(51.5, 43, 5, 9)
  })],
})
const pick = (a) => a[(Math.random() * a.length) | 0]
const rnd = (a, b) => a + Math.random() * (b - a)

export default function Fx() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    let ps = [], raf = 0, last = 0, W = 0, H = 0, dpr = 1, lx = -999, ly = -999
    const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ensureSize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      if (W === innerWidth && H === innerHeight && d === dpr) return
      W = innerWidth; H = innerHeight; dpr = d
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr)
      c.style.width = W + 'px'; c.style.height = H + 'px'
    }
    const tick = (t) => {
      const dt = Math.min((t - last) / 16.667 || 1, 3); last = t
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height)
      let n = 0
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        p.life -= dt
        if (p.life <= 0) continue
        p.vx *= Math.pow(p.drag, dt); p.vy = p.vy * Math.pow(p.drag, dt) + p.g * dt
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; p.ph += 0.25 * dt
        const cos = Math.cos(p.rot), sin = Math.sin(p.rot), f = p.flutter ? Math.cos(p.ph) : 1
        const k = p.pulse ? Math.sin(Math.PI * (1 - p.life / p.max)) : 1
        const w = p.size * k, h = w * (p.img.height / p.img.width)
        ctx.globalAlpha = p.pulse ? 1 : Math.min(1, p.life / 24)
        ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin * f, dpr * cos * f, dpr * p.x, dpr * p.y)
        ctx.drawImage(p.img, -w / 2, -h / 2, w, h)
        ps[n++] = p
      }
      ps.length = n
      if (n) raf = requestAnimationFrame(tick)
      else { raf = 0; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); c.style.display = 'none' }
    }
    const kick = () => {
      ensureSize(); c.style.display = 'block'
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick) }
    }
    const add = (o) => ps.push({ vx: 0, vy: 0, vr: 0, rot: 0, ph: Math.random() * 6, g: 0, drag: 1, flutter: false, pulse: false, ...o, max: o.life })

    // kind: star | dot | bit | cap ; angle (độ, 0 = sang phải, -90 = lên)
    const shot = (x, y, n, { a0, a1, s0, s1, life, g = 0.2, drag = 0.985, kinds, size }) => {
      const sp = sprites()
      for (let i = 0; i < n; i++) {
        const kind = kinds[i % kinds.length], a = (rnd(a0, a1) * Math.PI) / 180, s = rnd(s0, s1)
        const img = kind === 'cap' ? sp.cap[0] : pick(sp[kind])
        const sz = kind === 'cap' ? rnd(26, 34) : kind === 'star' ? rnd(size[0], size[1]) : kind === 'bit' ? rnd(9, 14) : rnd(6, 9)
        add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(life[0], life[1]), g, drag, img, size: sz, rot: rnd(0, 6), vr: rnd(-0.18, 0.18), flutter: kind === 'bit' })
      }
    }
    // Chế độ "giảm chuyển động": sao chỉ sáng lên rồi tắt tại chỗ, không bay
    const gentle = (n) => {
      const sp = sprites()
      for (let i = 0; i < n; i++) add({ x: rnd(0.08, 0.92) * innerWidth, y: rnd(0.12, 0.85) * innerHeight, life: rnd(60, 100), img: pick(sp.star), size: rnd(14, 26), pulse: true })
    }
    const scale = () => Math.min(Math.max(innerHeight / 760, 0.75), 1.3)

    const api = {
      puff() {
        ensureSize()
        if (reduced()) gentle(8)
        else shot(innerWidth / 2, innerHeight * 0.52, 18, { a0: 0, a1: 360, s0: 2.5, s1: 6, life: [55, 90], g: 0.06, drag: 0.97, kinds: ['star'], size: [10, 18] })
        kick()
      },
      celebrate() {
        ensureSize()
        if (reduced()) { gentle(18); kick(); return }
        const sc = scale(), kinds = ['star', 'dot', 'bit', 'star', 'cap', 'bit', 'dot']
        const opt = { life: [120, 170], kinds, size: [12, 22] }
        shot(innerWidth / 2, innerHeight * 0.62, 34, { ...opt, a0: -145, a1: -35, s0: 8 * sc, s1: 15 * sc })
        kick()
        setTimeout(() => {
          shot(0, innerHeight * 0.88, 14, { ...opt, a0: -85, a1: -35, s0: 10 * sc, s1: 17 * sc })
          shot(innerWidth, innerHeight * 0.88, 14, { ...opt, a0: -145, a1: -95, s0: 10 * sc, s1: 17 * sc })
          kick()
        }, 180)
      },
      toss() {
        ensureSize()
        if (reduced()) return
        const sc = scale()
        shot(innerWidth / 2, innerHeight * 0.95, 16, { a0: -115, a1: -65, s0: 11 * sc, s1: 18 * sc, life: [110, 150], kinds: ['cap', 'star', 'bit', 'star'], size: [12, 20] })
        kick()
      },
    }

    const move = (e) => {
      if (e.pointerType !== 'mouse' || reduced()) return
      if (Math.hypot(e.clientX - lx, e.clientY - ly) < 24) return
      lx = e.clientX; ly = e.clientY
      const sp = sprites()
      for (let i = 0; i < 2; i++) add({ x: lx, y: ly, vx: rnd(-0.8, 0.8), vy: rnd(-0.3, 0.9), g: 0.03, life: rnd(28, 45), img: pick(sp.trail), size: rnd(8, 14), rot: rnd(0, 6), vr: 0.04 })
      kick()
    }
    const down = (e) => {
      if (reduced()) return
      shot(e.clientX, e.clientY, 8, { a0: 0, a1: 360, s0: 1.5, s1: 4, life: [30, 50], g: 0.05, drag: 0.96, kinds: ['star'], size: [8, 14] })
      kick()
    }
    addEventListener('pointermove', move, { passive: true }); addEventListener('pointerdown', down, { passive: true })
    const off = registerFx(api)
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', down); off(); cancelAnimationFrame(raf) }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90]" style={{ display: 'none' }} />
}
