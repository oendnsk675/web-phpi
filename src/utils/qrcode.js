const { createCanvas, loadImage } = require('canvas');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Generates a member card image with the provided member information.
 * The card includes the member's name, ID, a QR code, and a photo.
 * The generated card is saved as a PNG file.
 *
 * @param {Object} memberInfo - Information about the member.
 * @param {string} memberInfo.id - The ID of the member.
 * @param {string} memberInfo.email - The name of the member.
 * @param {string} memberInfo.phone - The name of the member.
 * @param {string} memberInfo.name - The name of the member.
 * @param {string} memberInfo.status - The name of the member.
 * @param {string} memberInfo.photo - The name of the member.
 * @param {string} memberInfo.qrData - Data to encode in the member's QR code.
 *
 * @returns {Promise<void>} A promise that resolves when the member card has been created and saved.
 */

exports.createMemberCard = async (memberInfo) => {
  try {
    const height = 1000;
    const width = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Latar belakang kartu
    const backgroundImagePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'assets',
      'images',
      'phpi-card-member.png',
    );
    const background = await loadImage(backgroundImagePath);
    ctx.drawImage(background, 0, 0, width, height);

    ctx.fillStyle = '#fff'; // Warna teks hitam
    ctx.font = 'bold 35px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(memberInfo.name, 300, 600); // Posisi teks ID
    ctx.textAlign = 'start';
    ctx.font = '25px Arial';
    ctx.fillText(`NIP     : -`, 60, 660); // Posisi teks ID
    ctx.fillText(`NSP/Reg : -`, 60, 700); // Posisi teks nama
    ctx.fillText(`No KTPP : -`, 60, 740); // Posisi teks nama

    // Render QR code
    const qrCodeData = await QRCode.toDataURL(memberInfo.qrData, {
      margin: 1,
    });
    const img = await loadImage(qrCodeData);
    const qrCodeX = (width - 160) / 2;
    ctx.drawImage(img, qrCodeX, 800, 160, 160);

    // Render photo
    let photoPath = '';
    if (memberInfo.photo != null) {
      photoPath = path.join(__dirname, '..', '..', memberInfo.photo);
      if (!fs.existsSync(photoPath)) {
        photoPath = path.join(
          __dirname,
          '..',
          '..',
          'public',
          'assets',
          'images',
          'user.png',
        );
      }
    } else {
      photoPath = path.join(
        __dirname,
        '..',
        '..',
        'public',
        'assets',
        'images',
        'user.png',
      );
    }
    const photo = await loadImage(photoPath);
    ctx.drawImage(photo, (width - 250) / 2, 240, 250, 250);

    // Simpan gambar ke file
    const outputFilePath = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'member-card',
      `${memberInfo.id}.png`,
    );
    const out = fs.createWriteStream(outputFilePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return new Promise((resolve, reject) => {
      out.on('finish', () => resolve(true));
      out.on('error', (err) => reject(false));
    });
  } catch (error) {
    console.error('Error creating member card:', error);
    return false;
  }
};

// const memberInfo = {
//   id: '123456',
//   email: 'Sayidina Ahmadal Qososyi',
//   phone: 'Sayidina Ahmadal Qososyi',
//   name: 'Sayidina Ahmadal Qososyi',
//   status: 'Active',
//   qrData: 'https://example.com/member/123456',
// };

// createMemberCard(memberInfo);
