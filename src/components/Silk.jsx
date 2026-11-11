// Nền lụa bóng động (từ background.svg đã tối ưu thành webp nhẹ)
export default function Silk() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      <div className="silk absolute -inset-[12%]" />
      <div className="silk-sheen absolute inset-0" />
    </div>
  )
}
