import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CONFIG } from '../config'
import { HangingSash } from './Sash'

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
  { span: 'col-span-2 sm:col-span-4', self: '', aspect: 'aspect-[4/3]', rot: -2.5, cap: 'Ngày đẹp nhất 🎓' },
  { span: 'sm:col-span-2', self: 'self-end', aspect: 'aspect-[3/4]', rot: 4, cap: 'Cười thật tươi' },
  { span: 'sm:col-span-2', self: 'self-start mt-4', aspect: 'aspect-square', rot: -4, cap: 'Cùng bạn bè' },
  { span: 'col-span-2 sm:col-span-4', self: '', aspect: 'aspect-[5/4]', rot: 2.5, cap: 'Gia đình ❤️' },
  { span: 'sm:col-span-3', self: 'self-start', aspect: 'aspect-[3/4]', rot: -3, cap: 'Thanh xuân' },
  { span: 'sm:col-span-3', self: 'self-end mt-6', aspect: 'aspect-square', rot: 3, cap: 'Tốt nghiệp thôi!' },
]

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const d = Math.max(0, new Date(CONFIG.dateISO) - now)
  return [['Ngày', Math.floor(d / 864e5)], ['Giờ', Math.floor(d / 36e5) % 24], ['Phút', Math.floor(d / 6e4) % 60], ['Giây', Math.floor(d / 1e3) % 60]]
}

const Map = ({ q }) => (
  <iframe title="map" loading="lazy" className="h-64 w-full rounded-2xl border-0"
    src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`} />
)

export default function Invitation() {
  const hero = useRef(null)
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const time = useCountdown()
  const [q, setQ] = useState('')
  const [sent, setSent] = useState(false)
  const found = q.trim() && CONFIG.tables.find((t) => t.guests.some((g) => g.toLowerCase().includes(q.trim().toLowerCase())))

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
      {/* HERO */}
      <section ref={hero} className="relative min-h-svh overflow-hidden text-white">
        <motion.div className="absolute inset-[-8%]" style={{ y: bgY }}>
          {CONFIG.heroImage
            ? <img src={CONFIG.heroImage} alt={CONFIG.name} className="h-full w-full object-cover object-[50%_20%]" />
            : <div className="h-full w-full bg-gradient-to-br from-brand via-[#0a2a8a] to-deep" />}
        </motion.div>
        {/* vùng chữ: làm ảnh mờ nhẹ + phủ xanh, phần giữa (khuôn mặt) giữ nét */}
        <div className="fade-mask-t2 absolute inset-x-0 top-0 h-[27%] bg-gradient-to-b from-deep/85 via-brand/40 to-transparent backdrop-blur-[3px]" />
        <div className="fade-mask-b absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-deep/90 via-brand/55 to-transparent backdrop-blur-[4px]" />

        <div className="relative z-10 flex min-h-svh flex-col items-center justify-between px-5 pb-14 pt-4 text-center">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-1 text-[10px] tracking-[.4em] sm:text-xs">TRÂN TRỌNG KÍNH MỜI</motion.p>
            <motion.h1 initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }}
              className="font-script text-[clamp(2.8rem,14vw,5.5rem)] leading-tight drop-shadow-[2px_3px_0_rgba(0,13,61,.8)]">Graduation</motion.h1>
            <p className="font-display text-sm font-bold tracking-[.5em] sm:text-lg">INVITATION</p>
            <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-1 font-display text-[clamp(1.4rem,6.4vw,2.8rem)] font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,13,61,.7)]">{CONFIG.name}</motion.h2>
          </div>
          <div>
            <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: -4, scale: 1 }} transition={{ type: 'spring', delay: 1 }}
              className="mb-4 inline-block rounded-2xl bg-sun px-5 py-2 font-display text-lg font-extrabold tracking-widest text-deep shadow-[4px_4px_0_#000d3d] sm:text-xl">{CONFIG.dateText}</motion.div>
            <div className="flex justify-center gap-2 sm:gap-3">
              {time.map(([l, v]) => (
                <div key={l} className="w-[17vw] max-w-16 rounded-2xl border border-white/40 bg-white/15 py-2.5 backdrop-blur">
                  <div className="font-display text-xl font-extrabold sm:text-2xl">{String(v).padStart(2, '0')}</div>
                  <div className="text-[11px] opacity-80">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 z-10 w-full overflow-hidden bg-sun py-2 font-display text-sm font-extrabold text-deep">
          <div className="marquee whitespace-nowrap"><span>{marq}</span><span>{marq}</span></div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-3xl space-y-20 px-4 py-16 sm:space-y-24 sm:px-5">
        {/* Lời ngỏ: tờ giấy nằm lớp trên, che ~40% phía trên tấm hình full-width */}
        <section className="ml-[calc(50%-50vw)] w-screen" style={{ '--h': 'min(100vw, 760px)' }}>
          <div className="relative z-10 px-4" style={{ marginBottom: 'calc(var(--h) * -0.4)' }}>
            <motion.div
              className="paper relative mx-auto max-w-[640px] rounded-[6px] px-6 pb-9 pt-10 text-center sm:px-12 sm:pt-12"
              initial={{ y: 120, opacity: 0, rotate: 3 }} whileInView={{ y: 0, opacity: 1, rotate: -0.8 }}
              viewport={{ once: true, amount: 0.15 }} transition={{ type: 'spring', stiffness: 60, damping: 14 }}>
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
          <div className="relative w-full" style={{ height: 'var(--h)' }}>
            <img src={CONFIG.letterImage} alt={CONFIG.name} className="h-full w-full object-cover object-[50%_35%]"
              style={{ WebkitMaskImage: 'linear-gradient(to bottom,#000 82%,transparent)', maskImage: 'linear-gradient(to bottom,#000 82%,transparent)' }} />
          </div>
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
                    <div className={`${L.aspect} overflow-hidden`}><Photo src={p} i={i} /></div>
                    <p className="mt-2 text-center font-script text-sm text-brand/70">{L.cap}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* RSVP */}
        <section>
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
                <button className="btn w-full" type="submit">Gửi xác nhận 🚀</button>
              </form>
            )}
          </Reveal>
        </section>

        {/* Địa điểm */}
        <section>
          <Title tag="ĐỊA ĐIỂM">Lễ tốt nghiệp 🏫</Title>
          <Reveal className="card space-y-4 p-6 text-center">
            <p className="font-display text-xl font-bold">{CONFIG.school.name}</p>
            <p className="text-deep/70">{CONFIG.school.address}</p>
            <p className="inline-block rounded-full bg-ice px-4 py-1 text-sm font-semibold text-brand">⏰ {CONFIG.school.time}</p>
            <Map q={CONFIG.school.mapQuery} />
          </Reveal>
        </section>

        {/* Chỗ ngồi */}
        <section>
          <Title tag="SEATING">Tìm chỗ ngồi của bạn 🪑</Title>
          <Reveal>
            <input className="field mb-4" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nhập tên của bạn…" />
            {q.trim() && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-center font-bold text-brand">{found ? `✨ Bạn ngồi ở ${found.name}` : 'Chưa thấy tên bạn, nhắn Tiên nhé!'}</motion.p>}
            <div className="grid grid-cols-2 gap-4">
              {CONFIG.tables.map((t) => (
                <motion.div key={t.name} animate={{ scale: found?.name === t.name ? 1.06 : 1 }}
                  className={`card p-4 text-center ${found?.name === t.name ? 'ring-4 ring-brand' : ''}`}>
                  <p className="font-display font-extrabold">{t.name}</p>
                  <p className="mt-1 text-sm text-deep/60">{t.guests.join(' · ')}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Tiệc */}
        <section>
          <Title tag="PARTY">Tiệc mừng tốt nghiệp 🥂</Title>
          <Reveal className="card space-y-4 p-6 text-center">
            <p className="font-display text-xl font-bold">{CONFIG.restaurant.name}</p>
            <p className="text-deep/70">{CONFIG.restaurant.address}</p>
            <p className="inline-block rounded-full bg-ice px-4 py-1 text-sm font-semibold text-brand">🕕 {CONFIG.restaurant.time}</p>
            <Map q={CONFIG.restaurant.mapQuery} />
          </Reveal>
        </section>

        <Reveal><p className="pb-8 text-center font-script text-4xl text-brand">See you there! 🎓</p></Reveal>
      </main>
    </div>
  )
}
