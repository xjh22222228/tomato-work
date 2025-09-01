# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20094
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: localhost (MySQL 8.3.0)
# 数据库: tomato_work
# 生成时间: 2025-06-08 07:11:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 bill_types
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_types`;

CREATE TABLE `bill_types` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `sort_index` int NOT NULL DEFAULT '0',
  `name` varchar(20) NOT NULL DEFAULT '',
  `type` int NOT NULL DEFAULT '1' COMMENT '1=收入, 2=支出',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 bills
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bills`;

CREATE TABLE `bills` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `price` decimal(19,2) NOT NULL DEFAULT '0.00',
  `date` bigint NOT NULL,
  `type_id` varchar(255) NOT NULL,
  `remark` varchar(250) NOT NULL DEFAULT '',
  `imgs` text,
  PRIMARY KEY (`id`),
  KEY `FK_64adb21b381a90b40234537b41e` (`type_id`),
  CONSTRAINT `FK_64adb21b381a90b40234537b41e` FOREIGN KEY (`type_id`) REFERENCES `bill_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 company
# ------------------------------------------------------------

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `remark` text NOT NULL,
  `amount` decimal(19,2) NOT NULL,
  `expect_leave_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 inner_messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `inner_messages`;

CREATE TABLE `inner_messages` (
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `type` int NOT NULL DEFAULT '0' COMMENT '消息类型, 0=系统消息',
  `has_read` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `logs`;

CREATE TABLE `logs` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `company_id` varchar(255) NOT NULL,
  `log_type` int NOT NULL COMMENT '日志类型, 1=日报、2=周报、3=月报',
  `done_content` text NOT NULL,
  `undone_content` text NOT NULL,
  `plan_content` text NOT NULL,
  `summary_content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 memorandums
# ------------------------------------------------------------

DROP TABLE IF EXISTS `memorandums`;

CREATE TABLE `memorandums` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `sort_index` int NOT NULL DEFAULT '0',
  `title` varchar(255) NOT NULL,
  `markdown` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `timestamp` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;



# 转储表 reminders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reminders`;

CREATE TABLE `reminders` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `date` bigint NOT NULL COMMENT '提醒时间',
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '事项类型, 1=待提醒, 2=已提醒',
  `cron` varchar(20) DEFAULT NULL COMMENT 'cron表达式',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 tasks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tasks`;

CREATE TABLE `tasks` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `content` varchar(255) NOT NULL,
  `date` bigint NOT NULL,
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '进度类型: 1=待作业, 2=作业中, 3=已完成, 4=未完成',
  `count` tinyint NOT NULL DEFAULT '0' COMMENT '待办优先级, 0-5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 todo_lists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `todo_lists`;

CREATE TABLE `todo_lists` (
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `content` text NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态, 1=进行中, 2=完成',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 user_configures
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_configures`;

CREATE TABLE `user_configures` (
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `id` varchar(36) NOT NULL,
  `uid` int NOT NULL,
  `is_task_notify` tinyint NOT NULL DEFAULT '1' COMMENT '待办任务通知',
  `is_matter_notify` tinyint NOT NULL DEFAULT '1' COMMENT '提醒事项通知',
  `server_chan_sckey` varchar(255) NOT NULL DEFAULT '' COMMENT '企业微信API KEY',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0d04fb304d8bb837f29acf6d36` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uid` int NOT NULL,
  `token` varchar(255) NOT NULL DEFAULT '',
  `avatar_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `provider` varchar(255) NOT NULL DEFAULT 'github',
  `login_name` varchar(255) NOT NULL DEFAULT '',
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT NULL,
  `ip_addr` varchar(255) DEFAULT NULL,
  `role` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
