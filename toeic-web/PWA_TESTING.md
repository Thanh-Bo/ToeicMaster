# PWA Testing Checklist

## ✅ Kiểm tra sau khi build

### 1. Build project
```bash
npm run build
```

### 2. Kiểm tra file được tạo
- [ ] `public/sw.js` - Service Worker
- [ ] `public/workbox-*.js` - Workbox files
- [ ] `public/manifest.json` - Manifest

### 3. Chạy production build
```bash
npm start
```

### 4. Chrome DevTools Tests

#### Tab Application → Manifest
- [ ] Manifest detected
- [ ] Name: "TOEIC Master - Luyện thi TOEIC"
- [ ] Short name: "TOEIC Master"
- [ ] Icons: đủ các size (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] Theme color: #3b82f6
- [ ] Background color: #ffffff
- [ ] Display: standalone
- [ ] Start URL: /

#### Tab Application → Service Workers
- [ ] SW registered
- [ ] Status: activated
- [ ] Scope: /
- [ ] Update on reload: checked (dev only)

#### Tab Application → Storage → Cache
- [ ] Caches created: offlineCache, static-resources, images
- [ ] Files cached successfully

#### Tab Lighthouse
- [ ] Run PWA audit
- [ ] Score: 90+ (ideally 100)
- [ ] All checks passed

### 5. Mobile Tests

#### Android (Chrome)
1. Mở website trên Chrome Android
2. Đợi popup "Add to Home Screen" hoặc vào Menu → "Add to Home Screen"
3. [ ] App xuất hiện trên màn hình chính
4. [ ] Mở app - không có thanh địa chỉ
5. [ ] Tắt wifi - app vẫn hoạt động (offline)

#### iOS (Safari)
1. Mở website trên Safari
2. Bấm Share → "Add to Home Screen"
3. [ ] App xuất hiện trên màn hình chính
4. [ ] Mở app - chạy fullscreen
5. [ ] Splash screen hiển thị đúng màu theme

### 6. Offline Tests
1. Load trang grammar
2. Tắt wifi/mạng
3. Refresh trang
4. [ ] Trang offline hiển thị (nếu chưa cache)
5. [ ] Hoặc trang vẫn load (nếu đã cache)

### 7. Update Tests
1. Deploy version mới
2. Mở app
3. [ ] App tự động update (Android)
4. [ ] Hoặc hiển thị thông báo update

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Site cannot be installed"
- **Nguyên nhân:** Thiếu HTTPS hoặc manifest không hợp lệ
- **Fix:** Kiểm tra HTTPS, validate manifest.json

### Lỗi: "No matching service worker detected"
- **Nguyên nhân:** SW chưa register
- **Fix:** Kiểm tra next.config.js, clear cache, rebuild

### Lỗi: Icons không hiển thị
- **Nguyên nhân:** Path sai hoặc file không tồn tại
- **Fix:** Kiểm tra /icons/ folder, đảm bảo file tồn tại

### Lỗi: "Add to Home Screen" không hiện
- **Nguyên nhân:** Chưa đủ điều kiện PWA
- **Fix:** Kiểm tra HTTPS, manifest, SW, icons

## 📊 Đánh giá PWA

| Tiêu chí | Trạng thái |
|----------|------------|
| Installable | ⬜ |
| Offline capable | ⬜ |
| Fast loading | ⬜ |
| Responsive | ⬜ |
| Secure (HTTPS) | ⬜ |

## 🚀 Deploy Production

### Yêu cầu:
- [ ] HTTPS enabled
- [ ] Domain chính thức
- [ ] Icons đầy đủ
- [ ] Testing hoàn tất

### Platforms:
- [ ] Vercel (tự động HTTPS)
- [ ] Netlify (tự động HTTPS)
- [ ] Other hosting with SSL

## 📝 Ghi chú

- Ghi lại ngày test: ___________
- Người test: ___________
- Kết quả: ___________
- Vấn đề phát hiện: ___________