-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Creato il: Giu 14, 2019 alle 15:07
-- Versione del server: 10.1.37-MariaDB-0+deb9u1
-- Versione PHP: 7.0.33-0+deb9u3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iaqosdb`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `assets`
--

CREATE TABLE `assets` (
  `name` varchar(60) NOT NULL,
  `domain` varchar(60) NOT NULL,
  `t` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processed` tinyint(4) NOT NULL DEFAULT '0',
  `mime` varchar(255) NOT NULL,
  `ext` varchar(6) NOT NULL,
  `owner_name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `id` bigint(20) NOT NULL,
  `type` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `data_text`
--

CREATE TABLE `data_text` (
  `id` bigint(20) NOT NULL,
  `id_asset` bigint(20) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(15) NOT NULL,
  `label` varchar(512) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `domain` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `owner_name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `domain_actions`
--

CREATE TABLE `domain_actions` (
  `domain` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `action` varchar(60) NOT NULL DEFAULT 'gan_image',
  `param1` varchar(512) NOT NULL,
  `param2` varchar(512) NOT NULL,
  `lastupdated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `stories`
--

CREATE TABLE `stories` (
  `id` bigint(20) NOT NULL,
  `story` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `emotion` varchar(30) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `t` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `language` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `TEXTS_graphs_links`
--

CREATE TABLE `TEXTS_graphs_links` (
  `id1` bigint(20) NOT NULL,
  `id2` bigint(20) NOT NULL,
  `weight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `TEXTS_graphs_nodes`
--

CREATE TABLE `TEXTS_graphs_nodes` (
  `id` bigint(20) NOT NULL,
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `domain` varchar(60) NOT NULL,
  `weigth` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `pwd` varchar(1024) NOT NULL,
  `role` varchar(5) NOT NULL,
  `token` varchar(1024) NOT NULL,
  `token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `data_text`
--
ALTER TABLE `data_text`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_asset` (`id_asset`),
  ADD KEY `type` (`type`),
  ADD KEY `domain` (`domain`),
  ADD KEY `owner_name` (`owner_name`);

--
-- Indici per le tabelle `domain_actions`
--
ALTER TABLE `domain_actions`
  ADD PRIMARY KEY (`domain`);

--
-- Indici per le tabelle `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emotion` (`emotion`),
  ADD KEY `lat` (`lat`,`lng`),
  ADD KEY `t` (`t`),
  ADD KEY `language` (`language`);

--
-- Indici per le tabelle `TEXTS_graphs_links`
--
ALTER TABLE `TEXTS_graphs_links`
  ADD PRIMARY KEY (`id1`,`id2`),
  ADD KEY `weight` (`weight`);

--
-- Indici per le tabelle `TEXTS_graphs_nodes`
--
ALTER TABLE `TEXTS_graphs_nodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`,`domain`),
  ADD KEY `name_2` (`name`,`domain`),
  ADD KEY `weight` (`weigth`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `assets`
--
ALTER TABLE `assets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `data_text`
--
ALTER TABLE `data_text`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `stories`
--
ALTER TABLE `stories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT per la tabella `TEXTS_graphs_nodes`
--
ALTER TABLE `TEXTS_graphs_nodes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;
--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
