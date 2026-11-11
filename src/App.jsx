import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import Glitter from './components/Glitter'
import SparkleTrail from './components/SparkleTrail'
import Envelope from './components/Envelope'
import Invitation from './components/Invitation'
import SashImage, { bigSash } from './components/Sash'
import { CONFIG } from './config'

const GOLD = ['#ffc94d', '#ffffff', '#9ec5ff', '#2b5cff']
const capShape = () => (confetti.shapeFromText ? confetti.shapeFromText({ text: '🎓', scalar: 3 }) : 'circle')
// Pháo sao nhỏ khi mở nắp hộp
const puff = () => confetti({ particleCount: 18, spread: 80, startVelocity: 30, gravity: 0.8, ticks: 130, scalar: 0.95, origin: { x: 0.5, y: 0.52 }, shapes: ['star'], colors: GOLD, disableForReducedMotion: true })
// Pháo hoa mũ cử nhân + sao khi lá thư mở ra trang chính
const celebrate = () => {
  const base = { colors: GOLD, shapes: ['star', 'circle', capShape()], scalar: 2, gravity: 0.8, ticks: 200, disableForReducedMotion: true }
  confetti({ ...base, particleCount: 30, spread: 110, startVelocity: 50, origin: { x: 0.5, y: 0.6 } })
  setTimeout(() => confetti({ ...base, particleCount: 14, angle: 60, spread: 60, startVelocity: 55, origin: { x: 0, y: 0.85 } }), 180)
  setTimeout(() => confetti({ ...base, particleCount: 14, angle: 120, spread: 60, startVelocity: 55, origin: { x: 1, y: 0.85 } }), 180)
}

export default function App() {
  // closed | opened | pulling | expanding | revealing | page
  const [phase, setPhase] = useState('closed')
  const [geo, setGeo] = useState(null)
  const letterRef = useRef(null)
  const sashRef = useRef(null)

  // Tải trước ảnh để lúc chuyển cảnh không bị khựng / nháy
  useEffect(() => {
    [CONFIG.heroImage, CONFIG.letterImage, '/images/sash.webp'].filter(Boolean).forEach((src) => { const i = new Image(); i.src = src })
  }, [])
  // Khoá cuộn khi còn đang ở màn hình phong bì
  useEffect(() => {
    document.documentElement.style.overflow = phase === 'page' ? '' : 'hidden'
    if (phase === 'expanding') window.scrollTo(0, 0)
  }, [phase])

  useEffect(() => {
    if (phase === 'opened') puff()
    if (phase === 'revealing') celebrate()
  }, [phase])

  const onSeal = () => {
    if (phase === 'closed') setPhase('opened')
    else if (phase === 'opened') {
      setPhase('pulling') // lá thư trượt hẳn ra khỏi hộp, rồi mới phóng to
      setTimeout(expand, 800)
    }
  }
  const expand = () => {
    const vw = document.documentElement.clientWidth
    const big = bigSash(vw)
    setGeo({
      letter: letterRef.current.getBoundingClientRect(),
      sash: sashRef.current.getBoundingClientRect(),
      vw, vh: window.innerHeight,
      big: { left: vw - big.right - big.width, top: 0, width: big.width, height: big.height },
    })
    setPhase('expanding')
  }

  const hide = phase === 'expanding' || phase === 'revealing'
  const dim = phase === 'pulling' || hide
  const reveal = phase === 'revealing' || phase === 'page'
  const ease = [0.65, 0, 0.35, 1]

  return (
    <>
      <SparkleTrail />
      {/* Chớp sáng: lá thư phóng to xong → ánh sáng bùng lên và tan đi, trang chính hiện ra qua đó */}
      {(phase === 'expanding' || phase === 'revealing') && (
        <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[65]"
          style={{ background: 'radial-gradient(circle at 50% 46%, #fff 0%, rgba(214,230,255,.85) 32%, rgba(158,197,255,.35) 58%, transparent 78%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'revealing' ? [0, 1, 0] : 0 }}
          transition={{ duration: 1.1, ease: 'easeOut', times: [0, 0.3, 1] }} />
      )}
      {/* Trang thư được dựng sẵn bên dưới, mờ dần hiện ra khi lớp phủ tan đi → không bị "nhảy" cảnh */}
      {(dim || phase === 'page') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: reveal ? 1 : 0 }} transition={{ duration: 1, ease: 'easeInOut' }}>
          <Invitation ready={reveal} />
        </motion.div>
      )}

      {phase !== 'page' && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 py-8"
          style={{ pointerEvents: reveal ? 'none' : 'auto' }}
          animate={{ opacity: phase === 'revealing' ? 0 : 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          onAnimationComplete={() => setPhase((p) => (p === 'revealing' ? 'page' : p))}
        >
          <motion.div className="pointer-events-none absolute inset-0" animate={{ opacity: dim ? 0 : 1 }} transition={{ duration: 0.5 }}>
            <Glitter count={22} caps={3} seed={11} tone="dark" paused={dim} className="absolute inset-0" />
          </motion.div>
          <motion.div className="relative z-10 mb-8 text-center sm:mb-10 ls:mb-5" animate={{ opacity: dim ? 0 : 1, y: 0 }} initial={{ y: -40, opacity: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-script text-[clamp(3rem,min(16vw,11svh),6.5rem)] leading-tight text-brand drop-shadow-[3px_3px_0_#9ec5ff]">Graduation</h1>
            <motion.p className="font-display text-lg font-extrabold text-brand sm:text-2xl"
              initial={{ opacity: 0, letterSpacing: '1.2em' }} animate={{ opacity: 1, letterSpacing: '.55em' }} transition={{ delay: 0.3, duration: 1 }}>
              INVITATION
            </motion.p>
          </motion.div>

          <motion.div className="relative z-10" animate={{ opacity: hide ? 0 : 1 }} transition={{ duration: 0.5, delay: hide ? 0.25 : 0 }}>
            <Envelope opened={phase !== 'closed'} pulled={dim} onSeal={onSeal} letterRef={letterRef} sashRef={sashRef} />
          </motion.div>

          <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: dim ? 0 : 1 }}
            className="relative z-10 mt-12 ls:mt-6 rounded-full bg-white/80 px-5 py-2 text-center text-sm font-semibold text-brand shadow backdrop-blur">
            {phase === 'closed' ? '✨ Chạm vào nút giữa để mở hộp thư' : '💌 Chạm lần nữa để rút lá thư ra'}
          </motion.p>

          <AnimatePresence>
            {hide && geo && (
              <>
                {/* Phóng to bằng transform (chạy trên GPU, không bắt trình duyệt tính lại bố cục mỗi khung hình) */}
                <motion.div
                  className="linen fixed left-0 top-0 z-50 overflow-hidden"
                  style={{ width: geo.vw, height: geo.vh, transformOrigin: '0 0' }}
                  initial={{ x: geo.letter.left, y: geo.letter.top, scaleX: geo.letter.width / geo.vw, scaleY: geo.letter.height / geo.vh }}
                  animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1 }}
                  transition={{ duration: 1.2, ease }}
                  onAnimationComplete={() => setPhase((p) => (p === 'expanding' ? 'revealing' : p))}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-brand via-[#0a2a8a] to-deep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: 'easeInOut' }} />
                </motion.div>
                {/* chữ trên lá thư đứng yên tại chỗ rồi mờ dần (không bị méo theo lúc phóng to) */}
                <motion.div className="pointer-events-none fixed z-[51]" style={{ left: geo.letter.left, top: geo.letter.top, width: geo.letter.width, padding: geo.letter.width / 90 * 4.4 }}
                  initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                  <div className="text-center" style={{ paddingRight: geo.letter.width / 90 * 10 }}>
                    <p className="font-script leading-none text-brand" style={{ fontSize: geo.letter.width / 90 * 7.8 }}>Graduation</p>
                    <p className="font-display font-bold tracking-[.45em] text-brand" style={{ fontSize: geo.letter.width / 90 * 2.8 }}>INVITATION</p>
                    <p className="font-display font-extrabold text-brand" style={{ fontSize: geo.letter.width / 90 * 5, marginTop: geo.letter.width / 90 * 3.3 }}>{CONFIG.name}</p>
                    <p className="tracking-widest text-azure" style={{ fontSize: geo.letter.width / 90 * 3.3 }}>{CONFIG.dateText}</p>
                  </div>
                </motion.div>
                {/* Sash nhỏ phóng to và bay lên đầu trang */}
                <motion.div className="fixed z-[60]"
                  style={{ left: geo.big.left, top: geo.big.top, width: geo.big.width, height: geo.big.height, transformOrigin: '0 0' }}
                  initial={{ x: geo.sash.left - geo.big.left, y: geo.sash.top - geo.big.top, scale: geo.sash.width / geo.big.width }}
                  animate={{ x: 0, y: 0, scale: 1 }} transition={{ duration: 1.2, ease }}>
                  <SashImage sparks={false} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}
