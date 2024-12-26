-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               11.2.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for simaks_office
DROP DATABASE IF EXISTS `simaks_office`;
CREATE DATABASE IF NOT EXISTS `simaks_office` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `simaks_office`;

-- Dumping structure for table simaks_office.bank_accounts
DROP TABLE IF EXISTS `bank_accounts`;
CREATE TABLE IF NOT EXISTS `bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank` varchar(256) NOT NULL,
  `number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.bank_accounts: ~2 rows (approximately)
INSERT INTO `bank_accounts` (`id`, `bank`, `number`) VALUES
	(1, 'Banca Intesa', '160-6000001231950-93'),
	(2, 'Komercijalna banka A.D.', '205-0000000206663-26');

-- Dumping structure for table simaks_office.clients
DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(32) NOT NULL,
  `pib` int(9) NOT NULL,
  `mb` int(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.clients: ~5 rows (approximately)
INSERT INTO `clients` (`id`, `name`, `address`, `city`, `pib`, `mb`) VALUES
	(1, 'Simaks doo', 'Pere Popadića 3', 'Novi Sad', 108480120, 21008001),
	(3, 'Clima Tech Design', 'Trg Marije Trandafil 7', 'Novi Sad', 111194577, 21439819),
	(4, 'LiRideNET', 'Industrijska 1a', 'Novi Sad', 100200300, 20300400),
	(5, 'SMGS d.o.o.', 'Gavrila Principa 11', 'Novi Sad', 106423176, 20598913),
	(6, 'Climate Design doo', 'Borska 5', 'Beograd', 109859633, 21256021);

-- Dumping structure for table simaks_office.offers
DROP TABLE IF EXISTS `offers`;
CREATE TABLE IF NOT EXISTS `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_number` int(11) NOT NULL,
  `offer_year` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_address` varchar(255) NOT NULL,
  `client_city` varchar(100) NOT NULL,
  `client_pib` varchar(50) DEFAULT NULL,
  `client_mb` varchar(50) DEFAULT NULL,
  `date_created` datetime DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL,
  `total_vat` decimal(15,2) DEFAULT NULL,
  `total_with_vat` decimal(15,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `idx_offer_number` (`offer_number`,`offer_year`),
  KEY `idx_client_name` (`client_name`(250))
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.offers: 3 rows
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` (`id`, `offer_number`, `offer_year`, `client_name`, `client_address`, `client_city`, `client_pib`, `client_mb`, `date_created`, `user_id`, `total_amount`, `total_vat`, `total_with_vat`, `notes`, `status`) VALUES
	(1, 12, 2024, 'Clima Tech Design', 'Trg Marije Trandafil 7', 'Novi Sad', '111194577', '21439819', '2024-10-15 10:50:16', NULL, 3270.00, 654.00, 3924.00, NULL, 'pending'),
	(2, 13, 2024, 'Simaks doo', 'Pere Popadića 3', 'Novi Sad', '108480120', '21008001', '2024-10-15 10:52:17', NULL, 11045.00, 2209.00, 13254.00, NULL, 'pending'),
	(3, 14, 2024, 'LiRideNET', 'Industrijska 1a', 'Novi Sad', '100200300', '20300400', '2024-10-15 13:22:00', NULL, 110.45, 22.09, 132.54, NULL, 'pending');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;

-- Dumping structure for table simaks_office.offer_items
DROP TABLE IF EXISTS `offer_items`;
CREATE TABLE IF NOT EXISTS `offer_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `quantity` decimal(15,2) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `price_with_discount` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `vat_percent` decimal(5,2) DEFAULT 20.00,
  `vat_amount` decimal(15,2) NOT NULL,
  `total` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.offer_items: 3 rows
/*!40000 ALTER TABLE `offer_items` DISABLE KEYS */;
INSERT INTO `offer_items` (`id`, `offer_id`, `code`, `description`, `unit`, `quantity`, `price`, `discount`, `price_with_discount`, `amount`, `vat_percent`, `vat_amount`, `total`) VALUES
	(1, 1, '0001', 'Daikin Toplotna pumpa EWGA16QW02Toplotna pumpa izmisljenog naziva modela', 'kom', 1.00, 3270.00, 0.00, 3270.00, 3270.00, 20.00, 654.00, 3924.00),
	(2, 2, '0010', 'TommaTech Solarni panel 455Wp HC455WSolarni panel snage 455W', 'kom', 100.00, 110.45, 0.00, 110.45, 11045.00, 20.00, 2209.00, 13254.00),
	(3, 3, '0010', 'TommaTech Solarni panel 455Wp HC455WSolarni panel snage 455W', 'kom', 1.00, 110.45, 0.00, 110.45, 110.45, 20.00, 22.09, 132.54);
/*!40000 ALTER TABLE `offer_items` ENABLE KEYS */;

-- Dumping structure for table simaks_office.offer_numbers
DROP TABLE IF EXISTS `offer_numbers`;
CREATE TABLE IF NOT EXISTS `offer_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `godina` int(11) NOT NULL,
  `broj` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.offer_numbers: 1 rows
/*!40000 ALTER TABLE `offer_numbers` DISABLE KEYS */;
INSERT INTO `offer_numbers` (`id`, `godina`, `broj`) VALUES
	(2, 2024, 14);
/*!40000 ALTER TABLE `offer_numbers` ENABLE KEYS */;

-- Dumping structure for table simaks_office.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(11) DEFAULT NULL,
  `type` tinytext NOT NULL DEFAULT 'P',
  `manufacturer` varchar(255) DEFAULT '',
  `name` varchar(128) DEFAULT '',
  `model` varchar(32) DEFAULT '',
  `img_url` varchar(255) DEFAULT 'dummy.jpg',
  `description` varchar(512) DEFAULT '',
  `items` varchar(2048) DEFAULT '',
  `unit` varchar(8) NOT NULL DEFAULT 'kom',
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `NAME` (`name`) USING BTREE,
  KEY `MODEL` (`model`),
  KEY `MANUFACTURER` (`manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=347 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.products: ~344 rows (approximately)
INSERT INTO `products` (`id`, `code`, `type`, `manufacturer`, `name`, `model`, `img_url`, `description`, `items`, `unit`, `price`) VALUES
	(1, 208, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA ', 'ABQ125C', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(2, 212, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'ABQ140C', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(3, 213, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZQS140BY1', 'dummy.jpg', '', '', 'kom', 0),
	(4, 216, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTX35J3', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(5, 312, 'P', 'DAIKIN', 'FAN COIL', 'FWF02BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(6, 314, 'P', 'DAIKIN', 'PRIPADAJUĆA TACNA ZA KONDENZAT ZA FC', 'EDPVB6', 'dummy.jpg', '', '', 'kom', 0),
	(7, 315, 'P', 'DAIKIN', 'FAN COIL', 'FWV04DTN', 'dummy.jpg', 'PARAPETNI FAN COIL', '', 'kom', 0),
	(8, 317, 'P', 'DAIKIN', 'KONTROLER ', 'FWEC1A', 'dummy.jpg', 'KONTROLER ZA FAN COIL', '', 'kom', 6682.84),
	(9, 320, 'P', 'DAIKIN', 'FAN COIL', 'FWF02BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 41704.16),
	(10, 322, 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYFQ60B3', 'dummy.jpg', '', '', 'kom', 20845.2),
	(11, 323, 'P', 'DAIKIN', 'KONTROLER', 'BRC315D', 'dummy.jpg', '', '', 'kom', 8969.76),
	(12, 324, 'P', 'DAIKIN', 'TROKRAKI VENTIL', 'EKMV3C09B', 'dummy.jpg', '', '', 'kom', 8401.44),
	(13, 330, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ8TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 392478.54),
	(14, 376, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXMQ200MB', 'dummy.jpg', 'PLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 168553.25),
	(15, 377, 'P', 'DAIKIN', 'KONTROLER', 'BRC1D52', 'dummy.jpg', '', '', 'kom', 6575.44),
	(16, 392, 'P', 'DAIKIN', 'FAN COIL', 'FWF02CT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 33493.13),
	(17, 394, 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'DCP600TC', 'dummy.jpg', '', '', 'kom', 14018.86),
	(18, 547, 'P', 'DAIKIN', 'KONTROLER', 'WRC-HPC', 'dummy.jpg', '', '', 'kom', 2176.16),
	(19, 553, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ40A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 68928.44),
	(20, 554, 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M20T', 'dummy.jpg', '', '', 'kom', 6884.11),
	(21, 555, 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M29T9', 'dummy.jpg', '', '', 'kom', 8726.08),
	(22, 556, 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M64T', 'dummy.jpg', '', '', 'kom', 8268.36),
	(23, 559, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ32P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 70116.96),
	(24, 566, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ18T', 'dummy.jpg', '', '', 'kom', 738975.2),
	(25, 570, 'P', 'SMGS', 'SAMOPADAJUĆA ŽALUZINA ', 'GR 300X300', 'dummy.jpg', '', '', 'kom', 820.95),
	(26, 573, 'P', 'SMGS', 'VENTILATOR', '100S', 'dummy.jpg', '', '', 'kom', 1600),
	(27, 603, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ12TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 472001.63),
	(28, 604, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ20P', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 34034.4),
	(29, 605, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ32P', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 37555.2),
	(30, 606, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXHQ32A', 'dummy.jpg', 'PLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 93995.35),
	(31, 614, 'P', 'DAIKIN', 'KONTROLER', 'BRC4C65', 'dummy.jpg', '', '', 'kom', 9677.66),
	(32, 617, 'P', 'DAIKIN', 'KONTROLER', 'BRC1E53B', 'dummy.jpg', '', '', 'kom', 10528.21),
	(33, 669, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ016CW1', 'dummy.jpg', '', '', 'kom', 349872.86),
	(34, 670, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX16CB9W', 'dummy.jpg', '', '', 'kom', 245783.53),
	(35, 671, 'P', 'DAIKIN', 'KADICA ZA KONDENZAT', 'EKHBDPC2', 'dummy.jpg', '', '', 'kom', 14874.69),
	(36, 672, 'P', 'DAIKIN', 'KONTROLER', 'EKRUCBL1', 'dummy.jpg', '', '', 'kom', 9027.75),
	(37, 686, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ63A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 70500.74),
	(38, 706, 'P', 'DAIKIN', 'KONTROLER', 'FWEC2A', 'dummy.jpg', '', '', 'kom', 10063.86),
	(39, 713, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ20A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 60154.76),
	(40, 714, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ25A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 63607.36),
	(41, 716, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ32A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 62422.45),
	(42, 717, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ50A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 71012.58),
	(43, 718, 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYFQ60CW', 'dummy.jpg', '', '', 'kom', 10270.25),
	(44, 719, 'P', 'DAIKIN', 'KONTROLER', 'BRC1E53A', 'dummy.jpg', '', '', 'kom', 10326.23),
	(45, 731, 'P', 'DAIKIN', 'REGULATOR', 'EKRUCBL6', 'dummy.jpg', '', '', 'kom', 13691.39),
	(46, 732, 'P', 'DAIKIN', 'TROKRAKI VENTIL', 'EUMBPART', 'dummy.jpg', '', '', 'kom', 16361.98),
	(47, 733, 'P', 'DAIKIN', 'FAN COIL', 'FWM04DTN', 'dummy.jpg', 'KANALSKA UNUTRA[NJA JEDINICA', '', 'kom', 22202.53),
	(48, 817, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FBA140A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 104410.12),
	(49, 818, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZAS140MY1', 'dummy.jpg', '', '', 'kom', 130627.95),
	(50, 830, 'P', 'DAIKIN', 'RAZVODNI BOX', 'BS1Q10A', 'dummy.jpg', '', '', 'kom', 33509.82),
	(51, 835, 'P', 'DAIKIN', 'RAČVA', 'KHRQ23M64T', 'dummy.jpg', '', '', 'kom', 21245.83),
	(52, 842, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FDXM35F3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 45717.07),
	(53, 846, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ50A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 68932.34),
	(54, 854, 'P', 'DAIKIN', 'TERMOSTAT ZA FAN COIL', 'YFSTA6', 'dummy.jpg', '', '', 'kom', 1176.38),
	(55, 856, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX11CB9W', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA TOPLOTNE PUMPE', '', 'kom', 208802.31),
	(56, 857, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ011CW1', 'dummy.jpg', '', '', 'kom', 209280.88),
	(57, 884, 'P', 'DAIKIN', 'FAN COIL', 'FWZ02ATN', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 33044.8),
	(58, 885, 'P', 'DAIKIN', 'KONTROLER', 'FWEC3A', 'dummy.jpg', '', '', 'kom', 13516.29),
	(59, 886, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ25A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 44226.19),
	(60, 887, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ32A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 47112.83),
	(61, 888, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ25A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 56049.16),
	(62, 889, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ20A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 47600),
	(63, 892, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ10TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 445472.15),
	(64, 908, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHVX16S26CB9W', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA SA REZERVOAROM OD 260L', '', 'kom', 349405.08),
	(65, 909, 'P', 'DAIKIN', 'TOPLOTNA PUMPA ', 'ERLQ14CW1', 'dummy.jpg', '	', '', 'kom', 281161.34),
	(66, 910, 'P', 'DAIKIN', 'FAN COIL', 'FFA25A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 57954.55),
	(67, 911, 'P', 'DAIKIN', 'FAN COIL', 'FFA35A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 48531.61),
	(68, 923, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'SEHVX32BW', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA TOPLOTNE PUMPE', '', 'kom', 349263.71),
	(69, 924, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SERHQ032BW1', 'dummy.jpg', '', '', 'kom', 624382.43),
	(70, 927, 'P', 'DAIKIN', 'FAN COIL', 'FWF05BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 49175.3),
	(71, 933, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM35M', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 34675.45),
	(72, 942, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ12T', 'dummy.jpg', '', '', 'kom', 635679.44),
	(73, 943, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ10T', 'dummy.jpg', '', '', 'kom', 529621),
	(74, 944, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ40P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 83492.06),
	(75, 945, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ50P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 69429.5),
	(76, 946, 'P', 'DAIKIN', 'RAČVA', 'BHFQ22P1007', 'dummy.jpg', '', '', 'kom', 9311.43),
	(77, 947, 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M75T', 'dummy.jpg', '', '', 'kom', 13050.78),
	(78, 945, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXDQ32A3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 51697.08),
	(79, 959, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FCAG140A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 135148.19),
	(80, 960, 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYCQ140D', 'dummy.jpg', '', '', 'kom', 16230.65),
	(81, 1048, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-93', 'dummy.jpg', '3000 M3/H', '', 'kom', 0),
	(82, 1049, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-102', 'dummy.jpg', '4000 M3/H', '', 'kom', 0),
	(83, 1071, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ32A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 59719.2),
	(84, 1084, 'P', 'DAIKIN', 'CENTRALNI KONTROLER', 'DCC601A51', 'dummy.jpg', '', '', 'kom', 59712.53),
	(85, 1096, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EBLQ07CV3', 'dummy.jpg', '', '', 'kom', 278739.74),
	(86, 1097, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EBLQ011C3W1', 'dummy.jpg', '', '', 'kom', 357440.91),
	(87, 1098, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EBLQ016C3W1', 'dummy.jpg', '', '', 'kom', 415867.89),
	(88, 1113, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ35P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(89, 1116, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FWF4CT', 'dummy.jpg', 'KASETNA UNUTRAŠTNJA JEDINICA', '', 'kom', 0),
	(90, 1117, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-71', 'dummy.jpg', '500 M3/H', '', 'kom', 0),
	(91, 1118, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-72', 'dummy.jpg', '1000 M3/H', '', 'kom', 0),
	(92, 1119, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-73', 'dummy.jpg', '1500 M3/H', '', 'kom', 0),
	(93, 1120, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-91', 'dummy.jpg', '2000 M3/H', '', 'kom', 0),
	(94, 1121, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-92', 'dummy.jpg', '2500 M3/H', '', 'kom', 0),
	(95, 1148, 'P', 'SIEMENS', 'KONTROLER', 'RDG-160T', 'dummy.jpg', '', '', 'kom', 0),
	(96, 1149, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SEHVX64BW', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA TOPLOTNE PUMPE', '', 'kom', 0),
	(97, 1150, 'P', 'DAIKIN', 'UGRADNI NOSAC', 'FWFCKA', 'dummy.jpg', '', '', 'kom', 0),
	(98, 1151, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXJ35MS', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U SIVOJ BOJI', '', 'kom', 0),
	(99, 1152, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXJ35M', 'dummy.jpg', '', '', 'kom', 0),
	(100, 1153, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXJ35MW', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U BELOJ BOJI', '', 'kom', 0),
	(101, 1154, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXA35AS', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U SIVOJ BOJI', '', 'kom', 0),
	(102, 1155, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXA35A', 'dummy.jpg', '', '', 'kom', 0),
	(103, 1156, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXA35AW', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U BELOJ BOJI', '', 'kom', 0),
	(104, 1157, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXA35AT', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U BOJI: CRNO DRVO', '', 'kom', 0),
	(105, 1158, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXA20AT', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA U BOJI: CRNO DRVO', '', 'kom', 0),
	(106, 1159, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FVA71A', 'dummy.jpg', 'PARAPETNI URAĐAJ', '', 'kom', 0),
	(107, 1160, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQO64BAWP-HR', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(108, 1161, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', '3MXS52E', 'dummy.jpg', '', '', 'kom', 0),
	(109, 1162, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZASG71MV1', 'dummy.jpg', '', '', 'kom', 0),
	(110, 1163, 'P', 'ACS CLIMA', 'ELEKTRICNI GREJAC', '6KW', 'dummy.jpg', '', '', 'kom', 0),
	(111, 1195, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EHBX11CB3V', 'dummy.jpg', '', '', 'kom', 0),
	(112, 1196, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ011CV3', 'dummy.jpg', '', '', 'kom', 0),
	(113, 1211, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVIT-71', 'dummy.jpg', '???????', '', 'kom', 0),
	(114, 1213, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ040BAWP-H', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(115, 1214, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ050BAWP-H', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(116, 1217, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FVXM35F', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(117, 1218, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', '5MXM90N', 'dummy.jpg', '', '', 'kom', 0),
	(118, 1226, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXF25A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(119, 1227, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXF25A', 'dummy.jpg', '', '', 'kom', 0),
	(120, 1228, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM35N9', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(121, 1229, 'P', 'DAIKIN', 'ONLAJN KONTROLER', 'BRP069B45', 'dummy.jpg', '', '', 'kom', 0),
	(122, 1230, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZQS125BY1', 'dummy.jpg', '', '', 'kom', 0),
	(123, 1238, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM42N', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(124, 1239, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXM42N9', 'dummy.jpg', '', '', 'kom', 0),
	(125, 1380, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-101', 'dummy.jpg', '3500 M3/H', '', 'kom', 0),
	(126, 1383, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FDXM35F3V1B9', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(127, 1396, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERRQ016AY1', 'dummy.jpg', '', '', 'kom', 0),
	(128, 1524, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ310F-XS081', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(129, 1529, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SERHQ032AAW1', 'dummy.jpg', '', '', 'kom', 0),
	(130, 1530, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYLQ14T', 'dummy.jpg', '', '', 'kom', 0),
	(131, 1531, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYLQ10T', 'dummy.jpg', '', '', 'kom', 0),
	(132, 1532, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWAQ032CAWP', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(133, 1533, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXF25B', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(134, 1534, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXF35A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(135, 1540, 'P', 'DAIKIN', 'ONLAJN  KONTROLER', 'BRP069A62', 'dummy.jpg', '', '', 'kom', 0),
	(136, 1541, 'P', 'DAIKIN', 'FAN COIL', 'FWE04CT', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(137, 1542, 'P', 'DAIKIN', 'FAN COIL', 'FWE06CT', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(138, 1574, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERGA08DV', 'dummy.jpg', '', '', 'kom', 0),
	(139, 1578, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FVXM50F', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(140, 1579, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXM50N9', 'dummy.jpg', '', '', 'kom', 0),
	(141, 1580, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC06B', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(142, 1581, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC60B', 'dummy.jpg', '', '', 'kom', 0),
	(143, 1582, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FHA35A9', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(144, 1604, 'P', 'DAIKIN', 'UKRASNA MASKA', 'BYCQ140E', 'dummy.jpg', '', '', 'kom', 0),
	(145, 1605, 'P', 'DAIKIN', 'KONTROLER', 'EKCC-W', 'dummy.jpg', '', '', 'kom', 0),
	(146, 1606, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM50N', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(147, 1640, 'P', 'DAIKIN', 'KONTROLER', 'BRC1HHDW', 'dummy.jpg', '', '', 'kom', 0),
	(148, 1669, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYT340B-SSA2004', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(149, 1674, 'P', 'HIDROS', 'ODVLAZIVAC', '1SBA,050A-2', 'dummy.jpg', '', '', 'kom', 0),
	(150, 1675, 'P', 'HIDROS', 'ODVLAZIVAC', '1SHA,100A-2', 'dummy.jpg', '', '', 'kom', 0),
	(153, 1677, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-103', 'dummy.jpg', '5000 M3/H', '', 'kom', 0),
	(154, 1678, 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-104', 'dummy.jpg', '', '', 'kom', 0),
	(155, 1607, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZAG50A', 'dummy.jpg', '', '', 'kom', 0),
	(156, 1686, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ014CW1', 'dummy.jpg', '', '', 'kom', 0),
	(157, 1688, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXP71M', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(158, 1689, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXP71M', 'dummy.jpg', '', '', 'kom', 0),
	(159, 1781, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', '2AMX40G', 'dummy.jpg', 'MULTI SPLIT SISTEM', '', 'kom', 0),
	(160, 1782, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', '2AMX50G', 'dummy.jpg', 'MULTI SPLIT SISTEM', '', 'kom', 0),
	(161, 1783, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'ATXS20K', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA MULTI SPLIT SISTEMA', '', 'kom', 0),
	(162, 1786, 'P', 'DAIKIN', 'KONTROLER', 'BRC1H52W', 'dummy.jpg', '', '', 'kom', 0),
	(163, 1787, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RYYQ12U', 'dummy.jpg', '', '', 'kom', 0),
	(164, 1788, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXUQ71A', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(165, 1789, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ15A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(166, 1802, 'P', 'HIDROS', 'TOPLOVODNI GREJAČ', 'HOWA', 'dummy.jpg', '', '', 'kom', 0),
	(167, 1844, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EPRA16DW1', 'dummy.jpg', '', '', 'kom', 0),
	(168, 1845, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'ETBH16D9W', 'dummy.jpg', '', '', 'kom', 0),
	(169, 1899, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWP0014KBW1N', 'dummy.jpg', '', '', 'kom', 0),
	(170, 1901, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWP022KBW1N', 'dummy.jpg', '', '', 'kom', 0),
	(171, 1902, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWP045KBW1N-REEXPORT', 'dummy.jpg', '', '', 'kom', 0),
	(172, 1906, 'P', 'DAIKIN', 'FAN COIL', 'FWL02DTN', 'dummy.jpg', 'PARAPETNA/PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(173, 1907, 'P', 'DAIKIN', 'FAN COIL', 'FWL03DTN', 'dummy.jpg', 'PARAPETNA/PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(174, 1908, 'P', 'DAIKIN', 'FAN COIL', 'FWL4DTN', 'dummy.jpg', 'PARAPETNA/PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(175, 1909, 'P', 'DAIKIN', 'FAN COIL', 'FWL08DTN', 'dummy.jpg', 'PARAPETNA/PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(176, 1910, 'P', 'DAIKIN', 'INSTALACIONI BOX ZA KONTROLER', 'FWECKA', 'dummy.jpg', '', '', 'kom', 0),
	(177, 1911, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWP022KBWIN', 'dummy.jpg', '', '', 'kom', 0),
	(178, 1923, 'P', 'DAIKIN', 'FAN COIL', 'FWL10DTN', 'dummy.jpg', 'PARAPETNA/PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(179, 1924, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ50A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(180, 1925, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ50B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(181, 1946, 'P', 'DAIKIN', 'FAN COIL', 'FWV02DATD6V3', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(182, 2051, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC25C', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(183, 2052, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC25C', 'dummy.jpg', '', '', 'kom', 0),
	(184, 2053, 'P', 'DAIKIN', 'KONTROLER', 'BRC7EB518', 'dummy.jpg', '', '', 'kom', 0),
	(185, 2054, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZAG100NY1', 'dummy.jpg', '', '', 'kom', 0),
	(186, 2055, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZAG125NY1', 'dummy.jpg', '', '', 'kom', 0),
	(187, 2056, 'P', 'DAIKIN', 'ADAPTER ZA REGULATOR', 'KRP4A51', 'dummy.jpg', '', '', 'kom', 0),
	(188, 2057, 'P', 'DAIKIN', 'REKUPERATOR', 'VAM500J', 'dummy.jpg', '500 M3/H', '', 'kom', 0),
	(189, 2058, 'P', 'DAIKIN', 'ELEKTRIČNI GREJAČ', 'GSIEKA200024', 'dummy.jpg', '', '', 'kom', 0),
	(190, 2059, 'P', 'DAIKIN', 'KONTROLER', 'BRC301B61', 'dummy.jpg', '', '', 'kom', 0),
	(191, 2125, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FHA140A', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(192, 2126, 'P', 'DAIKIN', 'FAN COIL', 'FWV08DATD6V3', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(193, 1328, 'P', 'DAIKIN', 'KONTROLER', 'BRC1H519W7', 'dummy.jpg', '', '', 'kom', 0),
	(194, 2130, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC35C', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(195, 2131, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC35C', 'dummy.jpg', '', '', 'kom', 0),
	(196, 2132, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC50C', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(197, 2133, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC50C', 'dummy.jpg', '', '', 'kom', 0),
	(198, 2134, 'P', 'DAIKIN', 'REKUPERATOR', 'VAM1500FC', 'dummy.jpg', '1500 M3/H', '', 'kom', 0),
	(199, 2140, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC20C', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(200, 2141, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC20C', 'dummy.jpg', '', '', 'kom', 0),
	(201, 2187, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHVX11S26CB9W', 'dummy.jpg', 'PODNA TOPLOTNA PUMPA VAZDUH-VODA ZA GREJANJE, HLAĐENJE I TOPLU VODU', '', 'kom', 0),
	(202, 2190, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ14U', 'dummy.jpg', '', '', 'kom', 0),
	(203, 2191, 'P', 'DAIKIN', 'EKSPANZIONI VENTIL', 'EKEXV200', 'dummy.jpg', '', '', 'kom', 0),
	(204, 2192, 'P', 'DAIKIN', 'PCB ADAPTER', 'BRP2A81', 'dummy.jpg', '', '', 'kom', 0),
	(205, 2193, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXDQ25A3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(206, 2194, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXDQ40A3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(207, 2195, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ80A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(208, 2196, 'P', 'DAIKIN', 'UKRASNA MASKA', 'BYCQ140DG9', 'dummy.jpg', '', '', 'kom', 0),
	(209, 2211, 'P', 'DAIKIN', 'ADAPTER', 'DTA104A62-9', 'dummy.jpg', '', '', 'kom', 0),
	(210, 2212, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERGA08EV', 'dummy.jpg', '', '', 'kom', 0),
	(211, 2213, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERGA06EV', 'dummy.jpg', '', '', 'kom', 0),
	(212, 2214, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERGA04EV', 'dummy.jpg', '', '', 'kom', 0),
	(213, 2215, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX08E9W', 'dummy.jpg', 'ZIDNA TOPLOTNA PUMPA VAZDUH-VODA', '', 'kom', 0),
	(214, 2216, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX04E9W', 'dummy.jpg', 'ZIDNA TOPLOTNA PUMPA VAZDUH-VODA', '', 'kom', 0),
	(215, 2217, 'P', 'DAIKIN', 'POSUDA ZA KONDEZAT', 'EKDP008D', 'dummy.jpg', '', '', 'kom', 0),
	(216, 2218, 'P', 'DAIKIN', 'GREJAČ', 'EKDPH008C', 'dummy.jpg', '', '', 'kom', 0),
	(217, 2228, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXJ35M9', 'dummy.jpg', '', '', 'kom', 0),
	(218, 2230, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXM35R', 'dummy.jpg', '', '', 'kom', 0),
	(219, 2231, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXA35A9', 'dummy.jpg', '', '', 'kom', 0),
	(220, 2233, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ40A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(221, 2234, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQQ18T', 'dummy.jpg', '', '', 'kom', 0),
	(222, 2242, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXA50BS', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(223, 2243, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXA50B', 'dummy.jpg', '', '', 'kom', 0),
	(224, 2253, 'P', 'DAIKIN', 'KONTROLER', 'BRC1H52K', 'dummy.jpg', '', '', 'kom', 0),
	(225, 2275, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXC60C', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(226, 2276, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXC60C', 'dummy.jpg', '', '', 'kom', 0),
	(227, 2282, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ16U', 'dummy.jpg', '', '', 'kom', 0),
	(228, 2283, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ8U', 'dummy.jpg', '', '', 'kom', 0),
	(229, 2284, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ12U', 'dummy.jpg', '', '', 'kom', 0),
	(230, 2285, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ10U', 'dummy.jpg', '', '', 'kom', 0),
	(231, 2286, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXMQ80P7', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(232, 2287, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ40B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(233, 2288, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ63B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(234, 2289, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ80B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(235, 2290, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ15A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(236, 2291, 'P', 'DAIKIN', 'REKUPERATOR', 'VKM100GB', 'dummy.jpg', '', '', 'kom', 0),
	(237, 2298, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ20A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(238, 2299, 'P', 'DAIKIN', 'INTELIGENTNI DODIRNI UPRAVLJAČ', 'DCM601A51', 'dummy.jpg', '', '', 'kom', 0),
	(239, 2300, 'P', 'DAIKIN', 'KOMPLET SENZORA', 'BRYQ60AW', 'dummy.jpg', '', '', 'kom', 0),
	(240, 2301, 'P', 'DAIKIN', 'UKRASNA MASKA', 'BYK45F', 'dummy.jpg', '', '', 'kom', 0),
	(241, 2302, 'P', 'DAIKIN', 'ADAPTER', 'DCM601A52', 'dummy.jpg', '', '', 'kom', 0),
	(242, 2303, 'P', 'DAIKIN', 'KONTROLER', 'BRC7E530', 'dummy.jpg', '', '', 'kom', 0),
	(243, 2309, 'P', 'DAIKIN', 'ADAPTER', 'KLIC-DI', 'dummy.jpg', '', '', 'kom', 0),
	(244, 2310, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SERHQ020BW1', 'dummy.jpg', '', '', 'kom', 0),
	(245, 2312, 'P', 'DAIKIN', 'ONLINE KONTROLER', 'BRP069B43', 'dummy.jpg', '', '', 'kom', 0),
	(246, 2313, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWPO45KAW1MB', 'dummy.jpg', '', '', 'kom', 0),
	(247, 2314, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWPO45KAW1M', 'dummy.jpg', '', '', 'kom', 0),
	(248, 2315, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SEHVX20AAW', 'dummy.jpg', '', '', 'kom', 0),
	(249, 2316, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXMLQ8T', 'dummy.jpg', '', '', 'kom', 0),
	(250, 2317, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXKQ40MA', 'dummy.jpg', 'UGAONA KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(251, 2365, 'P', 'DAIKIN', 'KLIMA', 'FTXC35C/RXC35C', 'dummy.jpg', '', '', 'kom', 0),
	(252, 2366, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 130SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(253, 2367, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 230SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(254, 2368, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 430 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(255, 2369, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 630 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(256, 2370, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 830 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(257, 2371, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VA 1030 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(258, 2372, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VB 130 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(259, 2373, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VB 230 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(260, 2374, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VB 430 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(261, 2375, 'P', 'ACTIONCLIMA', 'FAN COIL', 'FX-VB 630 SX CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(262, 2376, 'P', 'ACTIONCLIMA', 'FAN COIL', 'TAE SNDA CVE 22', 'dummy.jpg', 'PARAPTENA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(263, 2378, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EHVH16S26CB9W', 'dummy.jpg', 'PODNA TOPLOTNA PUMPA VAZDUH-VODA ZA GREJANJE, HLAĐENJE I TOPLU VODU', '', 'kom', 0),
	(264, 2400, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EDLQ014CV3', 'dummy.jpg', '', '', 'kom', 0),
	(265, 2401, 'P', 'DAIKIN', 'TOPLOTNA PUMPA VRV IV', 'RXYLQ12T', 'dummy.jpg', '', '', 'kom', 0),
	(266, 2402, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ050BAWHBH', 'dummy.jpg', '', '', 'kom', 0),
	(267, 2411, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ20B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(268, 2412, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ100B', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
	(269, 2413, 'P', 'DAIKIN', 'RAČVA ZA SPAJANJE SPOLJ.JEDINICA', 'BHQ22P1517', 'dummy.jpg', '', '', 'kom', 0),
	(270, 2414, 'P', 'DAIKIN', 'REKUPERATOR', 'VAM2000FC', 'dummy.jpg', '2000 M3/H', '', 'kom', 0),
	(271, 2419, 'P', 'ASPEN', 'KONDEZ PUMPA', 'ORANG.SILENT', 'dummy.jpg', '', '', 'kom', 0),
	(272, 2420, 'P', 'DAIKIN', 'MOTOR VENT', '61W 8P NIDEC SHIBAURA', 'dummy.jpg', '', '', 'kom', 0),
	(273, 2423, 'P', 'SOLARWATT', 'SOLARNI PANEL', 'VISION 60M STYLE(315WP)', 'dummy.jpg', '', '', 'kom', 0),
	(274, 2424, 'P', 'SOLARWATT', 'KRAJNJA STEZALJKA', 'RH32-50DTX40.SET', 'dummy.jpg', '', '', 'kom', 0),
	(275, 2425, 'P', 'SOLARWATT', 'SINA NOSACA PANELA', 'TRAPEO 25X46X40MM', 'dummy.jpg', '', '', 'kom', 0),
	(276, 2426, 'P', 'SOLARWATT', 'SOLARNI REGUL.', 'ENERGYMANAGER', 'dummy.jpg', '', '', 'kom', 0),
	(277, 2427, 'P', 'SOLARWATT', 'SREDISNJA STEZALJKA', '3,0RH32-50D.TX40', 'dummy.jpg', '', '', 'kom', 0),
	(278, 2428, 'P', 'SOLARWATT', 'JEDNOSMER. MONOFAZ. MERAC', 'DRS115D', 'dummy.jpg', '', '', 'kom', 0),
	(279, 2429, 'P', 'SOLARWATT', 'SPOJNICA ZA SINE NOSACA PANELA', 'VS+RAILCONN.50X37', 'dummy.jpg', '', '', 'kom', 0),
	(280, 2430, 'P', 'SOLARWATT', 'SREDISNJA STEZALJKA', 'MIDDLE CLAMP+', 'dummy.jpg', '', '', 'kom', 0),
	(281, 2431, 'P', 'SOLARWATT', 'KRAJNJA STEZALJKA', 'END CLAMP+', 'dummy.jpg', '', '', 'kom', 0),
	(282, 2432, 'P', 'SOLARWATT', 'CEPOVI ZA SINE NOSACA PANELA', '50X37', 'dummy.jpg', '', '', 'kom', 0),
	(283, 2433, 'P', 'SOLARWATT', 'SINA NOSACA PANELA', '50X37X3300MM', 'dummy.jpg', '', '', 'kom', 0),
	(284, 2434, 'P', 'SOLARWATT', 'NOSAC PANELA ZA KROV SA CREPOM', '-', 'dummy.jpg', '', '', 'kom', 0),
	(285, 2441, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ25P', 'dummy.jpg', '', '', 'kom', 0),
	(286, 2485, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ15P', 'dummy.jpg', '', '', 'kom', 0),
	(287, 2486, 'P', 'DAIKIN', 'FAN COIL', 'FWL01DTV', 'dummy.jpg', '', '', 'kom', 0),
	(288, 2487, 'P', 'DAIKIN', 'FAN COIL', 'FWL02DTV', 'dummy.jpg', '', '', 'kom', 0),
	(289, 2488, 'P', 'DAIKIN', 'FAN COIL', 'FWL25DTV', 'dummy.jpg', '', '', 'kom', 0),
	(290, 2489, 'P', 'DAIKIN', 'FAN COIL', 'FWL03DTV', 'dummy.jpg', '', '', 'kom', 0),
	(291, 2490, 'P', 'DAIKIN', 'FAN COIL', 'FWL06DTV', 'dummy.jpg', '', '', 'kom', 0),
	(292, 2491, 'P', 'DAIKIN', 'PLAFONSKA UNUTRAŠNJA JEDINICA', 'FXSQ40A', 'dummy.jpg', '', '', 'kom', 0),
	(293, 2494, 'P', 'DAIKIN', 'PLAFONSKA UNUTRAŠNJA JEDINICA', 'FXMQ125P7', 'dummy.jpg', '', '', 'kom', 0),
	(294, 2556, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWP045KBW1NB', 'dummy.jpg', '', '', 'kom', 0),
	(295, 2580, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FWT05GT', 'dummy.jpg', '', '', 'kom', 0),
	(296, 2591, 'P', 'DAIKIN', 'FAN COIL', 'FWL04DTV', 'dummy.jpg', '', '', 'kom', 0),
	(297, 2592, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZASG100MY1', 'dummy.jpg', '', '', 'kom', 0),
	(298, 2602, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWWPO22KBW1N', 'dummy.jpg', '', '', 'kom', 0),
	(299, 2619, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZAS140MV1', 'dummy.jpg', '', '', 'kom', 0),
	(300, 2621, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FAA100A', 'dummy.jpg', '', '', 'kom', 0),
	(301, 2622, 'P', 'DAIKIN', 'FAN COIL', 'FWXV15ATV3', 'dummy.jpg', '', '', 'kom', 0),
	(302, 2623, 'P', 'DAIKIN', 'NOGICE ZA FAN COIL', 'EKFA', 'dummy.jpg', '', '', 'kom', 0),
	(303, 2624, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ8T8', 'dummy.jpg', '', '', 'kom', 0),
	(304, 2663, 'P', 'DAIKIN', 'TERMOSTAT', 'EKRTWA', 'dummy.jpg', '', '', 'kom', 0),
	(305, 2669, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ021BAWP-H', 'dummy.jpg', '', '', 'kom', 0),
	(306, 2670, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWYQ025BAWP-H', 'dummy.jpg', '', '', 'kom', 0),
	(307, 2686, 'P', 'DAIKIN', 'FAN COIL', 'FWXV20ABTV3', 'dummy.jpg', '', '', 'kom', 0),
	(308, 2687, 'P', 'DAIKIN', 'FAN COIL', 'FWXV10ABTV3', 'dummy.jpg', '', '', 'kom', 0),
	(309, 2694, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXDQ15A3', 'dummy.jpg', '', '', 'kom', 0),
	(310, 2721, 'P', 'DAIKIN', 'UGRADNI DODIRNI EKRAN', 'EKRTCTRL1', 'dummy.jpg', '', '', 'kom', 0),
	(311, 2756, 'P', 'SMA', 'SOLARNI INVERTOR', '1.5-1VL-40', 'dummy.jpg', '', '', 'kom', 0),
	(312, 2757, 'P', 'SMA', 'SOLARNI INVERTOR', '2.0-1VL-40', 'dummy.jpg', '', '', 'kom', 0),
	(313, 2758, 'P', 'SMA', 'SOLARNI INVERTOR', '3.0-1AV-41', 'dummy.jpg', '', '', 'kom', 0),
	(314, 2759, 'P', 'SMA', 'SOLARNI INVERTOR', '4.0-1AV-41', 'dummy.jpg', '', '', 'kom', 0),
	(315, 2760, 'P', 'SMA', 'SOLARNI INVERTOR', '5.0-3AV-40', 'dummy.jpg', '', '', 'kom', 0),
	(316, 2761, 'P', 'RENUSOL', 'SINA NOSACA ZA TRAPEZNI KROV', 'MS+', 'dummy.jpg', '', '', 'kom', 0),
	(317, 2762, 'P', 'RENUSOL', 'SOLARNI KABEL', '4MM2', 'dummy.jpg', '', '', 'kom', 0),
	(318, 2763, 'P', 'RENUSOL', 'SOLARNI KABEL', '6MM2', 'dummy.jpg', '', '', 'kom', 0),
	(319, 2764, 'P', 'SMA', 'SOLARNI INVERTOR', '5.0-1AV-41', 'dummy.jpg', '', '', 'kom', 0),
	(320, 2771, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RRLQ004CAV3+RHBX04CB3V', 'dummy.jpg', '', '', 'kom', 0),
	(321, 2775, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXF35D', 'dummy.jpg', '', '', 'kom', 0),
	(322, 2776, 'P', 'DAIKIN', 'WIFI KONTROLER', 'BRC7FA532F', 'dummy.jpg', '', '', 'kom', 0),
	(323, 2777, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EBBX16D9W', 'dummy.jpg', '', '', 'kom', 0),
	(324, 2778, 'P', 'DAIKIN', 'KOMUNIKACIONA KARTICA', 'EKRP1HBA', 'dummy.jpg', '', '', 'kom', 0),
	(325, 2783, 'P', 'DAIKIN', 'KLIMA KOMORA', 'ADN02ECV121765300', 'dummy.jpg', '', '', 'kom', 0),
	(326, 2784, 'P', 'DAIKIN', 'KLIMA KOMORA', 'ADN09ECD121820000', 'dummy.jpg', '', '', 'kom', 0),
	(327, 2787, 'P', 'LICON', 'PODNI KONVEKTOR', 'F2V-180/11/20-V1U1P0R-RT', 'dummy.jpg', '', '', 'kom', 0),
	(328, 2788, 'P', 'LICON', 'PODNI KONVEKTOR', 'F2V-200/11/20-V1U1P0R-RT', 'dummy.jpg', '', '', 'kom', 0),
	(329, 2789, 'P', 'LICON', 'PODNI KONVEKTOR', 'F2V-240/11/20-V1U1P0R-RT', 'dummy.jpg', '', '', 'kom', 0),
	(330, 2790, 'P', 'LICON', 'PODNI KONVEKTOR', 'F2V-240/11/20-V1U1L0R-RT', 'dummy.jpg', '', '', 'kom', 0),
	(331, 2791, 'P', 'LICON', 'RESETKA', 'PM-180/20-D040', 'dummy.jpg', '', '', 'kom', 0),
	(332, 2792, 'P', 'LICON', 'RESETKA', 'PM-200/20-D040', 'dummy.jpg', '', '', 'kom', 0),
	(333, 2793, 'P', 'LICON', 'RESETKA', 'PM-240/20-D040', 'dummy.jpg', '', '', 'kom', 0),
	(334, 2795, 'P', 'HIDROS', 'ODVLAZIVAC', '1.SDA.200A-2A', 'dummy.jpg', '', '', 'kom', 0),
	(335, 2796, 'P', 'DAIKIN', 'ZICANI KONTROLER', 'BRC1E53C', 'dummy.jpg', '', '', 'kom', 0),
	(336, 2797, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM35R', 'dummy.jpg', '', '', 'kom', 0),
	(337, 2798, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RZAG35A', 'dummy.jpg', '', '', 'kom', 0),
	(338, 2815, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERQ100AV1', 'dummy.jpg', '', '', 'kom', 0),
	(339, 2820, 'P', 'DAIKIN', 'MOTOR VENTILATORA', '61W 8P', 'dummy.jpg', '', '', 'kom', 0),
	(340, 2826, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXJ50AW', 'dummy.jpg', '', '', 'kom', 0),
	(341, 2827, 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'RXJ50A', 'dummy.jpg', '', '', 'kom', 0),
	(342, 2828, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWAQ016BAWPBH', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(343, 2829, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWAQ021BAWPBH', 'dummy.jpg', 'CHILLER', '', 'kom', 0),
	(344, 2830, 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ63A', 'dummy.jpg', '', '', 'kom', 0),
	(345, 2837, 'P', 'RENUSOL', 'KONEKTOR', 'MC4', 'dummy.jpg', '', '', 'kom', 0),
	(346, 2839, 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EWLP065KBW1N', 'dummy.jpg', '', '', 'kom', 0);

-- Dumping structure for table simaks_office.settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(256) NOT NULL,
  `address` varchar(256) NOT NULL,
  `city` varchar(64) NOT NULL,
  `zip` int(5) NOT NULL,
  `country` varchar(64) NOT NULL,
  `pib` int(9) NOT NULL,
  `mb` int(8) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `website` varchar(256) NOT NULL,
  `logo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.settings: ~1 rows (approximately)
INSERT INTO `settings` (`id`, `company`, `address`, `city`, `zip`, `country`, `pib`, `mb`, `phone`, `website`, `logo`) VALUES
	(1, 'Simaks d.o.o.', 'Pere Popadića 3', 'Novi Sad', 0, '', 108480120, 21008001, '+381 21 410800', 'https://www.nestiqdesign.com', '');

-- Dumping structure for table simaks_office.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` tinytext NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(32) NOT NULL,
  `last_name` varchar(32) NOT NULL,
  `email` varchar(128) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `is_logged` tinyint(4) NOT NULL DEFAULT 0,
  `company_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table simaks_office.users: ~1 rows (approximately)
INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `email`, `phone`, `is_logged`, `company_id`, `token`) VALUES
	(1, 'ivica', '$2y$10$zpr2JP9EKWKH6mMX7MK0y.mBGpsHPiQyI2KVw2my0cg1n4QO8ITlO', 'Ivica', 'Stašuk', 'stasuk.ivica@gmail.com', '+381 69 718229', 1, 1, 'c34af1e35de4a81da8d0aeea99d68fee');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
