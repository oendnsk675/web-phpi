exports.fetchProvinces = async () => {
  try {
    const response = await fetch('https://wilayah.id/api/provinces.json');
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Error(error);
  }
};

exports.fetchProvince = async (code) => {
  try {
    const response = await fetch('https://wilayah.id/api/provinces.json');
    const data = await response.json();
    const province = data?.data.find((prov) => prov.code === code)?.name;

    return province;
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Error(error);
  }
};

exports.fetchRegencies = async (provinceCode) => {
  try {
    const response = await fetch(
      `https://wilayah.id/api/regencies/${provinceCode}.json`,
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Error(error);
  }
};

exports.fetchRegency = async (provinceCode, code) => {
  try {
    const response = await fetch(
      `https://wilayah.id/api/regencies/${provinceCode}.json`,
    );
    const data = await response.json();
    const regency = data?.data.find((regency) => regency.code === code)?.name;

    return regency;
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Error(error);
  }
};
