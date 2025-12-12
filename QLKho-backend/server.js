require('dotenv').config();
const app = require('./src/app');         
const db = require('./src/models');

const PORT = process.env.PORT || 3000;

// Kết nối database
db.sequelize.authenticate()
  .then(() => {
    console.log('Kết nối Sequelize thành công');
    // Khởi chạy server sau khi kết nối thành công
    app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Lỗi kết nối Sequelize:', err);
  });

