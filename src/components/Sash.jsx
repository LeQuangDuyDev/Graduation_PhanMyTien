import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export const SASH = { src: '/images/sash.webp', ratio: 1742 / 338 }
const N = 10 // số dải vải (ít dải hơn bản gốc = ít lớp đồ hoạ hơn, nhẹ máy)

// Kích thước sash treo đầu trang (nhỏ gọn, co theo màn hình)
export const bigSash = (vw) => {
  const width = Math.round(Math.min(Math.max(vw * 0.12, 42), 84))
  return { width, height: Math.round(width * SASH.ratio), right: vw < 640 ? 12 : 28 }
}

const Spark = ({ x, y, d }) => (
  <motion.span className="absolute text-[9px] text-white drop-shadow" style={{ left: x, top: y }}
    animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 0.4], rotate: [0, 90] }}
    transition={{ duration: 2.2, repeat: Infinity, delay: d }}>✦</motion.span>
)

// Sash vải mềm: sóng chạy dọc + nếp gấp bóng + vệt sáng satin + lấp lánh
export default function SashImage({ sparks = true, soft = 1, paused = false }) {
  const m = { '--m': `url(${SASH.src})` }
  return (
    <div className={`relative h-full w-full ${paused ? 'sash-paused' : ''}`}>
      {Array.from({ length: N }).map((_, i) => (
        <img key={i} src={SASH.src} alt={i ? '' : 'Sash tốt nghiệp'} draggable="false"
          className="sash-strip absolute inset-0 h-full w-full select-none object-fill"
          style={{
            '--a': `${((i * 0.16 * soft * 14) / N).toFixed(2)}px`, animationDelay: `${(-i * 0.24 * 14 / N).toFixed(2)}s`,
            clipPath: `inset(${((i / N) * 100).toFixed(3)}% 0 calc(${(((N - 1 - i) / N) * 100).toFixed(3)}% - ${i === N - 1 ? 0 : 0.6}px) 0)`,
          }} />
      ))}
      <div className="sash-fold absolute inset-0" style={m} />
      <div className="sash-shine absolute inset-0" style={m} />
      {sparks && <><Spark x="20%" y="10%" d={0} /><Spark x="62%" y="36%" d={0.8} /><Spark x="38%" y="80%" d={1.5} /></>}
    </div>
  )
}

// Sash treo ở đầu trang, đung đưa nhẹ như vải
export function HangingSash() {
  const s = bigSash(document.documentElement.clientWidth)
  const ref = useRef(null)
  const inView = useInView(ref)   // cuộn khỏi đầu trang → dừng đung đưa cho nhẹ máy
  return (
    <motion.div ref={ref} className="absolute top-0 z-40" style={{ right: s.right, width: s.width, height: s.height, transformOrigin: '50% 0%' }}
      animate={inView ? { rotate: [-1.6, 1.6] } : undefined} transition={{ duration: 3.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
      <SashImage soft={0.8} paused={!inView} />
    </motion.div>
  )
}
