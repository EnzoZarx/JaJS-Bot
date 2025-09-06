DROP TABLE IF EXISTS `logs`;
DROP TABLE IF EXISTS `xp`;

CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(32) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `moderator_id` VARCHAR(32),
  `moderator_username` VARCHAR(255),
  `action` VARCHAR(255) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `xp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(32) NOT NULL UNIQUE,
  `user_name` VARCHAR(255) NOT NULL,
  `next_xp` float NOT NULL DEFAULT 100,
  `level` int NOT NULL DEFAULT 1,
  `total_messages` int NOT NULL DEFAULT 1,
  `total_xp` float NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;