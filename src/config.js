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
  },
  restaurant: {
    name: 'Nhà hàng tiệc (cập nhật tên)',
    address: 'Cập nhật địa chỉ nhà hàng',
    time: '18:00 – Tiệc chúc mừng',
    mapQuery: 'Nhà hàng tiệc cưới Gò Vấp',
  },
  tables: [
    { name: 'Bàn 1 · Gia đình', guests: ['Ba', 'Mẹ', 'Anh chị em', 'Ông bà'] },
    { name: 'Bàn 2 · Bạn thân', guests: ['An', 'Bình', 'Chi', 'Dũng'] },
    { name: 'Bàn 3 · Bạn cùng lớp', guests: ['Em', 'Phúc', 'Giang', 'Hà'] },
    { name: 'Bàn 4 · Thầy cô', guests: ['Cô Hương', 'Thầy Long', 'Cô Mai'] },
  ],
}
