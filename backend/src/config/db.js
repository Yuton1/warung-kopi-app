const mysql = require('mysql2/promise');
require('dotenv').config();

const loadSslCa = () => {
    const caValue = process.env.DB_CA || process.env.DB_SSL_CA;

    if (!caValue) return null;

    // Jika teks mengandung header sertifikat, gunakan langsung
    if (caValue.includes('BEGIN CERTIFICATE')) {
        return caValue;
    }

    // Cek apakah file fisik ada (berfungsi di lokal/Laragon)
    try {
        const fs = require('fs');
        if (fs.existsSync(caValue)) {
            return fs.readFileSync(caValue, 'utf8');
        }
    } catch (e) {
        // Abaikan error jika fs tidak tersedia atau file tidak ada
    }

    return caValue; // Kembalikan nilai asli jika cara lain gagal
};

const sslCa = loadSslCa();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: sslCa ? {
        minVersion: 'TLSv1.2',
        ca: sslCa,
        rejectUnauthorized: true
    } : {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false // Fallback jika CA benar-benar tidak ada
    }
});

// Verifikasi koneksi (hanya muncul di log server)
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Koneksi TiDB Berhasil ke database: ' + process.env.DB_NAME);
        connection.release();
    } catch (err) {
        console.error('❌ Koneksi TiDB Gagal:', err.message);
    }
})();

module.exports = pool;