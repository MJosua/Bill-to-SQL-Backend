-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2024 at 11:19 AM
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
(29, 43, '2024-05-20', 0, 0, 'Update Master_data test32', 3, 0, 'Master Data', '', '', ''),
(30, 1, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 1 and Name test', 1, 0, 'Lokasi', '', '', ''),
(31, 2, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 2 and Name test', 1, 0, 'Lokasi', '', '', ''),
(32, 3, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 3 and Name test', 1, 0, 'Lokasi', '', '', ''),
(33, 4, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 4 and Name test3', 1, 0, 'Lokasi', '', '', ''),
(34, 5, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 5 and Name test3cv', 1, 0, 'Lokasi', '', '', ''),
(35, 6, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 6 and Name test3cv4', 1, 0, 'Lokasi', '', '', ''),
(36, 7, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 7 and Name v', 1, 0, 'Lokasi', '', '', ''),
(37, 8, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 8 and Name vv', 1, 0, 'Lokasi', '', '', ''),
(38, 9, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 9 and Name vvv', 1, 0, 'Lokasi', '', '', ''),
(39, 10, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 10 and Name vvv', 1, 0, 'Lokasi', '', '', ''),
(40, 11, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 11 and Name c', 1, 0, 'Lokasi', '', '', ''),
(41, 12, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 12 and Name cv', 1, 0, 'Lokasi', '', '', ''),
(42, 11, '2024-05-24', 0, 0, 'Deletion of Category with ID 11 and Name c', 2, 0, 'Category Lokasi', '', '', ''),
(43, 13, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 13 and Name c', 1, 0, 'Category Lokasi', '', '', ''),
(44, 13, '2024-05-24', 0, 0, 'Deletion of Category with ID 13 and Name c', 2, 0, 'Category Lokasi', '', '', ''),
(45, 14, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 14 and Name cv', 1, 0, 'Category Lokasi', '', '', ''),
(46, 14, '2024-05-24', 0, 0, 'Deletion of Category with ID 14 and Name cv', 2, 0, 'Category Lokasi', '', '', ''),
(47, 15, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 15 and Name cac', 1, 0, 'Category Lokasi', '', '', ''),
(48, 15, '2024-05-24', 0, 0, 'Deletion of Category with ID 15 and Name cac', 2, 0, 'Category Lokasi', '', '', ''),
(49, 16, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 16 and Name 3', 1, 0, 'Category Lokasi', '', '', ''),
(50, 16, '2024-05-24', 0, 0, 'Deletion of Category with ID 16 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(51, 17, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 17 and Name 3', 1, 0, 'Category Lokasi', '', '', ''),
(52, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(53, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(54, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(55, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(56, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(57, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(58, 17, '2024-05-24', 0, 0, 'Deletion of Category with ID 17 and Name 3', 2, 0, 'Category Lokasi', '', '', ''),
(59, 18, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 18 and Name c', 1, 0, 'Category Lokasi', '', '', ''),
(60, 18, '2024-05-24', 0, 0, 'Deletion of Category with ID 18 and Name c', 2, 0, 'Category Lokasi', '', '', ''),
(61, 19, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 19 and Name g', 1, 0, 'Category Lokasi', '', '', ''),
(62, 17, '2024-05-24', 0, 0, 'Creation of Category with ID 17 and Name undefined', 1, 0, 'Category', '', '', ''),
(63, 20, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 20 and Name g', 1, 0, 'Category Lokasi', '', '', ''),
(64, 21, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 21 and Name s', 1, 0, 'Category Lokasi', '', '', ''),
(65, 21, '2024-05-24', 0, 0, 'Deletion of Category with ID 21 and Name s', 2, 0, 'Category Lokasi', '', '', ''),
(66, 20, '2024-05-24', 0, 0, 'Deletion of Category with ID 20 and Name g', 2, 0, 'Category Lokasi', '', '', ''),
(67, 22, '2024-05-24', 0, 0, 'Creation of Lokasi with ID 22 and Name v', 1, 0, 'Category Lokasi', '', '', ''),
(68, 22, '2024-05-24', 0, 0, 'Deletion of Category with ID 22 and Name v', 2, 0, 'Category Lokasi', '', '', ''),
(69, 19, '2024-05-27', 0, 0, 'Deletion of Category with ID 19 and Name g', 2, 0, 'Category Lokasi', '', '', ''),
(70, 23, '2024-05-27', 0, 0, 'Creation of Lokasi with ID 23 and Name test', 1, 0, 'Category Lokasi', '', '', ''),
(71, 11, '2024-05-27', 0, 0, 'Update of Category with ID 11 and Name Pipa Besi22', 3, 0, 'Category', '', '', ''),
(72, 11, '2024-05-27', 0, 0, 'Update of Category with ID 11 and Name Pipa Besi22', 3, 0, 'Category', '', '', ''),
(73, 11, '2024-05-27', 0, 0, 'Update of Category with ID 11 and Name Pipa Besi22', 3, 0, 'Category', '', '', ''),
(74, 17, '2024-05-27', 0, 0, 'Update of Category with ID 17 and Name Pipa Besi223', 3, 0, 'Category', '', '', ''),
(75, 23, '2024-05-27', 0, 0, 'Update of Category with ID 23 and Name test', 3, 0, 'Category Lokasi', '', '', ''),
(76, 23, '2024-05-27', 0, 0, 'Update of Category with ID 23 and Name testf', 3, 0, 'Category Lokasi', '', '', ''),
(77, 48, '2024-05-27', 0, 0, 'Pembuatan Master_data tests', 1, 0, 'Master Data', 'tests', '', ''),
(78, 2, '2024-05-27', 0, 0, 'Pembuatan Master_data test', 1, 0, 'Master Lokasi', '', '', ''),
(79, 3, '2024-05-27', 0, 0, 'Pembuatan Master_data v', 1, 0, 'Master Lokasi', '', '', ''),
(80, 3, '2024-05-27', 0, 0, 'Update Master_lokasi vc', 3, 0, 'Data Lokasi', '', '', ''),
(81, 3, '2024-05-27', 0, 0, 'Update Master_lokasi vc', 3, 0, 'Data Lokasi', '', '', ''),
(82, 2, '2024-05-27', 0, 0, 'Update Master_lokasi testccc', 3, 0, 'Data Lokasi', '', '', ''),
(83, 4, '2024-05-27', 0, 0, 'Pembuatan Master_data v', 1, 0, 'Master Lokasi', '', '', ''),
(84, 4, '2024-05-27', 0, 0, 'Update Master_lokasi vc', 3, 0, 'Data Lokasi', '', '', ''),
(85, 3, '2024-05-27', 0, 0, 'Deletion of Master_data with ID 3', 2, 0, 'Master Lokasi', '', '', ''),
(86, 4, '2024-05-27', 0, 0, 'Deletion of Master_data with ID 4', 2, 0, 'Master Lokasi', '', '', ''),
(87, 11, '2024-05-27', 0, 0, 'Update of Category with ID 11 and Name PVB', 3, 0, 'Category', '', '', ''),
(88, 17, '2024-05-27', 0, 0, 'Deletion of Category with ID 17 and Name Pipa Besi223', 2, 0, 'Category', '', '', ''),
(89, 45, '2024-05-27', 0, 0, 'Deletion of Master_data with ID 45', 2, 0, 'Master Data', '', '', ''),
(90, 43, '2024-05-27', 0, 0, 'Update Master_data ZENBOOK', 3, 0, 'Master Data', '', '', ''),
(91, 2, '2024-05-27', 0, 0, 'Update Master_lokasi test', 3, 0, 'Data Lokasi', '', '', ''),
(92, 43, '2024-05-27', 0, 0, 'Update Master_data ZENBOOK', 3, 0, 'Master Data', '', '', '');

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
(11, 'PVB', 'Pipa Besi');

-- --------------------------------------------------------

--
-- Table structure for table `master_data`
--

CREATE TABLE `master_data` (
  `panjang` float NOT NULL,
  `diameter` double NOT NULL,
  `id_product` int(11) NOT NULL,
  `nama_produk` text NOT NULL,
  `category` varchar(24) NOT NULL DEFAULT 'Unasigned',
  `lokasi_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_data`
--

INSERT INTO `master_data` (`panjang`, `diameter`, `id_product`, `nama_produk`, `category`, `lokasi_id`) VALUES
(2, 2, 34, 'test123', 'Test', 2),
(22, 2, 43, 'ZENBOOK', '11', 2),
(0, 0, 48, 'tests', '23', 2);

-- --------------------------------------------------------

--
-- Table structure for table `master_inventory`
--

CREATE TABLE `master_inventory` (
  `panjang_product` int(11) NOT NULL,
  `diameter_product` int(11) NOT NULL,
  `mnf_date` date NOT NULL,
  `disposal_date` date NOT NULL,
  `active` tinyint(1) NOT NULL,
  `id_product` int(11) NOT NULL,
  `no` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_lokasi`
--

CREATE TABLE `master_lokasi` (
  `lokasi_id` int(12) NOT NULL,
  `lokasi_name` varchar(44) NOT NULL,
  `lokasi_desc` text NOT NULL,
  `alamat_lokasi` text NOT NULL,
  `kategori_lokasi` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_lokasi`
--

INSERT INTO `master_lokasi` (`lokasi_id`, `lokasi_name`, `lokasi_desc`, `alamat_lokasi`, `kategori_lokasi`) VALUES
(2, 'test', '123', '123', 23);

-- --------------------------------------------------------

--
-- Table structure for table `master_lokasi_kategori`
--

CREATE TABLE `master_lokasi_kategori` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(12) NOT NULL,
  `category_desc` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_lokasi_kategori`
--

INSERT INTO `master_lokasi_kategori` (`category_id`, `category_name`, `category_desc`) VALUES
(23, 'testf', 'testc');

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
-- Indexes for table `master_inventory`
--
ALTER TABLE `master_inventory`
  ADD PRIMARY KEY (`no`);

--
-- Indexes for table `master_lokasi`
--
ALTER TABLE `master_lokasi`
  ADD PRIMARY KEY (`lokasi_id`);

--
-- Indexes for table `master_lokasi_kategori`
--
ALTER TABLE `master_lokasi_kategori`
  ADD PRIMARY KEY (`category_id`);

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
  MODIFY `row_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `master_category`
--
ALTER TABLE `master_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `master_data`
--
ALTER TABLE `master_data`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `master_inventory`
--
ALTER TABLE `master_inventory`
  MODIFY `no` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_lokasi`
--
ALTER TABLE `master_lokasi`
  MODIFY `lokasi_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `master_lokasi_kategori`
--
ALTER TABLE `master_lokasi_kategori`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `master_status`
--
ALTER TABLE `master_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
