const mysql = require('mysql2/promise');
require('dotenv').config();

const loadSslCa = () => {
  const caValue = process.env.DB_CA || process.env.DB_SSL_CA;

  if (!caValue) return null;

  if (caValue.includes('BEGIN CERTIFICATE')) {
    return caValue;
  }

  try {
    const fs = require('fs');
    if (fs.existsSync(caValue)) {
      return fs.readFileSync(caValue, 'utf8');
    }
  } catch (e) {
    // Ignore file loading issues and fall back below.
  }

  return caValue;
};

const sslCa = loadSslCa();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  connectTimeout: 5000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslCa
    ? {
        minVersion: 'TLSv1.2',
        ca: sslCa,
        rejectUnauthorized: false,
      }
    : {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false,
      },
});

module.exports = pool;
