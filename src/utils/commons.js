exports.formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

exports.formatPhoneNumber = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) return cleaned;
  if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

/**
 * Format NSK(Nomor Sertifikat Kompetensi) number to comply with the PAR-XXXXX standard
 * @param {string} nsk - NSK number
 * @returns {string} Formatted NSK number
 */
exports.formatNSK = (nsk) => {
  return `PAR-${nsk}`;
};

exports.generateNIP = (kabkota_code, mm, yy, counter) => {
  if (!kabkota_code || kabkota_code.length < 4) {
    throw new Error('Invalid kabkota_code');
  }
  const serial = String(counter).padStart(4, '0');

  return `${kabkota_code}.${mm}${yy}.${serial}`;
};
