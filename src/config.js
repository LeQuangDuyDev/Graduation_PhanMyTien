// ====== CHỈNH SỬA NỘI DUNG TẠI ĐÂY ======
// Ảnh: bỏ file vào /public/images rồi điền đường dẫn, ví dụ "/images/hero.jpg"
export const CONFIG = {
  name: 'Phan Mỹ Tiên',
  dateText: '22 · 11 · 2026',
  dateISO: '2026-11-22T08:00:00+07:00',
  heroImage: '/images/hero.webp',   // ảnh chủ buổi lễ (nền đầu trang)
  letterImage: '/images/letter.webp', // ảnh nền phần lời ngỏ
  letterTitle: 'Gửi đến người Tiên yêu quý',
  photos: ['', '', '', '', '', ''], // 6 ảnh chủ nhân
  letter: [
    'Có những hành trình tưởng chừng rất dài, nhưng rồi cũng đến ngày nhìn lại và nhận ra mình đã đi được một chặng đường thật đáng nhớ.',
    'Sau những ngày tháng học tập, những lần cố gắng, những niềm vui và cả những thử thách, mình cuối cùng cũng sắp chạm đến một cột mốc đặc biệt là ngày tốt nghiệp đại học!',
    'Đây không chỉ là ngày đánh dấu sự kết thúc của một hành trình, mà còn là khởi đầu cho những ước mơ và dự định mới.',
    'Mình rất mong bạn có thể dành chút thời gian đến tham dự, cùng chia sẻ niềm vui và lưu giữ khoảnh khắc đáng nhớ này với mình.',
  ],
  school: {
    name: 'Đại học Công nghiệp TP. Hồ Chí Minh (IUH)',
    address: '12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM',
    time: '08:00 – Lễ tốt nghiệp',
    mapQuery: 'Đại học Công nghiệp TP.HCM, 12 Nguyễn Văn Bảo, Gò Vấp',
    // 2 ảnh bên phải lịch (đổi thành ảnh của bạn: '/images/ten-anh.jpg')
    photos: ['/images/hero.webp', '/images/letter.webp'],
  },
  // Sơ đồ khu vực (ảnh vitri.svg đã đổi sang webp)
  location: { image: '/images/vitri.webp', note: 'Chạm vào ảnh để phóng to, kéo để xem chi tiết.' },
  restaurant: {
    name: 'Việt Phố 3',
    address: '', // ← điền địa chỉ nhà hàng (để trống thì sẽ ẩn dòng này)
    time: '18:00 – Tiệc chúc mừng',
    mapUrl: 'https://maps.app.goo.gl/jbfm5E7DHNnnaBLE9', // nút "Mở Google Maps"
    mapQuery: 'Nhà hàng Việt Phố 3',
    // Muốn bản đồ chính xác 100%: Google Maps → Chia sẻ → Nhúng bản đồ → copy phần src="..." dán vào đây
    embedUrl: '',
  },
  finalImage: '/images/anhcuoi.webp', // ảnh cuối trang
  // 2 bàn dài, mỗi bàn 16 ghế. Điền tên khách theo thứ tự ghế (tối đa 16 tên / bàn):
  // ghế 1–8 là hàng trên (trái → phải), ghế 9–16 là hàng dưới (trái → phải). Để trống ghế nào thì bỏ qua hoặc điền ''.
  tables: [
    { name: 'Bàn 1', note: 'Gia đình & Thầy cô', guests: ['Ba', 'Mẹ', 'Anh chị em', 'Ông bà', 'Cô Hương', 'Thầy Long', 'Cô Mai'] },
    { name: 'Bàn 2', note: 'Bạn bè', guests: ['An', 'Bình', 'Chi', 'Dũng', 'Em', 'Phúc', 'Giang', 'Hà'] },
  ],
}
