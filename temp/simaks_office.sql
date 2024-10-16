-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 16, 2024 at 12:53 PM
-- Server version: 11.2.2-MariaDB
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `simaks_office`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_accounts`
--

DROP TABLE IF EXISTS `bank_accounts`;
CREATE TABLE IF NOT EXISTS `bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank` varchar(256) NOT NULL,
  `number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `bank_accounts`
--

INSERT INTO `bank_accounts` (`id`, `bank`, `number`) VALUES
(1, 'Banca Intesa', '160-6000001231950-93'),
(2, 'Komercijalna banka A.D.', '205-0000000206663-26');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

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

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `address`, `city`, `pib`, `mb`) VALUES
(1, 'Simaks doo', 'Pere Popadića 3', 'Novi Sad', 108480120, 21008001),
(3, 'Clima Tech Design', 'Trg Marije Trandafil 7', 'Novi Sad', 111194577, 21439819),
(4, 'LiRideNET', 'Industrijska 1a', 'Novi Sad', 100200300, 20300400),
(5, 'SMGS d.o.o.', 'Gavrila Principa 11', 'Novi Sad', 106423176, 20598913),
(6, 'Climate Design doo', 'Borska 5', 'Beograd', 109859633, 21256021);

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

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

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `offer_number`, `offer_year`, `client_name`, `client_address`, `client_city`, `client_pib`, `client_mb`, `date_created`, `user_id`, `total_amount`, `total_vat`, `total_with_vat`, `notes`, `status`) VALUES
(1, 12, 2024, 'Clima Tech Design', 'Trg Marije Trandafil 7', 'Novi Sad', '111194577', '21439819', '2024-10-15 10:50:16', NULL, 3270.00, 654.00, 3924.00, NULL, 'pending'),
(2, 13, 2024, 'Simaks doo', 'Pere Popadića 3', 'Novi Sad', '108480120', '21008001', '2024-10-15 10:52:17', NULL, 11045.00, 2209.00, 13254.00, NULL, 'pending'),
(3, 14, 2024, 'LiRideNET', 'Industrijska 1a', 'Novi Sad', '100200300', '20300400', '2024-10-15 13:22:00', NULL, 110.45, 22.09, 132.54, NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `offer_items`
--

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

--
-- Dumping data for table `offer_items`
--

INSERT INTO `offer_items` (`id`, `offer_id`, `code`, `description`, `unit`, `quantity`, `price`, `discount`, `price_with_discount`, `amount`, `vat_percent`, `vat_amount`, `total`) VALUES
(1, 1, '0001', 'Daikin Toplotna pumpa EWGA16QW02Toplotna pumpa izmisljenog naziva modela', 'kom', 1.00, 3270.00, 0.00, 3270.00, 3270.00, 20.00, 654.00, 3924.00),
(2, 2, '0010', 'TommaTech Solarni panel 455Wp HC455WSolarni panel snage 455W', 'kom', 100.00, 110.45, 0.00, 110.45, 11045.00, 20.00, 2209.00, 13254.00),
(3, 3, '0010', 'TommaTech Solarni panel 455Wp HC455WSolarni panel snage 455W', 'kom', 1.00, 110.45, 0.00, 110.45, 110.45, 20.00, 22.09, 132.54);

-- --------------------------------------------------------

--
-- Table structure for table `offer_numbers`
--

DROP TABLE IF EXISTS `offer_numbers`;
CREATE TABLE IF NOT EXISTS `offer_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `godina` int(11) NOT NULL,
  `broj` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `offer_numbers`
--

INSERT INTO `offer_numbers` (`id`, `godina`, `broj`) VALUES
(2, 2024, 14);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT '',
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
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `code`, `type`, `manufacturer`, `name`, `model`, `img_url`, `description`, `items`, `unit`, `price`) VALUES
(1, '208', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA ', 'ABQ125C', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
(2, '212', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'ABQ140C', 'dummy.jpg', 'PODPLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
(3, '213', 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZQS140BY1', 'dummy.jpg', '', '', 'kom', 0),
(4, '216', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTX35J3', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
(5, '312', 'P', 'DAIKIN', 'FAN COIL', 'FWF02BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 0),
(6, '314', 'P', 'DAIKIN', 'PRIPADAJUĆA TACNA ZA KONDENZAT ZA FC', 'EDPVB6', 'dummy.jpg', '', '', 'kom', 0),
(7, '315', 'P', 'DAIKIN', 'FAN COIL', 'FWV04DTN', 'dummy.jpg', 'PARAPETNI FAN COIL', '', 'kom', 0),
(8, '317', 'P', 'DAIKIN', 'KONTROLER ', 'FWEC1A', 'dummy.jpg', 'KONTROLER ZA FAN COIL', '', 'kom', 6682.84),
(9, '320', 'P', 'DAIKIN', 'FAN COIL', 'FWF02BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 41704.16),
(10, '322', 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYFQ60B3', 'dummy.jpg', '', '', 'kom', 20845.2),
(11, '323', 'P', 'DAIKIN', 'KONTROLER', 'BRC315D', 'dummy.jpg', '', '', 'kom', 8969.76),
(12, '324', 'P', 'DAIKIN', 'TROKRAKI VENTIL', 'EKMV3C09B', 'dummy.jpg', '', '', 'kom', 8401.44),
(13, '330', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ8TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 392478.54),
(14, '376', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXMQ200MB', 'dummy.jpg', 'PLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 168553.25),
(15, '377', 'P', 'DAIKIN', 'KONTROLER', 'BRC1D52', 'dummy.jpg', '', '', 'kom', 6575.44),
(16, '392', 'P', 'DAIKIN', 'FAN COIL', 'FWF02CT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 33493.13),
(17, '394', 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'DCP600TC', 'dummy.jpg', '', '', 'kom', 14018.86),
(18, '547', 'P', 'DAIKIN', 'KONTROLER', 'WRC-HPC', 'dummy.jpg', '', '', 'kom', 2176.16),
(19, '553', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ40A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 68928.44),
(20, '554', 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M20T', 'dummy.jpg', '', '', 'kom', 6884.11),
(21, '555', 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M29T9', 'dummy.jpg', '', '', 'kom', 8726.08),
(22, '556', 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M64T', 'dummy.jpg', '', '', 'kom', 8268.36),
(23, '559', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ32P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 70116.96),
(24, '566', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ18T', 'dummy.jpg', '', '', 'kom', 738975.2),
(25, '570', 'P', 'SMGS', 'SAMOPADAJUĆA ŽALUZINA ', 'GR 300X300', 'dummy.jpg', '', '', 'kom', 820.95),
(26, '573', 'P', 'SMGS', 'VENTILATOR', '100S', 'dummy.jpg', '', '', 'kom', 1600),
(27, '603', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ12TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 472001.63),
(28, '604', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ20P', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 34034.4),
(29, '605', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ32P', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 37555.2),
(30, '606', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXHQ32A', 'dummy.jpg', 'PLAFONSKA UNUTRAŠNJA JEDINICA', '', 'kom', 93995.35),
(31, '614', 'P', 'DAIKIN', 'KONTROLER', 'BRC4C65', 'dummy.jpg', '', '', 'kom', 9677.66),
(32, '617', 'P', 'DAIKIN', 'KONTROLER', 'BRC1E53B', 'dummy.jpg', '', '', 'kom', 10528.21),
(33, '669', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ016CW1', 'dummy.jpg', '', '', 'kom', 349872.86),
(34, '670', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX16CB9W', 'dummy.jpg', '', '', 'kom', 245783.53),
(35, '671', 'P', 'DAIKIN', 'KADICA ZA KONDENZAT', 'EKHBDPC2', 'dummy.jpg', '', '', 'kom', 14874.69),
(36, '672', 'P', 'DAIKIN', 'KONTROLER', 'EKRUCBL1', 'dummy.jpg', '', '', 'kom', 9027.75),
(37, '686', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ63A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 70500.74),
(38, '706', 'P', 'DAIKIN', 'KONTROLER', 'FWEC2A', 'dummy.jpg', '', '', 'kom', 10063.86),
(39, '713', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ20A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 60154.76),
(40, '714', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ25A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 63607.36),
(41, '716', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ32A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 62422.45),
(42, '717', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ50A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 71012.58),
(43, '718', 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYFQ60CW', 'dummy.jpg', '', '', 'kom', 10270.25),
(44, '719', 'P', 'DAIKIN', 'KONTROLER', 'BRC1E53A', 'dummy.jpg', '', '', 'kom', 10326.23),
(45, '731', 'P', 'DAIKIN', 'REGULATOR', 'EKRUCBL6', 'dummy.jpg', '', '', 'kom', 13691.39),
(46, '732', 'P', 'DAIKIN', 'TROKRAKI VENTIL', 'EUMBPART', 'dummy.jpg', '', '', 'kom', 16361.98),
(47, '733', 'P', 'DAIKIN', 'FAN COIL', 'FWM04DTN', 'dummy.jpg', 'KANALSKA UNUTRA[NJA JEDINICA', '', 'kom', 22202.53),
(48, '817', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FBA140A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 104410.12),
(49, '818', 'P', 'DAIKIN', 'SPOLJAŠNJA JEDINICA', 'AZAS140MY1', 'dummy.jpg', '', '', 'kom', 130627.95),
(50, '830', 'P', 'DAIKIN', 'RAZVODNI BOX', 'BS1Q10A', 'dummy.jpg', '', '', 'kom', 33509.82),
(51, '835', 'P', 'DAIKIN', 'RAČVA', 'KHRQ23M64T', 'dummy.jpg', '', '', 'kom', 21245.83),
(52, '842', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FDXM35F3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 45717.07),
(53, '846', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXSQ50A', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 68932.34),
(54, '854', 'P', 'DAIKIN', 'TERMOSTAT ZA FAN COIL', 'YFSTA6', 'dummy.jpg', '', '', 'kom', 1176.38),
(55, '856', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHBX11CB9W', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA TOPLOTNE PUMPE', '', 'kom', 208802.31),
(56, '857', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'ERLQ011CW1', 'dummy.jpg', '', '', 'kom', 209280.88),
(57, '884', 'P', 'DAIKIN', 'FAN COIL', 'FWZ02ATN', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 33044.8),
(58, '885', 'P', 'DAIKIN', 'KONTROLER', 'FWEC3A', 'dummy.jpg', '', '', 'kom', 13516.29),
(59, '886', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ25A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 44226.19),
(60, '887', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ32A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 47112.83),
(61, '888', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXZQ25A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 56049.16),
(62, '889', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXAQ20A', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 47600),
(63, '892', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYSQ10TY1', 'dummy.jpg', 'TOPLOTNA PUMPA VAZDUH-VAZDUH', '', 'kom', 445472.15),
(64, '908', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'EHVX16S26CB9W', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA SA REZERVOAROM OD 260L', '', 'kom', 349405.08),
(65, '909', 'P', 'DAIKIN', 'TOPLOTNA PUMPA ', 'ERLQ14CW1', 'dummy.jpg', '	', '', 'kom', 281161.34),
(66, '910', 'P', 'DAIKIN', 'FAN COIL', 'FFA25A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 57954.55),
(67, '911', 'P', 'DAIKIN', 'FAN COIL', 'FFA35A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 48531.61),
(68, '923', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'SEHVX32BW', 'dummy.jpg', 'UNUTRAŠNJA JEDINICA TOPLOTNE PUMPE', '', 'kom', 349263.71),
(69, '924', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'SERHQ032BW1', 'dummy.jpg', '', '', 'kom', 624382.43),
(70, '92', 'P', 'DAIKIN', 'FAN COIL', 'FWF05BT', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 49175.3),
(71, '933', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FTXM35M', 'dummy.jpg', 'ZIDNA UNUTRAŠNJA JEDINICA', '', 'kom', 34675.45),
(72, '942', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ12T', 'dummy.jpg', '', '', 'kom', 635679.44),
(73, '943', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'RXYQ10T', 'dummy.jpg', '', '', 'kom', 529621),
(74, '944', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ40P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 83492.06),
(75, '945', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXLQ50P', 'dummy.jpg', 'PARAPETNA UNUTRAŠNJA JEDINICA', '', 'kom', 69429.5),
(76, '946', 'P', 'DAIKIN', 'RAČVA', 'BHFQ22P1007', 'dummy.jpg', '', '', 'kom', 9311.43),
(77, '947', 'P', 'DAIKIN', 'RAČVA', 'KHRQ22M75T', 'dummy.jpg', '', '', 'kom', 13050.78),
(78, '945', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXDQ32A3', 'dummy.jpg', 'KANALSKA UNUTRAŠNJA JEDINICA', '', 'kom', 51697.08),
(79, '959', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FCAG140A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 135148.19),
(80, '960', 'P', 'DAIKIN', 'DEKORATIVNI PANEL', 'BYCQ140D', 'dummy.jpg', '', '', 'kom', 16230.65),
(81, '1048', 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-93', 'dummy.jpg', '3000 M3/H', '', 'kom', 0),
(82, '1049', 'P', 'ACS CLIMA', 'REKUPERATOR', 'AHRVT-102', 'dummy.jpg', '4000 M3/H', '', 'kom', 0),
(83, '1071', 'P', 'DAIKIN', 'UNUTRAŠNJA JEDINICA', 'FXFQ32A', 'dummy.jpg', 'KASETNA UNUTRAŠNJA JEDINICA', '', 'kom', 59719.2),
(84, '1084', 'P', 'DAIKIN', 'CENTRALNI KONTROLER', 'DCC601A51', 'dummy.jpg', '', '', 'kom', 59712.53),
(85, '1096', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EBLQ07CV3', 'dummy.jpg', '', '', 'kom', 278739.74),
(86, '1097', 'P', 'DAIKIN', 'TOPLOTNA PUMPA', 'EBLQ011C3W1', 'dummy.jpg', '', '', 'kom', 357440.91);

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

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

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `company`, `address`, `city`, `zip`, `country`, `pib`, `mb`, `phone`, `website`, `logo`) VALUES
(1, 'Simaks d.o.o.', 'Pere Popadića 3', 'Novi Sad', 0, '', 108480120, 21008001, '+381 21 410800', 'https://www.nestiqdesign.com', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `first_name`, `last_name`, `email`, `phone`, `is_logged`, `company_id`, `token`) VALUES
(1, 'ivica', '$2y$10$zpr2JP9EKWKH6mMX7MK0y.mBGpsHPiQyI2KVw2my0cg1n4QO8ITlO', 'Ivica', 'Stašuk', 'stasuk.ivica@gmail.com', '+381 69 718229', 1, 1, '1108b753e872a00056a9ba576b39c270');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
