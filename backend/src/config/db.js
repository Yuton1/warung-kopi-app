const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const loadSslCa = () => {
    const caValue = process.env.DB_SSL_CA || process.env.DB_CA;

    if (!caValue) {
        return undefined;
    }

    if (caValue.includes('BEGIN CERTIFICATE')) {
        return caValue;
    }

    if (fs.existsSync(caValue)) {
        return fs.readFileSync(caValue, 'utf8');
    }

    try {
        return Buffer.from(caValue, 'base64').toString('utf8');
    } catch {
        return caValue;
    }
};

const sslCa = loadSslCa();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // TiDB Cloud butuh SSL; CA bisa dikirim via env sebagai isi PEM, base64, atau path file.
    ssl: sslCa
        ? {
            minVersion: 'TLSv1.2',
            ca: sslCa,
            rejectUnauthorized: true
        }
        : {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true
        }
});

// Verifikasi koneksi saat server startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Koneksi TiDB Berhasil: Terhubung ke database "' + process.env.DB_NAME + '"');
        connection.release();
    } catch (err) {
        console.error('❌ Koneksi TiDB Gagal:', err.message);
    }
})();

module.exports = pool;
