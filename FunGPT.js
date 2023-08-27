const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });

class Message {
    constructor(content) {
        this.role = "user";
        this.content = content;
    }
}

bot.on('message', async (msg) => {
    if(msg.text=="/start"){
        bot.sendMessage(msg.chat.id, "Hello there! I'm a bot. What's up?");                
    }else{  
    const messageArray = JSON.parse(fs.readFileSync('messages.json', 'utf8'))
    messageArray.push(new Message(msg.text));
    const updatedJson = JSON.stringify(messageArray);

    fs.writeFileSync('messages.json', updatedJson);

    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        max_tokens: 1500,
        messages: messageArray
    });
    bot.sendMessage(msg.chat.id, completion.choices[0].message.content);
}
});
