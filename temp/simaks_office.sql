-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Apr 29, 2024 at 12:42 PM
-- Server version: 11.2.2-MariaDB
-- PHP Version: 7.4.33

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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(32) DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 0,
  `manufacturer` varchar(255) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `model` varchar(32) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT 'dummy.jpg',
  `description` varchar(512) DEFAULT NULL,
  `items` varchar(2048) DEFAULT NULL,
  `unit` varchar(8) NOT NULL DEFAULT 'kom',
  `price` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `NAME` (`name`) USING BTREE,
  KEY `MODEL` (`model`),
  KEY `MANUFACTURER` (`manufacturer`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `code`, `type`, `manufacturer`, `name`, `model`, `img_url`, `description`, `items`, `unit`, `price`) VALUES
(1, '0001', 0, NULL, 'Toplotna pumpa', 'EWGA16QW02', 'ar-0001.jpg', 'Toplotna pumpa izmisljenog naziva modela', '', 'kom', 3270);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` tinytext NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_logged` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `is_logged`) VALUES
(1, 'ivica', 'budisava', 0),
(2, 'simaks', 'simaks123', 0),
(3, 'simaks', 'simaks123', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
