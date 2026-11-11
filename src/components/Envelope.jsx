import { motion } from 'framer-motion'
import SashImage from './Sash'
import { CONFIG } from '../config'

const GLYPH = ['✦', '✧', '✦', '✨']
const sparks = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2
  return { x: Math.cos(a) * (80 + (i % 4) * 28), y: Math.sin(a) * (56 + (i % 4) * 22) - 70, s: 0.7 + (i % 4) * 0.35, g: GLYPH[i % 4], c: i % 3 === 0 ? '#ffc94d' : i % 3 === 1 ? '#ffffff' : '#9ec5ff' }
})
// ánh sao li ti trên mặt lá thư (toạ độ %, cỡ chữ theo cqw)
const dust = [[12, 14, 3.2, 0], [78, 30, 2.6, 0.7], [22, 62, 2.4, 1.3], [64, 78, 3.4, 0.4], [40, 36, 2.2, 1.9], [88, 70, 2.6, 1.1]]

export default function Envelope({ opened, pulled, onSeal, letterRef, sashRef }) {
  const pos = pulled
    ? { y: '-124%', rotate: 0, scale: 1.1 }
    : opened ? { y: '-58%', rotate: -1.4, scale: 1 } : { y: '0%', rotate: 0, scale: 1 }
  const posT = pulled
    ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
    : opened ? { type: 'spring', stiffness: 48, damping: 12, mass: 1.1, delay: 0.5 } : { duration: 0.5 }

  return (
    <motion.div
      className={`relative aspect-[3/2] w-[var(--ew)] [--ew:min(86vw,360px)] [container-type:inline-size] ls:[--ew:min(80vw,520px,calc(36svh*1.5))] transition-[margin-top] duration-700 ease-out ${opened ? 'mt-[calc(var(--ew)*.36)]' : 'mt-0'}`}
      style={{ perspective: 1000 }}
      animate={opened ? { y: 0 } : { y: [0, -7, 0] }}
      transition={opened ? { duration: 0.5 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* ánh sáng dịu phía sau khi mở */}
      <motion.div className="pointer-events-none absolute -inset-16 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(158,197,255,.8), transparent 65%)' }}
        animate={pulled ? { opacity: 1, scale: 1.35 } : { opacity: opened ? [0, 1, 0.65] : 0, scale: opened ? [0.6, 1.2, 1] : 0.6 }}
        transition={pulled ? { duration: 0.8 } : { duration: 1.4, delay: 0.3 }} />

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-azure to-brand shadow-[0_30px_50px_-15px_rgba(0,26,103,.65)]" />

      {/* Lá thư: vị trí (trượt ra) + phần giấy (nhấp nhô nhẹ) */}
      <motion.div className="absolute left-[5%] right-[5%] top-[5%] z-[2] h-[90%]" animate={pos} transition={posT}>
        <motion.div ref={letterRef} style={{ padding: '4.4cqw' }} className="linen relative h-full w-full overflow-hidden rounded-lg shadow-[0_-6px_24px_rgba(0,26,103,.22)]"
          animate={opened && !pulled ? { y: [0, -5, 0] } : { y: 0 }}
          transition={opened && !pulled ? { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.4 } : { duration: 0.3 }}>
          {/* ánh sao li ti */}
          {dust.map(([x, y, fs, d], i) => (
            <span key={i} className="twinkle" style={{ left: `${x}%`, top: `${y}%`, fontSize: `${fs}cqw`, color: i % 2 ? '#ffc94d' : '#6fa0ff', animationDelay: `${d}s`, animationDuration: '2.6s' }}>✦</span>
          ))}
          {/* vệt sáng quét qua mặt thư: chạy nhẹ khi thư nhô lên, quét nhanh khi được rút ra */}
          <motion.div className="pointer-events-none absolute inset-0 z-[3]"
            style={{ background: 'linear-gradient(110deg, transparent 36%, rgba(255,255,255,.95) 50%, transparent 64%)' }}
            initial={{ x: '-130%' }}
            animate={pulled ? { x: '130%' } : opened ? { x: ['-130%', '130%'] } : { x: '-130%' }}
            transition={pulled ? { duration: 0.8, ease: 'easeInOut' } : { duration: 2.2, repeat: Infinity, repeatDelay: 1.8, delay: 1.2, ease: 'easeInOut' }} />
          <div ref={sashRef} className="absolute top-0" style={{ right: '3.3cqw', width: '7.2cqw', height: `${7.2 * 5.154}cqw` }}>
            <SashImage sparks={false} soft={0.35} />
          </div>
          <div className="text-center" style={{ paddingRight: '10cqw' }}>
            <p className="font-script leading-none text-brand" style={{ fontSize: '7.8cqw' }}>Graduation</p>
            <p className="font-display font-bold tracking-[.45em] text-brand" style={{ fontSize: '2.8cqw' }}>INVITATION</p>
            <p className="font-display font-extrabold text-brand" style={{ fontSize: '5cqw', marginTop: '3.3cqw' }}>{CONFIG.name}</p>
            <p className="tracking-widest text-azure" style={{ fontSize: '3.3cqw' }}>{CONFIG.dateText}</p>
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
        <motion.span key={i} className="pointer-events-none absolute left-1/2 top-[30%] z-[7] drop-shadow"
          style={{ color: p.c, textShadow: '0 0 10px currentColor' }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: p.s, rotate: 180 }}
          transition={{ duration: 1.5, delay: 0.4 + i * 0.025, ease: 'easeOut' }}>{p.g}</motion.span>
      ))}

      {/* vòng sao xoay quanh nút bấm: gợi ý "chạm vào đây" */}
      {!pulled && (
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[6] -ml-12 -mt-12 h-24 w-24 animate-[spin_7s_linear_infinite]">
          {[0, 120, 240].map((r) => (
            <span key={r} className="absolute left-1/2 top-0 -ml-2 text-sm text-white" style={{ transform: `rotate(${r}deg)`, transformOrigin: '50% 48px', textShadow: '0 0 8px #9ec5ff, 0 0 14px #9ec5ff' }}>✦</span>
          ))}
        </span>
      )}

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
