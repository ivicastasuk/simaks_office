-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 14, 2024 at 11:46 AM
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `address`, `city`, `pib`, `mb`) VALUES
(1, 'Simaks doo', 'Pere Popadića 3', 'Novi Sad', 108480120, 21008001),
(2, 'LirideNET', 'Industrijska 1A', 'Novi Sad', 100200300, 10200500),
(3, 'Clima Tech Design', 'Trg Marije Trandafil 7', 'Novi Sad', 111194577, 21439819);

-- --------------------------------------------------------

--
-- Table structure for table `numbers`
--

DROP TABLE IF EXISTS `numbers`;
CREATE TABLE IF NOT EXISTS `numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `type` tinytext NOT NULL DEFAULT 'P',
  `manufacturer` varchar(255) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `model` varchar(32) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT 'dummy.jpg',
  `description` varchar(512) DEFAULT NULL,
  `items` varchar(2048) DEFAULT NULL,
  `unit` varchar(8) NOT NULL DEFAULT 'kom',
  `price` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `NAME` (`name`) USING BTREE,
  KEY `MODEL` (`model`),
  KEY `MANUFACTURER` (`manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `code`, `type`, `manufacturer`, `name`, `model`, `img_url`, `description`, `items`, `unit`, `price`) VALUES
(1, '0001', 'P', 'Daikin', 'Toplotna pumpa', 'EWGA16QW02', 'ar-0001.jpg', 'Toplotna pumpa izmisljenog naziva modela', '', 'kom', 3270),
(2, '0002', 'P', 'Daikin', 'Toplotna pumpa', 'EWGA11QW04', 'dummy.jpg', 'Jos jedna izmisljena toplotna pumpa', NULL, 'kom', 5670),
(3, '0003', 'P', 'Daikin', 'Multi-split', '3MXS40K3V1B2', 'dummy.jpg', 'Multi klima cija kutija mi je ispred nosa pa mogu da vidim oznaku', NULL, 'kom', 1450),
(4, '0004', 'P', 'Solarwatt', 'Solarni panel', '60M COnstruct', 'dummy.jpg', 'Solarni panel', NULL, 'kom', 150),
(5, '0005', 'P', 'Solarwatt', 'Solarni panel', '60M Style', 'sever.png', 'Solarni panel', NULL, 'kom', 160),
(6, '0006', 'P', 'Simaks DOO', 'Solarna auto-punionica', 'SMKS-01', 'is.png', 'Solarna auto punionica', NULL, 'kom', 5680),
(7, '0007', 'P', 'Simaks DOO', 'Auto punjac', 'SMKS-02', 'is.png', 'Auto punjac', NULL, 'kom', 890),
(9, '0008', 'P', 'Daikin', 'Spoljasnja jedinica', 'RXC35D', 'nest-energy-t.png', 'Spoljasnja jedinica za klima uredjaj 12000BTU', NULL, 'kom', 600),
(10, '0009', 'P', 'Daikin', 'Spoljasnja jedinica', 'RXC50D', 'nest-energy-t.png', 'Spoljasnja jedinica za klima uredja BTU18000', NULL, 'kom', 950),
(11, '0010', 'P', 'TommaTech', 'Solarni panel 455Wp', 'HC455W', '66fe520f1dd4d.png', 'Solarni panel snage 455W', NULL, 'kom', 110.45),
(12, '0011', 'P', 'Daikin', 'Racva', 'KHRQ22M64T8', 'dummy.jpg', 'Racva', NULL, 'kom', 50);

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
(1, 'ivica', '$2y$10$zpr2JP9EKWKH6mMX7MK0y.mBGpsHPiQyI2KVw2my0cg1n4QO8ITlO', 'Ivica', 'Stašuk', 'stasuk.ivica@gmail.com', '+381 69 718229', 1, 1, '1f138757d811bb9b0cfe26b6458fa79a');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
