const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '5378799004:AAFplO6uZw8higwOQZOMZqooayPvbizzvPQ';
const bot = new TelegramApi(token, {polling: true});
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now I'm thinking about number from 0 to 9 you will never figure out.`);
    const randNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randNumber;
    await bot.sendMessage(chatId, "Let's start", gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start dialogue'},
        {command: '/help', description: 'Help people to find the right way (or a command)'},
        {command: '/about', description: 'About coder'},
        {command: '/game', description: 'Try to figure out what number I guessed'},//'WOW! This is a cool game with a lot of interesting conte... No. This is clicker.'
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            bot.sendSticker(chatId, "CAACAgIAAxkBAAEEg5diXr6RpBHwfAxMXoV2li2r-4mM3AACxgEAAhZCawpKI9T0ydt5RyQE");
            return bot.sendMessage(chatId, `Hi, ${msg.from.first_name} ${msg.from.last_name}.`);
        }
        if(text === '/help') {
            return bot.sendMessage(chatId, `That's what i can do:\n\nWait... But you have a menu button somwhere there:\n👇`);
        }
        if(text === '/about') {
            return bot.sendMessage(chatId, `I was made by the greatest coder in the world. He can make you a website or a bot or a cake. I know you need it.
            \nThere he is --> https://github.com/Alexander-Puv.`);
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Uhm... What? Please check what I can do by clicking a menu button or write /help.');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const rightMessages = [
            "You won... I'm so glad... Let's try again! ",
            "What a little m... You won! My congratulations! Than... maybe once more",
            "Stupid moron! Outside my window... You won. You're so cool. Proud of yourself, yeah? Think you should try again. YOU MUST!"
        ];
        const falseMessages = [
            "Oh no! You lose! I thought you would win. You have to try again!",
            "I'm so glad... Disappointed! You lose. But how will you look others in the eye if you just go away now? Just try once more",
            "You lose. Just not a lucky day. Try again I believe in you!",
            "You lose. But I know you will win! Some day..."
        ];
        if(data === '/again') {
            return startGame(chatId);
        }
        if(data == chats[chatId]) {
            return await bot.sendMessage(chatId, `${rightMessages[Math.floor(Math.random()*rightMessages.length)]} I guessed number ${chats[chatId]}`, againOptions/* Math.floor(Math.random()*rightMessages.length) + `I guessed number ${chats[chatId]}` */);
        } else {
            return await bot.sendMessage(chatId, `${falseMessages[Math.floor(Math.random()*falseMessages.length)]} I guessed number ${chats[chatId]}`, againOptions/* Math.floor(Math.random()*falseMessages.length) + `I guessed number ${chats[chatId]}` */);
        }
    })
}

start();