-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2026 at 12:32 AM
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
-- Database: `umbc_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `umbc_accounts`
--

CREATE TABLE `umbc_accounts` (
  `umbc_id` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `umbc_email` varchar(100) NOT NULL,
  `pword_hash` varchar(255) NOT NULL,
  `session_id` varchar(4096) DEFAULT NULL,
  `session_end` timestamp NULL DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `umbc_courses`
--

CREATE TABLE `umbc_courses` (
  `course_id` int(11) NOT NULL,
  `course_subject` char(4) NOT NULL,
  `course_code` varchar(4) NOT NULL,
  `course_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `umbc_subjects`
--

CREATE TABLE `umbc_subjects` (
  `subject_code` char(4) NOT NULL,
  `subject_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `umbc_accounts`
--
ALTER TABLE `umbc_accounts`
  ADD PRIMARY KEY (`umbc_id`),
  ADD UNIQUE KEY `umbc_email` (`umbc_email`),
  ADD UNIQUE KEY `session_id` (`session_id`) USING HASH,
  ADD KEY `idx_first_name` (`first_name`);

--
-- Indexes for table `umbc_courses`
--
ALTER TABLE `umbc_courses`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `idx_course_subject` (`course_subject`),
  ADD KEY `idx_course_code` (`course_code`);

--
-- Indexes for table `umbc_subjects`
--
ALTER TABLE `umbc_subjects`
  ADD PRIMARY KEY (`subject_code`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `umbc_courses`
--
ALTER TABLE `umbc_courses`
  ADD CONSTRAINT `fk_course_subject` FOREIGN KEY (`course_subject`) REFERENCES `umbc_subjects` (`subject_code`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
