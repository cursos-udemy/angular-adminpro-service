const dotenv = require('dotenv');

dotenv.config();

const config = {
  PORT: process.env.PORT || 5001,
  MONGO_DATABASE_URI: process.env.MONGO_DATABASE_URI,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN || "6h",
};

module.exports = config;