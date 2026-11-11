import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from './components/Envelope'
import Invitation from './components/Invitation'
import SashImage, { bigSash } from './components/Sash'

export default function App() {
  const [phase, setPhase] = useState('closed') // closed | opened | expanding | page
  const [geo, setGeo] = useState(null)
  const letterRef = useRef(null)
  const sashRef = useRef(null)

  const onSeal = () => {
    if (phase === 'closed') setPhase('opened')
    else if (phase === 'opened') {
      setPhase('pulling') // lá thư trượt hẳn ra khỏi hộp, rồi mới phóng to
      setTimeout(expand, 800)
    }
  }
  const expand = () => {
    {
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
  }

  if (phase === 'page') return <Invitation />
  const hide = phase === 'expanding'
  const dim = phase === 'pulling' || hide
  const ease = [0.76, 0, 0.24, 1]

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-8">
      <motion.div className="relative z-10 mb-8 text-center sm:mb-10" animate={{ opacity: dim ? 0 : 1, y: 0 }} initial={{ y: -40, opacity: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="font-script text-[clamp(3.2rem,16vw,6.5rem)] leading-tight text-brand drop-shadow-[3px_3px_0_#9ec5ff]">Graduation</h1>
        <motion.p className="font-display text-lg font-extrabold text-brand sm:text-2xl"
          initial={{ opacity: 0, letterSpacing: '1.2em' }} animate={{ opacity: 1, letterSpacing: '.55em' }} transition={{ delay: 0.3, duration: 1 }}>
          INVITATION
        </motion.p>
      </motion.div>

      <div className="relative z-10" style={{ opacity: hide ? 0 : 1 }}>
        <Envelope opened={phase !== 'closed'} pulled={dim} onSeal={onSeal} letterRef={letterRef} sashRef={sashRef} />
      </div>

      <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: dim ? 0 : 1 }}
        className="relative z-10 mt-12 rounded-full bg-white/80 px-5 py-2 text-center text-sm font-semibold text-brand shadow backdrop-blur">
        {phase === 'closed' ? '✨ Chạm vào nút giữa để mở hộp thư' : '💌 Chạm lần nữa để rút lá thư ra'}
      </motion.p>

      <AnimatePresence>
        {hide && geo && (
          <>
            <motion.div
              className="linen fixed z-50 overflow-hidden"
              initial={{ top: geo.letter.top, left: geo.letter.left, width: geo.letter.width, height: geo.letter.height, borderRadius: 10 }}
              animate={{ top: 0, left: 0, width: geo.vw, height: geo.vh, borderRadius: 0 }}
              transition={{ duration: 1.1, ease }}
              onAnimationComplete={() => setPhase('page')}
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-brand via-[#0a2a8a] to-deep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} />
            </motion.div>
            {/* Sash nhỏ phóng to và bay lên đầu trang */}
            <motion.div className="fixed z-[60]"
              initial={{ top: geo.sash.top, left: geo.sash.left, width: geo.sash.width, height: geo.sash.height }}
              animate={{ ...geo.big }} transition={{ duration: 1.1, ease }}>
              <SashImage sparks={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
