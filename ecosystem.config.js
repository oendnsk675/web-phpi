module.exports = {
  apps: [
    {
      name: 'phpi',
      script: './src/server.js',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      env: {
        TZ: 'Asia/Jakarta',
      },
    },
  ],
};
