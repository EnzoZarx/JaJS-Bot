#!/bin/bash

echo "Project init..."

# System Update
echo "Updating Packets..."
sudo apt update && sudo apt upgrade -y

# Node.js, npm and MariaDB Install
echo "Node.js, npm and MariaDB Install..."
sudo apt install -y nodejs npm mariadb-server

# Create Database
echo "MariaDB Config..."
sudo systemctl start mariadb
sudo systemctl enable mariadb

# MariaDB Security
echo "MariaDB Securisation..."
sudo mysql_secure_installation

# Ask for root password
read -s -p "Enter the root password for MariaDB: " ROOT_PASSWORD
echo ""

# Database and User Creation
read -p "Enter your user name for database : " DB_USER
read -s -p "Enter password for your user : " DB_PASSWORD
echo ""
echo "Database and User Creation..."

# Use the root password to execute SQL commands
sudo mariadb -u root -p"${ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS jajs_db;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON jajs_db.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;

USE jajs_db;

DROP TABLE IF EXISTS \`logs\`;
DROP TABLE IF EXISTS \`xp\`;

CREATE TABLE \`logs\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` VARCHAR(32) NOT NULL,
  \`user_name\` VARCHAR(255) NOT NULL,
  \`moderator_id\` VARCHAR(32),
  \`moderator_username\` VARCHAR(255),
  \`action\` VARCHAR(255) NOT NULL,
  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE \`xp\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`user_id\` VARCHAR(32) NOT NULL UNIQUE,
  \`user_name\` VARCHAR(255) NOT NULL,
  \`next_xp\` FLOAT NOT NULL DEFAULT 100,
  \`level\` INT NOT NULL DEFAULT 1,
  \`total_messages\` INT NOT NULL DEFAULT 1,
  \`total_xp\` FLOAT NOT NULL DEFAULT 10,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
EOF

# Automatic Creation of config.json
echo ".config.json File Creation..."
cat <<EOL > ./config/config.json
{
    "TOKEN": "your-token-here",
    "CLIENT_ID":"your-client-id",
    "GUILD_ID":"your-guild-id",

    "PORT":443,

    "DB_HOST":"localhost",
    "DB_PORT":3306,
    "DB_USER":"${DB_USER}",
    "DB_PASSWORD":"${DB_PASSWORD}",
    "DB_NAME":"jajs_db"
}
EOL

# Automatic Creation of settings.json
echo ".settings.json File Creation..."
cat <<EOL > ./config/settings.json
{
    "LOG_CHANNEL": "your-log-channel-id",
    "WELCOME_CHANNEL": "your-welcome-channel-id",
    "LANGUAGE": "en",
    "EMBED_COLOR": [R, G, B],
    "_comment1": "This role will have access to the staff commands part in 'backend/bot'",
    "STAFF_ROLE_ID": "your-staff-role-id",
    "_comment2": "This role will have access to the moderation commands part in 'backend/bot'",
    "MODERATION_ROLE_ID": "your-moderator-role-id",
    "_comment3": "This role will be added to staff members when they are on holiday",
    "HOLIDAY_ROLE_ID": "your-holiday-role-id",
    "_comment4": "You will need to fill the rank update channel and 4 rank from lower to harder to get or modify messageCreate.js in the events folder to add or remove rank roles",
    "INACTIVE_XP_CHANNELS": ["CHANNELS_ID"],
    "RANK_UPDATE_CHANNEL": "your-rank-update-channel-id",
    "RANK_UPDATE_ROLES": ["ROLES_ID"],
    "NON_MESSAGE_CHANNELS": ["CHANNELS_ID"]
}
EOL

# Project Dependencies Install
echo "Node.js Dependencies Install..."
npm install

# Finish Message
echo "Install Done ! Think of configuring your environment."

exit 0
