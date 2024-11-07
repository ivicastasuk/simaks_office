-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.1.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table simaks_office.numbers
DROP TABLE IF EXISTS `numbers`;
CREATE TABLE IF NOT EXISTS `numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

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
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

-- Dumping structure for table simaks_office.offer_items
DROP TABLE IF EXISTS `offer_items`;
CREATE TABLE IF NOT EXISTS `offer_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `offer_id` int(11) NOT NULL,
  `code` varchar(100) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'dummy.jpg',
  `unit` varchar(50) DEFAULT NULL,
  `quantity` float NOT NULL DEFAULT 1,
  `price` decimal(15,2) NOT NULL,
  `discount` float DEFAULT 0,
  `price_with_discount` decimal(15,2) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `vat_percent` decimal(5,2) DEFAULT 20.00,
  `vat_amount` decimal(15,2) NOT NULL,
  `total` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `offer_id` (`offer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

-- Dumping structure for table simaks_office.offer_numbers
DROP TABLE IF EXISTS `offer_numbers`;
CREATE TABLE IF NOT EXISTS `offer_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `godina` int(11) NOT NULL,
  `broj` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

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
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
