const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Các kích thước icon cần tạo
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Đường dẫn file logo gốc (PNG)
const sourceLogo = path.join(__dirname, '..', 'public', 'logo.png');

// Thư mục đầu ra
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Kiểm tra file logo tồn tại
if (!fs.existsSync(sourceLogo)) {
  console.error('❌ Không tìm thấy file logo.png trong thư mục public/');
  console.log('💡 Vui lòng đổi tên logo.ico thành logo.png hoặc đặt file logo PNG vào public/logo.png');
  process.exit(1);
}

// Tạo thư mục icons nếu chưa tồn tại
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('📁 Đã tạo thư mục public/icons/');
}

async function generateIcons() {
  console.log('🎨 Đang tạo icons cho PWA...\n');

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✅ Đã tạo: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Lỗi khi tạo icon ${size}x${size}:`, error.message);
    }
  }

  console.log('\n🎉 Hoàn thành! Tất cả icons đã được tạo trong public/icons/');
  console.log('\n📋 Danh sách files:');
  sizes.forEach(size => {
    console.log(`   - icon-${size}x${size}.png`);
  });
}

generateIcons();
