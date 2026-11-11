import { motion } from 'framer-motion'
import SashImage from './Sash'
import { CONFIG } from '../config'

const sparks = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return { x: Math.cos(a) * (70 + (i % 3) * 25), y: Math.sin(a) * (50 + (i % 3) * 20) - 60, s: 0.7 + (i % 4) * 0.3 }
})

export default function Envelope({ opened, pulled, onSeal, letterRef, sashRef }) {
  const pos = pulled
    ? { y: '-124%', rotate: 0, scale: 1.1 }
    : opened ? { y: '-58%', rotate: -1.4, scale: 1 } : { y: '0%', rotate: 0, scale: 1 }
  const posT = pulled
    ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
    : opened ? { type: 'spring', stiffness: 48, damping: 12, mass: 1.1, delay: 0.5 } : { duration: 0.5 }

  return (
    <motion.div
      className="relative aspect-[3/2] w-[min(86vw,360px)]"
      style={{ perspective: 1000 }}
      animate={{ marginTop: opened ? 'clamp(90px,16svh,130px)' : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 16 }}
    >
      {/* ánh sáng dịu phía sau khi mở */}
      <motion.div className="pointer-events-none absolute -inset-16 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(158,197,255,.8), transparent 65%)' }}
        animate={{ opacity: opened ? [0, 1, 0.65] : 0, scale: opened ? [0.6, 1.2, 1] : 0.6 }} transition={{ duration: 1.4, delay: 0.3 }} />

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-azure to-brand shadow-[0_30px_50px_-15px_rgba(0,26,103,.65)]" />

      {/* Lá thư: vị trí (trượt ra) + phần giấy (nhấp nhô nhẹ) */}
      <motion.div className="absolute left-[5%] right-[5%] top-[5%] z-[2] h-[90%]" animate={pos} transition={posT}>
        <motion.div ref={letterRef} className="linen relative h-full w-full rounded-lg p-4 shadow-[0_-6px_24px_rgba(0,26,103,.22)]"
          animate={opened && !pulled ? { y: [0, -5, 0] } : { y: 0 }}
          transition={opened && !pulled ? { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } : { duration: 0.3 }}>
          <div ref={sashRef} className="absolute right-3 top-0 w-[26px]" style={{ height: 26 * 5.154 }}>
            <SashImage sparks={false} soft={0.35} />
          </div>
          <div className="pr-9 text-center">
            <p className="font-script text-[28px] leading-none text-brand">Graduation</p>
            <p className="font-display text-[10px] font-bold tracking-[.45em] text-brand">INVITATION</p>
            <p className="mt-3 font-display text-lg font-extrabold text-brand">{CONFIG.name}</p>
            <p className="text-xs tracking-widest text-azure">{CONFIG.dateText}</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-[3] rounded-2xl bg-gradient-to-tr from-[#00143f] to-[#1a3fa8]"
        style={{ clipPath: 'polygon(0 0,50% 56%,100% 0,100% 100%,0 100%)' }} />

      <motion.div
        className="absolute left-0 top-0 h-[56%] w-full origin-top rounded-t-2xl bg-gradient-to-b from-[#2b4fbf] to-brand"
        style={{ clipPath: 'polygon(0 0,100% 0,50% 100%)' }}
        animate={{ rotateX: opened ? 180 : 0, zIndex: opened ? 1 : 4 }}
        transition={{ rotateX: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }, zIndex: { delay: opened ? 0.35 : 0, duration: 0 } }}
      />

      {/* tia lấp lánh bung ra khi mở nắp */}
      {opened && sparks.map((p, i) => (
        <motion.span key={i} className="pointer-events-none absolute left-1/2 top-[30%] z-[7] text-sky drop-shadow"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: p.s, rotate: 180 }}
          transition={{ duration: 1.3, delay: 0.45 + i * 0.03, ease: 'easeOut' }}>✦</motion.span>
      ))}

      <motion.button
        aria-label={opened ? 'Rút lá thư ra' : 'Mở hộp thư'}
        onClick={onSeal}
        className="absolute left-1/2 top-1/2 z-[6] -ml-8 -mt-8 flex h-16 w-16 touch-manipulation items-center justify-center rounded-full border-4 border-white/80 bg-gradient-to-br from-sky to-azure text-2xl text-white shadow-xl"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(158,197,255,.9)', '0 0 0 22px rgba(158,197,255,0)'], opacity: pulled ? 0 : 1 }}
        transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
      >
        {opened ? '💌' : '🎓'}
      </motion.button>
    </motion.div>
  )
}
