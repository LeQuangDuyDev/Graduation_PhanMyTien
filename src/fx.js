// Cầu nối: các component gọi puff()/celebrate()/toss(), bộ vẽ thật nằm trong <Fx /> (components/Fx.jsx)
let impl = null
export const registerFx = (i) => { impl = i; return () => { if (impl === i) impl = null } }
export const puff = () => impl && impl.puff()           // pháo sao nhỏ khi mở nắp hộp
export const celebrate = () => impl && impl.celebrate() // pháo hoa lớn khi thư mở ra trang chính
export const toss = () => impl && impl.toss()           // tung mũ tốt nghiệp ở cuối trang
