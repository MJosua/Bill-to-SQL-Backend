-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2024 at 01:08 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `event_log`
--

CREATE TABLE `event_log` (
  `row_number` int(11) NOT NULL,
  `id_inventory` int(11) NOT NULL,
  `event_date` date NOT NULL,
  `panjang_awal` float NOT NULL,
  `panjang_sebelum` float NOT NULL,
  `Deskripsi` text NOT NULL,
  `id_status` int(11) NOT NULL,
  `panjang_sesudah` float NOT NULL,
  `Filter` varchar(24) NOT NULL,
  `nama_awal` varchar(50) NOT NULL,
  `nama_sebelum` varchar(50) NOT NULL,
  `nama_sesudah` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_log`
--

INSERT INTO `event_log` (`row_number`, `id_inventory`, `event_date`, `panjang_awal`, `panjang_sebelum`, `Deskripsi`, `id_status`, `panjang_sesudah`, `Filter`, `nama_awal`, `nama_sebelum`, `nama_sesudah`) VALUES
(1, 32, '2024-05-16', 0, 0, '0', 1, 0, '', '', '', ''),
(2, 33, '2024-05-16', 0, 0, '0', 1, 0, '', '', '', ''),
(3, 34, '2024-05-16', 0, 0, 'Pembuatan Master_data test123', 1, 0, '', '', '', ''),
(4, 35, '2024-05-16', 0, 0, 'Pembuatan Master_data teset', 1, 0, '', '', '', ''),
(5, 38, '2024-05-16', 0, 0, 'Pembuatan Master_data 2', 1, 0, 'Master Data', '', '', ''),
(6, 39, '2024-05-16', 0, 0, 'Pembuatan Master_data PVC-PB', 1, 0, 'Master Data', '', '', ''),
(7, 39, '2024-05-17', 0, 0, 'Update Master_data PVC-PB', 2, 0, 'Master Data', '', '', ''),
(8, 39, '2024-05-17', 0, 0, 'Update Master_data PVC-PB3', 2, 0, 'Master Data', '', '', ''),
(9, 39, '2024-05-17', 0, 0, 'Update Master_data PVC-PB', 2, 0, 'Master Data', '', '', ''),
(10, 40, '2024-05-17', 0, 0, 'Pembuatan Master_data test', 1, 0, 'Master Data', '', '', ''),
(11, 41, '2024-05-17', 0, 0, 'Pembuatan Master_data 2', 1, 0, 'Master Data', '', '', ''),
(12, 42, '2024-05-17', 0, 0, 'Pembuatan Master_data 2', 1, 0, 'Master Data', '', '', ''),
(13, 42, '2024-05-17', 0, 0, 'x', 2, 0, 'Master Data', '', '', ''),
(14, 14, '2024-05-17', 0, 0, 'Creation of Category with ID 14 and Name undefined', 1, 0, 'Category', '', '', ''),
(15, 13, '2024-05-17', 0, 0, 'Creation of Category with ID 13 and Name undefined', 1, 0, 'Category', '', '', ''),
(16, 14, '2024-05-17', 0, 0, 'Deletion of Category with ID 14 and Name 2', 1, 0, 'Category', '', '', ''),
(17, 43, '2024-05-17', 0, 0, 'Pembuatan Master_data test', 1, 0, 'Master Data', '', '', ''),
(18, 43, '2024-05-17', 0, 0, 'Update Master_data test3', 3, 0, 'Master Data', '', '', ''),
(19, 45, '2024-05-17', 2.5, 0, 'Pembuatan Master_data w', 1, 0, 'Master Data', 'w', '', ''),
(20, 43, '2024-05-20', 0, 0, 'Update Master_data test3', 3, 0, 'Master Data', '', '', ''),
(21, 15, '2024-05-20', 0, 0, 'Creation of Category with ID 15 and Name undefined', 1, 0, 'Category', '', '', ''),
(22, 46, '2024-05-20', 2, 0, 'Pembuatan Master_data 2', 1, 0, 'Master Data', '2', '', ''),
(24, 47, '2024-05-20', 2, 0, 'Pembuatan Master_data test123', 1, 0, 'Master Data', 'test123', '', ''),
(25, 16, '2024-05-20', 0, 0, 'Creation of Category with ID 16 and Name undefined', 1, 0, 'Category', '', '', ''),
(26, 16, '2024-05-20', 0, 0, 'Deletion of Category with ID 16 and Name teset321', 2, 0, 'Category', '', '', ''),
(27, 47, '2024-05-20', 0, 0, 'Deletion of Master_data with ID 47', 2, 0, 'Master Data', '', '', ''),
(28, 11, '2024-05-20', 0, 0, 'Update of Category with ID 11 and Name Pipa Besi22', 3, 0, 'Category', '', '', ''),
(29, 43, '2024-05-20', 0, 0, 'Update Master_data test32', 3, 0, 'Master Data', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `master_category`
--

CREATE TABLE `master_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(40) NOT NULL,
  `category_desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_category`
--

INSERT INTO `master_category` (`category_id`, `category_name`, `category_desc`) VALUES
(11, 'Pipa Besi22', 'Pipa Besi2');

-- --------------------------------------------------------

--
-- Table structure for table `master_data`
--

CREATE TABLE `master_data` (
  `panjang` float NOT NULL,
  `diameter` double NOT NULL,
  `id_product` int(11) NOT NULL,
  `nama_produk` text NOT NULL,
  `category` varchar(24) NOT NULL DEFAULT 'Unasigned'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_data`
--

INSERT INTO `master_data` (`panjang`, `diameter`, `id_product`, `nama_produk`, `category`) VALUES
(2, 2, 34, 'test123', 'Test'),
(22, 2, 43, 'test32', '11'),
(2.5, 2.3, 45, 'w', '11');

-- --------------------------------------------------------

--
-- Table structure for table `master_inventory`
--

CREATE TABLE `master_inventory` (
  `id_inventory` int(11) NOT NULL,
  `panjang_product` int(11) NOT NULL,
  `diameter_product` int(11) NOT NULL,
  `mnf_date` int(11) NOT NULL,
  `disposal_date` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `id_product` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_status`
--

CREATE TABLE `master_status` (
  `status_name` text NOT NULL,
  `status_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_status`
--

INSERT INTO `master_status` (`status_name`, `status_id`) VALUES
('Insert', 1),
('Delete', 2),
('Update', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event_log`
--
ALTER TABLE `event_log`
  ADD PRIMARY KEY (`row_number`);

--
-- Indexes for table `master_category`
--
ALTER TABLE `master_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `master_data`
--
ALTER TABLE `master_data`
  ADD PRIMARY KEY (`id_product`);

--
-- Indexes for table `master_status`
--
ALTER TABLE `master_status`
  ADD PRIMARY KEY (`status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `event_log`
--
ALTER TABLE `event_log`
  MODIFY `row_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `master_category`
--
ALTER TABLE `master_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `master_data`
--
ALTER TABLE `master_data`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `master_status`
--
ALTER TABLE `master_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
