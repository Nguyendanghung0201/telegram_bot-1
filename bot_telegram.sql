-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 08, 2023 lúc 09:32 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bot_telegram`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chienluoc_d5go`
--

CREATE TABLE `chienluoc_d5go` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chienluoc_k3go`
--

CREATE TABLE `chienluoc_k3go` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chienluoc_trxhash`
--

CREATE TABLE `chienluoc_trxhash` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chienluoc_vngo`
--

CREATE TABLE `chienluoc_vngo` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `copytinhieu_d5go`
--

CREATE TABLE `copytinhieu_d5go` (
  `id` int(11) NOT NULL,
  `id_group` varchar(256) NOT NULL,
  `chatid` varchar(256) NOT NULL,
  `chienlucvon` varchar(256) NOT NULL DEFAULT 'NONE',
  `thongke` int(11) NOT NULL DEFAULT 50,
  `datatext` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `chienluocdata` text NOT NULL,
  `chienluocdata_goc` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `copytinhieu_k3go`
--

CREATE TABLE `copytinhieu_k3go` (
  `id` int(11) NOT NULL,
  `id_group` varchar(256) NOT NULL,
  `chatid` varchar(256) NOT NULL,
  `chienlucvon` varchar(256) NOT NULL DEFAULT 'NONE',
  `thongke` int(11) NOT NULL DEFAULT 50,
  `datatext` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `copytinhieu_trxhash`
--

CREATE TABLE `copytinhieu_trxhash` (
  `id` int(11) NOT NULL,
  `id_group` varchar(256) NOT NULL,
  `chatid` varchar(256) NOT NULL,
  `chienlucvon` varchar(256) NOT NULL DEFAULT 'NONE',
  `thongke` int(11) NOT NULL DEFAULT 50,
  `datatext` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `copytinhieu_vngo`
--

CREATE TABLE `copytinhieu_vngo` (
  `id` int(11) NOT NULL,
  `id_group` varchar(256) NOT NULL,
  `chatid` varchar(256) NOT NULL,
  `chienlucvon` varchar(256) NOT NULL DEFAULT 'NONE',
  `thongke` int(11) NOT NULL DEFAULT 50,
  `datatext` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsu_ma`
--

CREATE TABLE `lichsu_ma` (
  `id` int(11) NOT NULL,
  `uid` varchar(256) NOT NULL,
  `usersid` int(11) NOT NULL,
  `gametype` int(11) NOT NULL,
  `typeid` int(11) NOT NULL,
  `amount` varchar(256) NOT NULL,
  `betcount` varchar(256) NOT NULL,
  `issuenumber` varchar(256) NOT NULL,
  `ketqua` varchar(256) NOT NULL,
  `selecttype` varchar(256) NOT NULL,
  `session` int(11) NOT NULL,
  `thang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tonghopphien`
--

CREATE TABLE `tonghopphien` (
  `id` int(11) NOT NULL,
  `data` text NOT NULL,
  `lai` varchar(256) NOT NULL,
  `lo` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `tinhieu` varchar(256) NOT NULL,
  `type` varchar(256) NOT NULL,
  `gay` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_telegram_d5go`
--

CREATE TABLE `users_telegram_d5go` (
  `id` int(11) NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `usersname` varchar(256) NOT NULL,
  `pass` varchar(256) NOT NULL,
  `data` text NOT NULL,
  `Sign` text NOT NULL,
  `UserId` varchar(256) NOT NULL,
  `NickName` varchar(256) NOT NULL,
  `chienluoc` text NOT NULL ,
  `lodung` int(11) NOT NULL DEFAULT 0,
  `loidung` int(11) NOT NULL DEFAULT 0,
  `doigay` varchar(256) NOT NULL DEFAULT 'off',
  `cainguoc` varchar(256) NOT NULL DEFAULT 'off',
  `caidca` varchar(256) NOT NULL DEFAULT 'thua',
  `coppy` varchar(256) NOT NULL DEFAULT 'off',
  `chienluoc_id` int(11) DEFAULT 0,
  `tele_name` varchar(256) NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `loinhuan` varchar(256) NOT NULL,
  `mucloihientai` varchar(256) NOT NULL DEFAULT 'NONE',
  `status` int(11) NOT NULL DEFAULT 1,
  `status_trade` int(11) NOT NULL DEFAULT 0,
  `bet_index` int(11) NOT NULL DEFAULT 0,
  `vngo1` int(11) NOT NULL DEFAULT 0,
  `vngo3` int(11) NOT NULL DEFAULT 0,
  `vngo5` int(11) NOT NULL DEFAULT 0,
  `vngo10` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `5dgo1` int(11) NOT NULL DEFAULT 0,
  `5dgo3` int(11) NOT NULL DEFAULT 0,
  `5dgo5` int(11) NOT NULL DEFAULT 0,
  `5dgo10` int(11) NOT NULL DEFAULT 0,
  `k3go1` int(11) NOT NULL DEFAULT 0,
  `k3go3` int(11) NOT NULL DEFAULT 0,
  `k3go5` int(11) NOT NULL DEFAULT 0,
  `k3go10` int(11) NOT NULL DEFAULT 0,
  `trxhash1` int(11) NOT NULL DEFAULT 0,
  `activeacc` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_telegram_k3go`
--

CREATE TABLE `users_telegram_k3go` (
  `id` int(11) NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `usersname` varchar(256) NOT NULL,
  `pass` varchar(256) NOT NULL,
  `data` text NOT NULL,
  `Sign` text NOT NULL,
  `UserId` varchar(256) NOT NULL,
  `NickName` varchar(256) NOT NULL,
  `chienluoc` text NOT NULL ,
  `lodung` int(11) NOT NULL DEFAULT 0,
  `loidung` int(11) NOT NULL DEFAULT 0,
  `doigay` varchar(256) NOT NULL DEFAULT 'off',
  `cainguoc` varchar(256) NOT NULL DEFAULT 'off',
  `caidca` varchar(256) NOT NULL DEFAULT 'thua',
  `coppy` varchar(256) NOT NULL DEFAULT 'off',
  `chienluoc_id` int(11) DEFAULT 0,
  `tele_name` varchar(256) NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `loinhuan` varchar(256) NOT NULL,
  `mucloihientai` varchar(256) NOT NULL DEFAULT 'NONE',
  `status` int(11) NOT NULL DEFAULT 1,
  `status_trade` int(11) NOT NULL DEFAULT 0,
  `bet_index` int(11) NOT NULL DEFAULT 0,
  `vngo1` int(11) NOT NULL DEFAULT 0,
  `vngo3` int(11) NOT NULL DEFAULT 0,
  `vngo5` int(11) NOT NULL DEFAULT 0,
  `vngo10` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `5dgo1` int(11) NOT NULL DEFAULT 0,
  `5dgo3` int(11) NOT NULL DEFAULT 0,
  `5dgo5` int(11) NOT NULL DEFAULT 0,
  `5dgo10` int(11) NOT NULL DEFAULT 0,
  `k3go1` int(11) NOT NULL DEFAULT 0,
  `k3go3` int(11) NOT NULL DEFAULT 0,
  `k3go5` int(11) NOT NULL DEFAULT 0,
  `k3go10` int(11) NOT NULL DEFAULT 0,
  `trxhash1` int(11) NOT NULL DEFAULT 0,
  `activeacc` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_telegram_trxhash`
--

CREATE TABLE `users_telegram_trxhash` (
  `id` int(11) NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `usersname` varchar(256) NOT NULL,
  `pass` varchar(256) NOT NULL,
  `data` text NOT NULL,
  `Sign` text NOT NULL,
  `UserId` varchar(256) NOT NULL,
  `NickName` varchar(256) NOT NULL,
  `chienluoc` text NOT NULL ,
  `lodung` int(11) NOT NULL DEFAULT 0,
  `loidung` int(11) NOT NULL DEFAULT 0,
  `doigay` varchar(256) NOT NULL DEFAULT 'off',
  `cainguoc` varchar(256) NOT NULL DEFAULT 'off',
  `caidca` varchar(256) NOT NULL DEFAULT 'thua',
  `coppy` varchar(256) NOT NULL DEFAULT 'off',
  `chienluoc_id` int(11) DEFAULT 0,
  `tele_name` varchar(256) NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `loinhuan` varchar(256) NOT NULL,
  `mucloihientai` varchar(256) NOT NULL DEFAULT 'NONE',
  `status` int(11) NOT NULL DEFAULT 1,
  `status_trade` int(11) NOT NULL DEFAULT 0,
  `bet_index` int(11) NOT NULL DEFAULT 0,
  `vngo1` int(11) NOT NULL DEFAULT 0,
  `vngo3` int(11) NOT NULL DEFAULT 0,
  `vngo5` int(11) NOT NULL DEFAULT 0,
  `vngo10` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `5dgo1` int(11) NOT NULL DEFAULT 0,
  `5dgo3` int(11) NOT NULL DEFAULT 0,
  `5dgo5` int(11) NOT NULL DEFAULT 0,
  `5dgo10` int(11) NOT NULL DEFAULT 0,
  `k3go1` int(11) NOT NULL DEFAULT 0,
  `k3go3` int(11) NOT NULL DEFAULT 0,
  `k3go5` int(11) NOT NULL DEFAULT 0,
  `k3go10` int(11) NOT NULL DEFAULT 0,
  `trxhash1` int(11) NOT NULL DEFAULT 0,
  `activeacc` int(11) NOT NULL DEFAULT 0,
  `trxhash3` int(11) NOT NULL DEFAULT 0,
  `trxhash5` int(11) NOT NULL DEFAULT 0,
  `trxhash10` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users_telegram_vngo`
--

CREATE TABLE `users_telegram_vngo` (
  `id` int(11) NOT NULL,
  `tele_id` varchar(256) NOT NULL,
  `usersname` varchar(256) NOT NULL,
  `pass` varchar(256) NOT NULL,
  `data` text NOT NULL,
  `Sign` text NOT NULL,
  `UserId` varchar(256) NOT NULL,
  `NickName` varchar(256) NOT NULL,
  `chienluoc` text NOT NULL ,
  `lodung` int(11) NOT NULL DEFAULT 0,
  `loidung` int(11) NOT NULL DEFAULT 0,
  `doigay` varchar(256) NOT NULL DEFAULT 'off',
  `cainguoc` varchar(256) NOT NULL DEFAULT 'off',
  `caidca` varchar(256) NOT NULL DEFAULT 'thua',
  `coppy` varchar(256) NOT NULL DEFAULT 'off',
  `chienluoc_id` int(11) DEFAULT 0,
  `tele_name` varchar(256) NOT NULL,
  `chienluocdata` text NOT NULL ,
  `chienluocdata_goc` text NOT NULL ,
  `loinhuan` varchar(256) NOT NULL,
  `mucloihientai` varchar(256) NOT NULL DEFAULT 'NONE',
  `status` int(11) NOT NULL DEFAULT 1,
  `status_trade` int(11) NOT NULL DEFAULT 0,
  `bet_index` int(11) NOT NULL DEFAULT 0,
  `vngo1` int(11) NOT NULL DEFAULT 0,
  `vngo3` int(11) NOT NULL DEFAULT 0,
  `vngo5` int(11) NOT NULL DEFAULT 0,
  `vngo10` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `5dgo1` int(11) NOT NULL DEFAULT 0,
  `5dgo3` int(11) NOT NULL DEFAULT 0,
  `5dgo5` int(11) NOT NULL DEFAULT 0,
  `5dgo10` int(11) NOT NULL DEFAULT 0,
  `k3go1` int(11) NOT NULL DEFAULT 0,
  `k3go3` int(11) NOT NULL DEFAULT 0,
  `k3go5` int(11) NOT NULL DEFAULT 0,
  `k3go10` int(11) NOT NULL DEFAULT 0,
  `trxhash1` int(11) NOT NULL DEFAULT 0,
  `activeacc` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chienluoc_d5go`
--
ALTER TABLE `chienluoc_d5go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chienluoc_k3go`
--
ALTER TABLE `chienluoc_k3go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chienluoc_trxhash`
--
ALTER TABLE `chienluoc_trxhash`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `chienluoc_vngo`
--
ALTER TABLE `chienluoc_vngo`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `copytinhieu_d5go`
--
ALTER TABLE `copytinhieu_d5go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `copytinhieu_k3go`
--
ALTER TABLE `copytinhieu_k3go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `copytinhieu_trxhash`
--
ALTER TABLE `copytinhieu_trxhash`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `copytinhieu_vngo`
--
ALTER TABLE `copytinhieu_vngo`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `lichsu_ma`
--
ALTER TABLE `lichsu_ma`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `tonghopphien`
--
ALTER TABLE `tonghopphien`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users_telegram_d5go`
--
ALTER TABLE `users_telegram_d5go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users_telegram_k3go`
--
ALTER TABLE `users_telegram_k3go`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users_telegram_trxhash`
--
ALTER TABLE `users_telegram_trxhash`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users_telegram_vngo`
--
ALTER TABLE `users_telegram_vngo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chienluoc_d5go`
--
ALTER TABLE `chienluoc_d5go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chienluoc_k3go`
--
ALTER TABLE `chienluoc_k3go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chienluoc_trxhash`
--
ALTER TABLE `chienluoc_trxhash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `chienluoc_vngo`
--
ALTER TABLE `chienluoc_vngo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `copytinhieu_d5go`
--
ALTER TABLE `copytinhieu_d5go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `copytinhieu_k3go`
--
ALTER TABLE `copytinhieu_k3go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `copytinhieu_trxhash`
--
ALTER TABLE `copytinhieu_trxhash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `copytinhieu_vngo`
--
ALTER TABLE `copytinhieu_vngo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `lichsu_ma`
--
ALTER TABLE `lichsu_ma`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tonghopphien`
--
ALTER TABLE `tonghopphien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users_telegram_d5go`
--
ALTER TABLE `users_telegram_d5go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users_telegram_k3go`
--
ALTER TABLE `users_telegram_k3go`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users_telegram_trxhash`
--
ALTER TABLE `users_telegram_trxhash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users_telegram_vngo`
--
ALTER TABLE `users_telegram_vngo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
