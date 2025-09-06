const { Sequelize } = require('sequelize');
const sequelize = require('../database/connect.js');

const Log = sequelize.define('Log', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    user_name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    moderator_id: {
        type: Sequelize.STRING(32),
        allowNull: true
    },
    moderator_username: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    action: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'logs',
    timestamps: false
});

const XP = sequelize.define('XP', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.STRING(32),
        unique: true,
        allowNull: false
    },
    user_name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    next_xp: {
        type: Sequelize.FLOAT,
        defaultValue: 100
    },
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    total_messages: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    total_xp: {
        type: Sequelize.FLOAT,
        defaultValue: 10
    }
}, {
    tableName: 'xp',
    timestamps: false
});

module.exports = {
    Log,
    XP
};