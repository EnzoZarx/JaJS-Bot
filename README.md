# JaJS Bot

JaJS Bot (Just another JavaScript Bot) is a simple and modular Discord bot developed in JavaScript.

## Installation

Before starting, make sure you have **Node.js** and **npm** installed on your machine.

### Requirements

Make sure you have the following requirements before configuring the bot:

- **Node.js** version 22 or higher
- **npm** (comes with Node.js)

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/JaJS-Bot.git
   // ~~ -------------------- or -------------------- ~~ \\
   git clone git@github.com:your-username/JaJS-Bot.git
   cd JaJS-Bot
   ```

2. Run the installation script:
   ```bash
   ./install.sh
   ```
   This script will automatically install the necessary dependencies.

## Configuration

After installation, configure your bot by filling in the `config.json` and `settings.json` files with your Discord token and other required settings.

In the Discord Developer Portal, navigate to the **OAuth2** section of your bot. Under **OAuth2 > URL Generator**, make sure to check the following scopes:

- `identify`
- `guilds`
- `guilds.members.read`
- `bot`
- `applications.commands`

And the following permissions :

- `View Audit Log`
- `Manage Roles`
- `Kick Members`
- `Ban Members`
- `View Channels`
- `Moderate Members`
- `Send Messages`
- `Send Messages in Threads`
- `Manage Messages`
- `Embed Links`
- `Attach Files`
- `Read Message History`
- `Mention Everyone`
- `Use Slash Commands`

These are required to generate the correct invitation link for your bot. Copy the generated URL and use it to invite the bot to your server.

### Permissions

By default, staff commands to be visible require the `Manage Nicknames` permission (`PermissionFlagsBits.ManageNicknames`) but to use it you will also need the indicated role in the settings file (ban/kick = MODERATION_ROLE | holiday/clear/timeout = STAFF_ROLE). If you prefer to use a different permission, you can modify the required permission in the code.

## Launch

To start the bot, use the following command:
```bash
npm start
```

## Contribution

Contributions are welcome! Feel free to suggest improvements via issues or pull requests.

## License

This project is licensed under the MIT License.

