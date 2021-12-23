// DEPENDENCIES
require('dotenv').config()
const { Client, Intents } = require('discord.js');

// SETTING UP CONFIGS
const prefix = "!";
const token = `${process.env.BOT_TOKEN}`;

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] })
const queue = new Map();

// COMMANDS
const enqueue = require('./commands/enqueue').enqueue
const play = require('./commands/play').play

// LISTENERS
client.once('ready', () => {
    console.log('Ready!');
    client.user.setPresence({
        status: "online",
        game: {
            name: "!help",
            type: "PLAYING"
        }
    });
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});


// READ USER COMMANDS
client.on('message', async message => {

    // IGNORE BOT MESSAGES AND CHECK IF MESSAGE AIMED AT BOT
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    // EXTRACT COMMAND AND INVOKE CORRESPONDING FUNCTION
    if (message.content.startsWith(`${prefix}`)) {
        const command = (message.content.replace(`${prefix}`, "").split(" ")[0]);

        switch (command.toLowerCase()) {
            case 'play':
                enqueue(message, serverQueue, queue, loop);
                break;
        }
    }
});
client.login(token);
