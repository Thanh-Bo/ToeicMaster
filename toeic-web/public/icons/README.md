# PWA Icons - Hướng dẫn tạo

## 📁 Thư mục này chứa icons cho PWA

### Các file cần có:
- `icon-72x72.png` - Android launcher
- `icon-96x96.png` - Android launcher
- `icon-128x128.png` - Chrome Web Store
- `icon-144x144.png` - Microsoft
- `icon-152x152.png` - iPad
- `icon-192x192.png` - Android/iOS (maskable)
- `icon-384x384.png` - Splash screen
- `icon-512x512.png` - Splash screen, Store

### 🎨 Yêu cầu thiết kế:
- **Format:** PNG với nền trong suốt hoặc màu
- **Màu chủ đạo:** #3b82f6 (blue)
- **Nội dung:** Logo TOEIC Master đơn giản, dễ nhìn
- **Maskable:** icon-192x192.png nên có padding an toàn (safe zone)

### 🛠️ Cách tạo:

#### Cách 1: Sử dụng Figma/Sketch/Illustrator
1. Tạo canvas 512x512px
2. Thiết kế logo ở giữa
3. Export các size cần thiết
4. Đảm bảo icon-192x192.png có padding 10% (maskable)

#### Cách 2: Sử dụng online tools
- https://pwa-asset-generator.nicepkg.cn/
- https://maskable.app/
- https://www.pwabuilder.com/imageGenerator

#### Cách 3: Sử dụng logo hiện tại
```bash
# Resize logo hiện tại thành các size khác nhau
# Sử dụng ImageMagick hoặc online converter
```

### ✅ Kiểm tra:
Sau khi thêm icons, chạy:
```bash
npm run build
npm start
```

Mở DevTools → Application → Manifest để kiểm tra icons load đúng.

### 📝 Lưu ý:
- Icons nên có cùng thiết kế, chỉ khác size
- Nên có cả light và dark version nếu cần
- icon-192x192.png là quan trọng nhất (dùng cho mọi thiết bị)