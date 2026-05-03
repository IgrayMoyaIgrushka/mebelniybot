import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { askYandexGPT } from './yandex.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

const isStoreTopic = (text) => {
  const t = text.toLowerCase();
  const keywords = [
    'диван', 'кровать', 'шкаф', 'стол', 'стул', 'тумб',
    'мебел', 'цена', 'стоим', 'доставка', 'сборк',
    'оплат', 'гарант', 'возврат', 'налич', 'заказ',
    'каталог', 'размер', 'цвет', 'в наличии', 'прайс'
  ];
  return keywords.some((k) => t.includes(k));
};

bot.start((ctx) =>
  ctx.reply('Привет! Я помогу подобрать мебель по ассортименту магазина. Напиши, что ищешь.')
);

bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text;

    if (!isStoreTopic(text)) {
      return ctx.reply('Я отвечаю только по вопросам магазина мебели.');
    }

    await ctx.reply('Секунду, смотрю...');

    const answer = await askYandexGPT(text);
    await ctx.reply(answer);
  } catch (err) {
    console.error('Bot error:', err);
    await ctx.reply('Ошибка при обработке запроса.');
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));