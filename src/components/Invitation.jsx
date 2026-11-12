import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CONFIG } from '../config'
import { HangingSash } from './Sash'
import Glitter from './Glitter'

const NARROW = 'mx-auto w-full max-w-3xl'
const up = { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } }
const Reveal = ({ children, delay = 0, className = '' }) => (
  <motion.div className={className} variants={up} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}>{children}</motion.div>
)
const Title = ({ tag, children }) => (
  <Reveal className="mb-8 text-center">
    <span className="inline-block -rotate-3 rounded-full bg-sun px-4 py-1 font-display text-xs font-extrabold tracking-widest text-deep shadow-[2px_2px_0_#000d3d]">{tag}</span>
    <h2 className="mt-3 font-display text-4xl font-extrabold text-brand sm:text-5xl">{children}</h2>
  </Reveal>
)
const Photo = ({ src, i }) => src
  ? <img src={src} alt="" className="h-full w-full object-cover" />
  : <div className="flex h-full w-full items-center justify-center text-5xl"
      style={{ background: `linear-gradient(${120 + i * 40}deg,#1d3fc4,#4f8bff 60%,#9fd8ff)` }}>{['🎓', '📸', '💙', '✨', '🥳', '🌟'][i % 6]}</div>

// Bố cục polaroid: ảnh lớn xen ảnh nhỏ (mobile 2 cột, desktop 6 cột)
const LAYOUT = [
  { span: 'col-span-2 sm:col-span-4', self: '', aspect: 'aspect-[4/3]', rot: -2.5, cap: 'Ngày đẹp nhất sinh viên 🎓' },
  { span: 'sm:col-span-2', self: 'self-end', aspect: 'aspect-[3/4]', rot: 4, cap: 'Cười thật tươi' },
  { span: 'sm:col-span-2', self: 'self-start mt-4', aspect: 'aspect-square', rot: -4, cap: '`~~' },
  { span: 'col-span-2 sm:col-span-4', self: '', aspect: 'aspect-[5/4]', rot: 2.5, cap: '❤️' },
  { span: 'sm:col-span-3', self: 'self-start', aspect: 'aspect-[3/4]', rot: -3, cap: 'Thanh xuân' },
  { span: 'sm:col-span-3', self: 'self-end mt-6', aspect: 'aspect-square', rot: 3, cap: 'Tốt nghiệp thôi!' },
]

// Trùng với breakpoint `ls` trong tailwind.config.js (màn hình ngang: tablet / laptop / điện thoại xoay ngang)
const WIDE_Q = '(orientation: landscape) and (min-width: 560px)'
function useWide() {
  const [w, setW] = useState(() => window.matchMedia(WIDE_Q).matches)
  useEffect(() => {
    const m = window.matchMedia(WIDE_Q)
    const f = () => setW(m.matches)
    f(); m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return w
}
const EASE = [0.2, 0.8, 0.2, 1]

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const d = Math.max(0, new Date(CONFIG.dateISO) - now)
  return [['Ngày', Math.floor(d / 864e5)], ['Giờ', Math.floor(d / 36e5) % 24], ['Phút', Math.floor(d / 6e4) % 60], ['Giây', Math.floor(d / 1e3) % 60]]
}

const norm = (x) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim()
// Khớp đúng toàn bộ tên (không phân biệt hoa/thường, có hay không dấu)
function findSeat(q) {
  const n = norm(q)
  if (!n) return null
  for (let ti = 0; ti < CONFIG.tables.length; ti++) {
    const seat = CONFIG.tables[ti].guests.findIndex((g) => g && norm(g) === n)
    if (seat >= 0 && seat < 16) return { ti, seat, table: CONFIG.tables[ti] }
  }
  return null
}

const Seat = ({ n, on, dim }) => (
  <motion.div
    className={`relative flex aspect-square w-full items-center justify-center rounded-full border-2 font-display text-[10px] font-bold sm:text-sm ${on ? 'z-10 border-deep bg-brand text-white' : 'border-sky bg-white text-brand/50'}`}
    animate={on
      ? { scale: 1.35, opacity: 1, boxShadow: ['0 0 0 0 rgba(43,92,255,.7)', '0 0 0 12px rgba(43,92,255,0)'] }
      : { scale: 1, opacity: dim ? 0.45 : 1, boxShadow: '0 0 0 0 rgba(43,92,255,0)' }}
    transition={on ? { scale: { type: 'spring', stiffness: 300, damping: 14 }, boxShadow: { duration: 1.3, repeat: Infinity } } : { duration: 0.3 }}>
    {n}
  </motion.div>
)

// Bàn dài: 8 ghế hàng trên (1–8), 8 ghế hàng dưới (9–16)
const LongTable = ({ table, hitSeat, dim }) => {
  const row = (from) => (
    <div className="grid grid-cols-8 gap-1.5 sm:gap-3">
      {Array.from({ length: 8 }, (_, k) => <Seat key={from + k} n={from + k + 1} on={hitSeat === from + k} dim={dim} />)}
    </div>
  )
  return (
    <div>
      {row(0)}
      <div className="my-2.5 rounded-2xl border-2 border-sky bg-gradient-to-b from-ice to-white py-3 text-center shadow-inner">
        <p className="font-display text-lg font-extrabold tracking-widest text-brand">{table.name.toUpperCase()}</p>
        {table.note && <p className="text-xs text-deep/60">{table.note}</p>}
      </div>
      {row(8)}
    </div>
  )
}

const Map = ({ q, embed, url }) => (
  <>
    <iframe title="map" loading="lazy" className="h-64 w-full rounded-2xl border-0 sm:h-80"
      src={embed || `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`} />
    <a className="btn glint !px-6 !py-2 text-sm" target="_blank" rel="noreferrer"
      href={url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}>📍 Mở Google Maps</a>
  </>
)

// Lịch tháng tự dựng từ CONFIG.dateISO, ngày diễn ra được khoanh tròn bằng nét vẽ tay
function Calendar() {
  const [Y, M, D] = CONFIG.dateISO.slice(0, 10).split('-').map(Number)
  const first = (new Date(Y, M - 1, 1).getDay() + 6) % 7 // thứ 2 = cột đầu
  const total = new Date(Y, M, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]
  return (
    <motion.div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_30px_-12px_rgba(0,26,103,.55)]"
      initial={{ rotate: -6, opacity: 0, y: 40 }} whileInView={{ rotate: -2, opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} transition={{ type: 'spring', stiffness: 60, damping: 13 }}>
      <div className="bg-brand py-1.5 text-center text-white">
        <p className="font-display text-[10px] font-bold tracking-[.3em] sm:text-xs">{Y}</p>
        <p className="font-display text-lg font-extrabold leading-none sm:text-2xl">THÁNG {M}</p>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 p-2 text-center sm:p-3">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
          <span key={d} className={`text-[9px] font-bold sm:text-xs ${d === 'CN' ? 'text-[#ff4d6d]' : 'text-brand/50'}`}>{d}</span>
        ))}
        {cells.map((c, i) => (
          <span key={i} className={`relative flex aspect-square items-center justify-center text-[11px] sm:text-base ${c === D ? 'z-10 font-extrabold text-brand' : i % 7 === 6 ? 'text-[#ff4d6d]/80' : 'text-deep/70'}`}>
            {c}
            {c === D && (
              <svg viewBox="0 0 100 100" className="pointer-events-none absolute -inset-[45%] h-[190%] w-[190%] overflow-visible">
                <motion.path d="M52 6 C80 4 98 28 93 54 C88 80 60 96 34 90 C10 84 2 58 10 34 C18 12 46 2 72 10"
                  fill="none" stroke="#ff4d6d" strokeWidth="5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut' }} />
              </svg>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// Ảnh cuối trang: "cánh cổng" mở dần theo lúc cuộn (vùng tròn nở ra, ảnh từ mờ → nét, zoom lùi) rồi tung mũ tốt nghiệp
function Finale() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const clip = useTransform(p, [0, 0.7], ['circle(7% at 50% 62%)', 'circle(78% at 50% 50%)'])
  const scale = useTransform(p, [0, 0.7], [1.4, 1])
  const blur = useTransform(p, [0, 0.6], ['blur(14px)', 'blur(0px)'])
  const seen = useInView(ref, { once: true, amount: 0.7 })
  useEffect(() => {
    if (!seen) return
    const cap = confetti.shapeFromText ? confetti.shapeFromText({ text: '🎓', scalar: 3 }) : 'circle'
    const base = { origin: { x: 0.5, y: 0.85 }, colors: ['#001a67', '#7dd3fc', '#ffe14d', '#ffffff'], shapes: [cap, 'circle'], scalar: 2.2, gravity: 0.7, ticks: 260 }
    confetti({ ...base, particleCount: 18, angle: 90, spread: 80, startVelocity: 55 })
    setTimeout(() => confetti({ ...base, particleCount: 14, angle: 90, spread: 120, startVelocity: 40 }), 450)
  }, [seen])
  return (
    <section ref={ref} className="relative ml-[calc(50%-50vw)] w-screen ls:ml-0 ls:w-full">
      <div className="relative h-[72svh] overflow-hidden ls:h-auto ls:aspect-[2049/1226] ls:rounded-[28px]">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.img src={CONFIG.finalImage} alt="Ảnh tốt nghiệp" loading="lazy" className="h-full w-full object-cover object-[50%_72%]" style={{ scale, filter: blur }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep/85 via-brand/35 to-transparent" />
        </motion.div>
        <Glitter count={14} seed={5} tone="light" className="absolute inset-0 z-[5]" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 text-center text-white">
          <motion.p initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xs tracking-[.3em] sm:text-sm">MỘT HÀNH TRÌNH KHÉP LẠI · MỘT CÁNH CỔNG MỞ RA</motion.p>
          <motion.p initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, type: 'spring' }}
            className="mt-1 font-script text-5xl drop-shadow-[2px_3px_0_rgba(0,13,61,.8)] sm:text-6xl">See you there! 🎓</motion.p>
        </div>
      </div>
    </section>
  )
}

export default function Invitation({ ready = true }) {
  const hero = useRef(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  // màn ngang: chữ trôi lên, ảnh trôi xuống nhẹ → hai cột lệch nhịp tạo chiều sâu
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '7%'])
  const wide = useWide()
  const time = useCountdown()
  const [q, setQ] = useState('')
  const [sent, setSent] = useState(false)
  const [zoom, setZoom] = useState(false)
  const hit = findSeat(q)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    const end = Date.now() + 1800
    ;(function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#001a67', '#7dd3fc', '#ffe14d', '#ff8fb8'] })
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#001a67', '#7dd3fc', '#ffe14d', '#ff8fb8'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }
  const marq = Array(8).fill('🎓 CONGRATS GRAD · 2026 · ').join('')

  return (
    <div className="relative overflow-x-hidden">
      <HangingSash />
      {/* HERO: dọc = ảnh phủ nền, chữ đè lên · ngang = chữ bên trái, ảnh bên phải */}
      <section ref={hero} className="relative min-h-svh overflow-hidden text-white">
        <img src={CONFIG.heroImage} alt="" aria-hidden className="absolute inset-0 hidden h-full w-full scale-110 object-cover blur-2xl ls:block" />
        <div className="absolute inset-0 hidden bg-deep/45 ls:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-l from-deep/70 via-deep/20 to-transparent ls:block" />
        {ready && <Glitter count={wide ? 22 : 14} caps={wide ? 4 : 2} seed={3} tone="light" className="absolute inset-0 z-[5]" />}
        <div className="pointer-events-none absolute -right-24 top-1/3 hidden h-96 w-96 rounded-full bg-azure/30 blur-3xl ls:block" />

        {/* mobile: 3 lớp con (ảnh · chữ) nằm thẳng trong section; ngang: gom thành lưới 2 cột */}
        <div className="contents ls:relative ls:z-10 ls:mx-auto ls:grid ls:min-h-svh ls:max-w-[1080px] ls:grid-cols-[.78fr_1fr] ls:items-center ls:gap-12 ls:pb-14 ls:pl-10 ls:pr-32 ls:pt-4">
          {/* ẢNH (cột phải khi ngang) */}
          <motion.div className="absolute inset-[-8%] ls:static ls:order-1 ls:flex ls:justify-center" style={{ y: wide ? imgY : bgY }}>
            <motion.div className="relative h-full w-full ls:h-[min(62svh,540px)] ls:w-auto ls:shrink-0 ls:aspect-[3/4]"
              initial={wide ? { opacity: 0, x: -90 } : false}
              animate={ready && wide ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 1, ease: EASE, delay: 0.25 }}>
              {/* tấm nền vàng nghiêng phía sau khung ảnh */}
              <motion.div className="absolute inset-0 hidden rounded-[30px] border-2 border-deep bg-sun shadow-[-4px_4px_0_#000d3d] ls:block"
                initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
                animate={ready ? { rotate: -5, x: -16, y: 10, opacity: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 70, damping: 12, delay: 1 }} />
              <div className="relative h-full w-full ls:overflow-hidden ls:rounded-[28px] ls:border-[6px] ls:border-white ls:shadow-[0_30px_60px_-20px_rgba(0,13,61,.8)]">
                {CONFIG.heroImage
                  ? <motion.img src={CONFIG.heroImage} alt={CONFIG.name} className="h-full w-full object-cover object-[50%_20%]"
                      initial={wide ? { scale: 1.25 } : false}
                      animate={ready && wide ? { scale: 1 } : undefined}
                      transition={{ duration: 1.8, ease: EASE, delay: 0.25 }} />
                  : <div className="h-full w-full bg-gradient-to-br from-brand via-[#0a2a8a] to-deep" />}
              </div>
              {/* sticker bắc cầu giữa hai cột */}
              <motion.span className="absolute -right-7 bottom-12 hidden rotate-6 rounded-full border-2 border-deep bg-white px-4 py-1.5 font-display text-xs font-extrabold tracking-widest text-brand shadow-[3px_3px_0_#000d3d] ls:block"
                initial={{ scale: 0, opacity: 0 }}
                animate={ready ? { scale: 1, opacity: 1, y: [0, -6, 0] } : undefined}
                transition={{ scale: { type: 'spring', delay: 1.5 }, opacity: { delay: 1.5 }, y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2.2 } }}>
                🎓 CLASS OF 2026
              </motion.span>
            </motion.div>
          </motion.div>

          {/* vùng chữ (mobile): làm ảnh mờ nhẹ + phủ xanh, phần giữa (khuôn mặt) giữ nét */}
          <div className="fade-mask-t2 absolute inset-x-0 top-0 h-[27%] bg-gradient-to-b from-deep/85 via-brand/40 to-transparent backdrop-blur-[3px] ls:hidden" />
          <div className="fade-mask-b absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-deep/90 via-brand/55 to-transparent backdrop-blur-[4px] ls:hidden" />

          {/* THÔNG TIN (cột trái khi ngang) */}
          <motion.div className="relative z-10 flex min-h-svh w-full flex-col items-center justify-between px-5 pb-14 pt-4 text-center ls:order-2 ls:min-h-0 ls:items-start ls:justify-center ls:gap-7 ls:p-0 ls:text-left"
            style={{ y: wide ? textY : 0 }}
            initial={wide ? { opacity: 0, x: 80 } : false}
            animate={ready && wide ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.15 }}>
            <div>
              <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 0.3 }} className="mb-1 text-[10px] tracking-[.4em] sm:text-xs ls:mb-2">TRÂN TRỌNG KÍNH MỜI</motion.p>
              <motion.h1 initial={{ scale: 0.6, opacity: 0 }} animate={ready ? { scale: 1, opacity: 1 } : undefined} transition={{ type: 'spring', delay: 0.4 }}
                style={{ transformOrigin: wide ? '0% 60%' : '50% 50%' }}
                className="font-script text-[clamp(2.8rem,14vw,5.5rem)] leading-tight drop-shadow-[2px_3px_0_rgba(0,13,61,.8)] ls:text-[clamp(2.6rem,5vw,4.8rem)]">Graduation</motion.h1>
              <p className="font-display text-sm font-bold tracking-[.5em] sm:text-lg">INVITATION</p>
              <motion.h2 initial={{ y: 30, opacity: 0 }} animate={ready ? { y: 0, opacity: 1 } : undefined} transition={{ delay: 0.7 }}
                className="mt-1 font-display text-[clamp(1.4rem,6.4vw,2.8rem)] font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,13,61,.7)] ls:mt-3 ls:text-[clamp(1.5rem,2.8vw,2.5rem)]">{CONFIG.name}</motion.h2>
            </div>
            {/* gạch vàng: cùng motif với phần lời ngỏ */}
            <motion.div className="hidden h-1 w-16 origin-left rounded-full bg-sun ls:block"
              initial={{ scaleX: 0 }} animate={ready ? { scaleX: 1 } : undefined} transition={{ delay: 0.9, duration: 0.7, ease: EASE }} />
            <div>
              <motion.div initial={{ rotate: -10, scale: 0 }} animate={ready ? { rotate: -4, scale: 1 } : undefined} transition={{ type: 'spring', delay: 1 }}
                className="glint mb-4 inline-block rounded-2xl bg-sun px-5 py-2 font-display text-lg font-extrabold tracking-widest text-deep shadow-[4px_4px_0_#000d3d] sm:text-xl">{CONFIG.dateText}</motion.div>
              <div className="flex justify-center gap-2 sm:gap-3 ls:justify-start">
                {time.map(([l, v], i) => (
                  <motion.div key={l} initial={wide ? { opacity: 0, y: 24 } : false} animate={ready && wide ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 1.15 + i * 0.1, duration: 0.6, ease: EASE }}
                    className="w-[17vw] max-w-16 rounded-2xl border border-white/40 bg-white/15 py-2.5 text-center backdrop-blur ls:w-[clamp(3.4rem,6vw,5rem)] ls:max-w-none">
                    <div className="font-display text-xl font-extrabold sm:text-2xl ls:text-[clamp(1.25rem,2.4vw,2rem)]">{String(v).padStart(2, '0')}</div>
                    <div className="text-[11px] opacity-80">{l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 z-10 w-full overflow-hidden bg-sun py-2 font-display text-sm font-extrabold text-deep">
          <div className="marquee whitespace-nowrap"><span>{marq}</span><span>{marq}</span></div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-3xl space-y-20 ls:max-w-5xl px-4 py-16 sm:space-y-24 sm:px-5">
        {/* Lời ngỏ: dọc = tờ giấy nằm lớp trên, che ~33% phía trên tấm hình full-width (đổi 0.33 trong index.css để chỉnh)
            ngang = ảnh bên trái, thư bên phải đè nhẹ lên mép ảnh */}
        <section className="letter-sec ml-[calc(50%-50vw)] w-screen ls:ml-0 ls:grid ls:w-full ls:grid-cols-[1.12fr_.88fr] ls:items-center ls:gap-0">
          <div className="letter-pull relative z-10 px-4 ls:order-1 ls:-mr-10 ls:flex ls:items-center ls:px-0">
            <motion.div
              className="paper relative mx-auto max-w-[640px] rounded-[6px] px-6 pb-9 pt-10 text-center sm:px-12 sm:pt-12"
              initial={wide ? { x: -110, y: 30, opacity: 0, rotate: -3 } : { y: 120, opacity: 0, rotate: 3 }}
              whileInView={{ x: 0, y: 0, opacity: 1, rotate: wide ? -0.9 : -0.8 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={wide ? { type: 'spring', stiffness: 55, damping: 15, delay: 0.2 } : { type: 'spring', stiffness: 60, damping: 14 }}>
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-sky/60 shadow-sm backdrop-blur-sm" />
              <span className="absolute -left-2 top-5 -rotate-6 rounded-full bg-sun px-3 py-1 font-display text-[10px] font-extrabold tracking-widest text-deep shadow-[2px_2px_0_#000d3d]">LỜI NGỎ</span>
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-brand/15 to-transparent" />
              <h2 className="text-balance font-display text-[26px] font-extrabold leading-tight text-brand sm:text-4xl">{CONFIG.letterTitle} 💌</h2>
              <div className="mx-auto my-4 h-1 w-14 rounded-full bg-sun" />
              {CONFIG.letter.map((p, i) => (
                <motion.p key={i} className="mb-3 text-[14.5px] leading-7 text-deep/85 sm:text-base sm:leading-8"
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.25 + i * 0.15 }}>{p}</motion.p>
              ))}
              <p className="mt-5 font-script text-4xl text-brand">{CONFIG.name}</p>
            </motion.div>
          </div>
          <motion.div className="letter-img relative w-full ls:order-2 ls:aspect-square ls:max-h-[420px] ls:self-center"
            initial={wide ? { x: 110, opacity: 0, rotate: 5 } : false}
            whileInView={wide ? { x: 0, opacity: 1, rotate: 1.6 } : undefined}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: 'spring', stiffness: 55, damping: 15 }}>
            <div className="h-full w-full ls:absolute ls:inset-0 ls:overflow-hidden ls:rounded-[6px] ls:border-[10px] ls:border-white ls:bg-white ls:shadow-[0_30px_60px_-25px_rgba(0,26,103,.6)]">
              <motion.img src={CONFIG.letterImage} alt={CONFIG.name} className="letter-fade h-full w-full object-cover object-[50%_35%]"
                initial={wide ? { scale: 1.2 } : false}
                whileInView={wide ? { scale: 1 } : undefined}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1.6, ease: EASE }} />
            </div>
            {/* băng keo dán ảnh: đối xứng với băng keo trên tờ thư */}
            <span className="absolute -top-3 left-1/2 hidden h-6 w-24 -translate-x-1/2 rotate-3 bg-sun/70 shadow-sm ls:block" />
          </motion.div>
        </section>

        {/* Ảnh */}
        <section>
          <Title tag="KHOẢNH KHẮC">Polaroid của Tiên 📸</Title>
          <div className="grid grid-cols-2 items-center gap-x-3 gap-y-6 sm:grid-cols-6 sm:gap-x-5 sm:gap-y-8">
            {CONFIG.photos.map((p, i) => {
              const L = LAYOUT[i % LAYOUT.length]
              return (
                <motion.div key={i} className={`${L.span} ${L.self}`}
                  initial={{ opacity: 0, y: 160, rotate: L.rot * 3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: L.rot }}
                  viewport={{ once: true, amount: 0.2, margin: '0px 0px -8% 0px' }}
                  transition={{ type: 'spring', stiffness: 55, damping: 13, delay: (i % 2) * 0.14 }}>
                  <motion.div whileHover={{ rotate: 0, scale: 1.05 }} whileTap={{ scale: 1.03 }}
                    className="rounded-[4px] bg-white p-2 pb-9 shadow-[0_18px_30px_-12px_rgba(0,26,103,.55)]">
                    <div className={`${L.aspect} overflow-hidden`}><Photo src={p?.src ?? p} i={i} /></div>
                    <p className="mt-2 text-center font-script text-sm text-brand/70">{p?.cap || L.cap}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* RSVP */}
        <section className={NARROW}>
          <Title tag="RSVP">Bạn có đến không? 🥳</Title>
          <Reveal className="card p-6 sm:p-8">
            {sent ? (
              <motion.p initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center font-display text-2xl font-bold text-brand">
                🎉 Cảm ơn bạn! Tiên rất mong gặp bạn ngày {CONFIG.dateText}.
              </motion.p>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <input required className="field" placeholder="Họ và tên của bạn" />
                <select className="field" defaultValue="yes"><option value="yes">Mình sẽ tham dự 🎓</option><option value="no">Rất tiếc, mình bận mất rồi 😢</option></select>
                <input type="number" min="0" max="5" className="field" placeholder="Số người đi cùng" />
                <textarea rows="3" className="field" placeholder="Lời chúc gửi đến Tiên…" />
                <button className="btn glint w-full" type="submit">Gửi xác nhận 🚀</button>
              </form>
            )}
          </Reveal>
        </section>

        {/* Lễ tốt nghiệp: lịch (trái) + 2 ảnh (phải) → thông tin trường → sơ đồ khu vực → Google Maps của trường */}
        <section className="mx-auto w-full max-w-3xl ls:max-w-4xl">
          <Title tag="ĐỊA ĐIỂM">Lễ tốt nghiệp 🏫</Title>
          <Reveal className="mb-6 grid grid-cols-[1.15fr_1fr] items-center gap-4 sm:gap-8">
            <Calendar />
            <div className="flex flex-col gap-4 sm:gap-5">
              {CONFIG.school.photos.slice(0, 2).map((src, i) => (
                <motion.div key={i} whileHover={{ rotate: 0, scale: 1.04 }}
                  className="rounded-[4px] bg-white p-1.5 pb-5 shadow-[0_18px_30px_-12px_rgba(0,26,103,.55)] sm:p-2 sm:pb-7"
                  style={{ rotate: i ? 3 : -3 }}>
                  <div className="aspect-[4/3] overflow-hidden"><Photo src={src} i={i} /></div>
                </motion.div>
              ))}
            </div>
          </Reveal>
          <Reveal className="card flex flex-col items-center space-y-4 p-6 text-center">
            <p className="font-display text-xl font-bold">{CONFIG.school.name}</p>
            <p className="text-deep/70">{CONFIG.school.address}</p>
            <p className="inline-block rounded-full bg-ice px-4 py-1 text-sm font-semibold text-brand">⏰ {CONFIG.school.time}</p>

            {/* Sơ đồ khu vực: nằm ngay trước bản đồ */}
            <div className="w-full pt-2">
              <p className="mb-3 font-display text-sm font-extrabold tracking-widest text-brand">📍 SƠ ĐỒ KHU VỰC</p>
              <button type="button" onClick={() => setZoom(true)} className="group relative block w-full overflow-hidden rounded-2xl border-2 border-ice">
                <img src={CONFIG.location.image} alt="Sơ đồ khu vực" loading="lazy" className="w-full transition duration-500 group-hover:scale-[1.03]" />
                <span className="absolute bottom-2 right-2 rounded-full bg-deep/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">🔍 Phóng to</span>
              </button>
              {CONFIG.location.note && <p className="mt-3 text-sm text-deep/60">{CONFIG.location.note}</p>}
            </div>

            <p className="w-full pt-2 font-display text-sm font-extrabold tracking-widest text-brand">🗺️ BẢN ĐỒ ĐƯỜNG ĐI</p>
            <Map q={CONFIG.school.mapQuery} />
          </Reveal>
        </section>

        {/* Tiệc */}
        <section className={NARROW}>
          <Title tag="PARTY">Tiệc mừng tốt nghiệp 🥂</Title>
          <Reveal className="card flex flex-col items-center space-y-4 p-6 text-center">
            <p className="font-display text-xl font-bold">{CONFIG.restaurant.name}</p>
            {CONFIG.restaurant.address && <p className="text-deep/70">{CONFIG.restaurant.address}</p>}
            <p className="inline-block rounded-full bg-ice px-4 py-1 text-sm font-semibold text-brand">🕕 {CONFIG.restaurant.time}</p>
            <Map q={CONFIG.restaurant.mapQuery} embed={CONFIG.restaurant.embedUrl} url={CONFIG.restaurant.mapUrl} />
          </Reveal>
        </section>

        {/* Chỗ ngồi (sau bản đồ nhà hàng): 2 bàn dài × 16 ghế, nhập đúng tên thì ghế đó được tô đậm */}
        <section className={NARROW}>
          <Title tag="SEATING">Tìm chỗ ngồi của bạn 🪑</Title>
          <Reveal>
            <input className="field mb-4" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập đúng tên của bạn…" />
            {q.trim() && (
              <motion.p key={hit ? 'y' : 'n'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-center font-bold text-brand">
                {hit ? `✨ Bạn ngồi ở ${hit.table.name} · Ghế số ${hit.seat + 1}` : 'Chưa thấy tên bạn, hãy nhập đúng họ tên hoặc nhắn Tiên nhé!'}
              </motion.p>
            )}
            <div className="card space-y-6 p-3 sm:p-6">
              {CONFIG.tables.slice(0, 2).map((t, ti) => (
                <LongTable key={t.name} table={t} hitSeat={hit?.ti === ti ? hit.seat : -1} dim={!!hit} />
              ))}
            </div>
          </Reveal>
        </section>

        <Finale />
      </main>
      {zoom && (
        <div className="fixed inset-0 z-[80] overflow-auto bg-deep/90 p-3" onClick={() => setZoom(false)}>
          <button className="fixed right-4 top-4 z-10 h-10 w-10 rounded-full bg-white text-xl text-brand shadow" aria-label="Đóng">✕</button>
          <img src={CONFIG.location.image} alt="Sơ đồ khu vực" className="mx-auto mt-12 w-[220vw] max-w-none rounded-xl sm:w-full sm:max-w-5xl" />
        </div>
      )}
    </div>
  )
}
