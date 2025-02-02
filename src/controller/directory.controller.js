const { Like } = require('typeorm');
const AppDataSource = require('../configs/ormconfig');
const Product = require('../models/Product');
const { formatRupiah } = require('../utils/commons');
require('dotenv').config();

exports.getAll = async (req, res) => {
  try {
    const directories = [
      {
        id: 1,
        chairman: {
          name: 'Ketua Bali',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Bali',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Pantai Kuta, Bali',
        email: 'bali@example.com',
        phone: '+62 811-0001-0001',
        instance: 'Bali',
      },
      {
        id: 2,
        chairman: {
          name: 'Ketua Bangka',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Bangka',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Timah, Pangkal Pinang',
        email: 'bangka@example.com',
        phone: '+62 811-0002-0002',
        instance: 'Bangka Belitung',
      },
      {
        id: 3,
        chairman: {
          name: 'Ketua Banten',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Banten',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Serang, Banten',
        email: 'banten@example.com',
        phone: '+62 811-0003-0003',
        instance: 'Banten',
      },
      {
        id: 4,
        chairman: {
          name: 'Ketua Bengkulu',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Bengkulu',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Rafflesia, Bengkulu',
        email: 'bengkulu@example.com',
        phone: '+62 811-0004-0004',
        instance: 'Bengkulu',
      },
      {
        id: 5,
        chairman: {
          name: 'Ketua Jakarta',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Jakarta',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Sudirman, Jakarta',
        email: 'jakarta@example.com',
        phone: '+62 811-0005-0005',
        instance: 'Jakarta',
      },
      {
        id: 6,
        chairman: {
          name: 'Ketua Jambi',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Jambi',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Sultan Thaha, Jambi',
        email: 'jambi@example.com',
        phone: '+62 811-0006-0006',
        instance: 'Jambi',
      },
      {
        id: 7,
        chairman: {
          name: 'Ketua Jawa Barat',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Jawa Barat',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Asia Afrika, Bandung',
        email: 'jabar@example.com',
        phone: '+62 811-0007-0007',
        instance: 'Jawa Barat',
      },
      {
        id: 8,
        chairman: {
          name: 'Ketua Jawa Tengah',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Jawa Tengah',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Pahlawan, Semarang',
        email: 'jateng@example.com',
        phone: '+62 811-0008-0008',
        instance: 'Jawa Tengah',
      },
      {
        id: 9,
        chairman: {
          name: 'Ketua Jawa Timur',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Jawa Timur',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Basuki Rahmat, Surabaya',
        email: 'jatim@example.com',
        phone: '+62 811-0009-0009',
        instance: 'Jawa Timur',
      },
      {
        id: 10,
        chairman: {
          name: 'Ketua Kalbar',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Kalbar',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Ahmad Yani, Pontianak',
        email: 'kalbar@example.com',
        phone: '+62 811-0010-0010',
        instance: 'Kalimantan Barat',
      },
      {
        id: 11,
        chairman: {
          name: 'Ketua Kalsel',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Kalsel',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Lambung Mangkurat, Banjarmasin',
        email: 'kalsel@example.com',
        phone: '+62 811-0011-0011',
        instance: 'Kalimantan Selatan',
      },
      {
        id: 12,
        chairman: {
          name: 'Ketua Kaltim',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Kaltim',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Jend. Sudirman, Samarinda',
        email: 'kaltim@example.com',
        phone: '+62 811-0012-0012',
        instance: 'Kalimantan Timur',
      },
      {
        id: 13,
        chairman: {
          name: 'Ketua Kalut',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Kalut',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Ahmad Yani, Tanjung Selor',
        email: 'kalut@example.com',
        phone: '+62 811-0013-0013',
        instance: 'Kalimantan Utara',
      },
      {
        id: 14,
        chairman: {
          name: 'Ketua Kepri',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Kepri',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Engku Putri, Batam',
        email: 'kepri@example.com',
        phone: '+62 811-0014-0014',
        instance: 'Kepulauan Riau',
      },
      {
        id: 15,
        chairman: {
          name: 'Ketua Lampung',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Lampung',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Raden Intan, Bandar Lampung',
        email: 'lampung@example.com',
        phone: '+62 811-0015-0015',
        instance: 'Lampung',
      },
      {
        id: 16,
        chairman: {
          name: 'Ketua Aceh',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Aceh',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Teuku Umar, Banda Aceh',
        email: 'aceh@example.com',
        phone: '+62 811-0016-0016',
        instance: 'Nangroe Aceh Darussalam',
      },
      {
        id: 17,
        chairman: {
          name: 'Ketua NTB',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris NTB',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Pejanggik, Mataram',
        email: 'ntb@example.com',
        phone: '+62 811-0017-0017',
        instance: 'Nusa Tenggara Barat',
      },
      {
        id: 18,
        chairman: {
          name: 'Ketua NTT',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris NTT',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. El Tari, Kupang',
        email: 'ntt@example.com',
        phone: '+62 811-0018-0018',
        instance: 'Nusa Tenggara Timur',
      },
      {
        id: 19,
        chairman: {
          name: 'Ketua Riau',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Riau',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Jend. Sudirman, Pekanbaru',
        email: 'riau@example.com',
        phone: '+62 811-0019-0019',
        instance: 'Riau',
      },
      {
        id: 20,
        chairman: {
          name: 'Ketua Sulsel',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sulsel',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Urip Sumoharjo, Makassar',
        email: 'sulsel@example.com',
        phone: '+62 811-0020-0020',
        instance: 'Sulawesi Selatan',
      },
      {
        id: 21,
        chairman: {
          name: 'Ketua Sulteng',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sulteng',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Moh. Yamin, Palu',
        email: 'sulteng@example.com',
        phone: '+62 811-0021-0021',
        instance: 'Sulawesi Tengah',
      },
      {
        id: 22,
        chairman: {
          name: 'Ketua Sultra',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sultra',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Ahmad Yani, Kendari',
        email: 'sultra@example.com',
        phone: '+62 811-0022-0022',
        instance: 'Sulawesi Tenggara',
      },
      {
        id: 23,
        chairman: {
          name: 'Ketua Sulut',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sulut',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Piere Tendean, Manado',
        email: 'sulut@example.com',
        phone: '+62 811-0023-0023',
        instance: 'Sulawesi Utara',
      },
      {
        id: 24,
        chairman: {
          name: 'Ketua Sumbar',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sumbar',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Jend. Sudirman, Padang',
        email: 'sumbar@example.com',
        phone: '+62 811-0024-0024',
        instance: 'Sumatera Barat',
      },
      {
        id: 25,
        chairman: {
          name: 'Ketua Sumsel',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sumsel',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Jend. Sudirman, Palembang',
        email: 'sumsel@example.com',
        phone: '+62 811-0025-0025',
        instance: 'Sumatera Selatan',
      },
      {
        id: 26,
        chairman: {
          name: 'Ketua Sumut',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Sumut',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Gatot Subroto, Medan',
        email: 'sumut@example.com',
        phone: '+62 811-0026-0026',
        instance: 'Sumatera Utara',
      },
      {
        id: 27,
        chairman: {
          name: 'Ketua Yogyakarta',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Yogyakarta',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Malioboro, Yogyakarta',
        email: 'jogja@example.com',
        phone: '+62 811-0027-0027',
        instance: 'Yogyakarta',
      },
      {
        id: 28,
        chairman: {
          name: 'Ketua Papua',
          image: 'https://placehold.co/150',
        },
        secretary: {
          name: 'Sekretaris Papua',
          image: 'https://placehold.co/150',
        },
        address: 'Jl. Raya Abepura, Jayapura',
        email: 'papua@example.com',
        phone: '+62 811-0028-0028',
        instance: 'Papua',
      },
    ];

    return res.render('pages/directory', {
      title: 'Directory - PHPI',
      directories,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.render('pages/errors/index');
  }
};
