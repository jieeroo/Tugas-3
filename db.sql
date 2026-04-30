-- DATABASE: yasshiro_game
-- Jalankan file ini di phpMyAdmin 

CREATE DATABASE IF NOT EXISTS yasshiro_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yasshiro_game;

-- Tabel pesanan joki
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_pelanggan VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    game ENUM('wuthering_waves', 'genshin_impact') NOT NULL,
    layanan VARCHAR(100) NOT NULL,
    target VARCHAR(200) NOT NULL,
    akun_game VARCHAR(100) NOT NULL,
    password_game VARCHAR(100) NOT NULL,
    server VARCHAR(50) DEFAULT NULL,
    catatan TEXT DEFAULT NULL,
    harga DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'proses', 'selesai', 'dibatalkan') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel layanan & harga
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game ENUM('wuthering_waves', 'genshin_impact') NOT NULL,
    nama_layanan VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    harga_min DECIMAL(10,2) NOT NULL,
    harga_max DECIMAL(10,2) NOT NULL,
    satuan VARCHAR(50) DEFAULT 'per level',
    is_active TINYINT(1) DEFAULT 1
);

-- Insert layanan default Wuthering Waves
INSERT INTO services (game, nama_layanan, deskripsi, harga_min, harga_max, satuan) VALUES
('wuthering_waves', 'Level Up Union Level', 'Naik Union Level dengan cepat dan aman', 25000, 150000, 'per 5 level'),
('wuthering_waves', 'Spiral Abyss / Tower of Adversity', 'Clear semua floor dengan 3 stars', 50000, 150000, 'per 5 floor'),
('wuthering_waves', 'Farming Material', 'Farming ascension material karakter/weapon', 35000, 100000, 'per sesi'),
('wuthering_waves', 'Grinding Resonator', 'Level up resonator favorit kamu', 20000, 80000, 'per resonator'),
('wuthering_waves', 'Daily Commission', 'Daily mission selama 30 hari', 100000, 200000, 'per bulan');

-- Insert layanan default Genshin Impact
INSERT INTO services (game, nama_layanan, deskripsi, harga_min, harga_max, satuan) VALUES
('genshin_impact', 'Level Up Adventure Rank', 'Naik AR dengan cepat dan aman', 30000, 200000, 'per 5 AR'),
('genshin_impact', 'Spiral Abyss', 'Clear Spiral Abyss 12/12 floor 3 stars', 75000, 200000, 'per cycle'),
('genshin_impact', 'Farming Artifact', 'Farming artifact dengan domain terbaik', 40000, 120000, 'per sesi'),
('genshin_impact', 'World Quest / Story Quest', 'Selesaikan quest cerita & world quest', 30000, 80000, 'per quest'),
('genshin_impact', 'Daily Commission', 'Daily mission selama 30 hari', 120000, 250000, 'per bulan');