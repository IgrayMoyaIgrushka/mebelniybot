import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { askYandexGPT } from './yandex.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

// База товаров с ценами и скидками
const products = [
  {
    name: 'Диван "Классик"',
    category: 'диван',
    price: 24990,
    oldPrice: 29990,
    description: 'Трёхместный диван с тканевой обивкой, цвет бежевый',
    features: ['тканевая обивка', 'трёхместный', 'бежевый цвет']
  },
  {
    name: 'Диван "Уют"',
    category: 'диван',
    price: 32990,
    oldPrice: 38990,
    description: 'Угловой диван, раскладной, с ящиком для белья',
    features: ['угловой', 'раскладной', 'ящик для белья']
  },
  {
    name: 'Кровать "Стандарт"',
    category: 'кровать',
    price: 18990,
    oldPrice: 22990,
    description: 'Двуспальная кровать 160x200, массив сосны',
    features: ['160x200', 'массив сосны', 'двуспальная']
  },
  {
    name: 'Кровать "Комфорт"',
    category: 'кровать',
    price: 26990,
    oldPrice: 31990,
    description: 'Кровать с мягким изголовьем, 180x200',
    features: ['180x200', 'мягкое изголовье', 'двуспальная']
  },
  {
    name: 'Стул "Обеденный"',
    category: 'стул',
    price: 8990,
    oldPrice: 11990,
    description: 'Классический стул для кухни, комплект 4 шт',
    features: ['комплект 4 шт', 'для кухни', 'классический']
  },
  {
    name: 'Стул "Мягкий"',
    category: 'стул',
    price: 3490,
    oldPrice: 4490,
    description: 'Стул с мягкой обивкой, цвет серый',
    features: ['мягкая обивка', 'серый цвет']
  },
  {
    name: 'Стол "Обеденный"',
    category: 'стол',
    price: 12990,
    oldPrice: 15990,
    description: 'Прямоугольный стол 140x80, дуб сонома',
    features: ['140x80', 'прямоугольный', 'дуб сонома']
  },
  {
    name: 'Стол "Журнальный"',
    category: 'стол',
    price: 5990,
    oldPrice: 7990,
    description: 'Круглый журнальный столик в гостиную',
    features: ['круглый', 'журнальный', 'в гостиную']
  },
  {
    name: 'Шкаф "Классик"',
    category: 'шкаф',
    price: 21990,
    oldPrice: 26990,
    description: 'Трёхдверный шкаф с зеркалом',
    features: ['трёхдверный', 'с зеркалом']
  },
  {
    name: 'Комод "Практичный"',
    category: 'комод',
    price: 9990,
    oldPrice: 12990,
    description: 'Комод с 4 ящиками, белый',
    features: ['4 ящика', 'белый цвет']
  }
];

// Информация о магазине
const storeInfo = {
  delivery: 'Доставка в день заказа',
  warranty: 'Гарантия 2 года',
  assembly: 'Профессиональная сборка',
  payment: 'Оплата при получении или картой',
  return: 'Возврат в течение 14 дней',
  telegram: '@DeeOneTest_bot',
  website: 'vector-ai.su'
};

// Форматирование цены
const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽';
};

// Расчёт скидки
const calculateDiscount = (oldPrice, price) => {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

// Поиск товаров по запросу
const findProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.features.some(f => f.toLowerCase().includes(q))
  );
};

// Генерация ответа про товар
const getProductResponse = (product) => {
  const discount = calculateDiscount(product.oldPrice, product.price);
  return `
🛋️ *${product.name}*

${product.description}

💰 *Цена:* ${formatPrice(product.price)}
❌ ~~${formatPrice(product.oldPrice)}~~
🔥 *Скидка:* ${discount}%

Характеристики: ${product.features.join(', ')}
`.trim();
};

// Системный промпт для GPT
const getSystemPrompt = () => {
  const productsList = products.map(p =>
    `- ${p.name}: ${p.description}, цена ${formatPrice(p.price)} (было ${formatPrice(p.oldPrice)}, скидка ${calculateDiscount(p.oldPrice, p.price)}%)`
  ).join('\n');

  return `Ты помощник мебельного магазина "Мебельный Дом". Твоя задача — помогать покупателям выбирать мебель.

📦 *АССОРТИМЕНТ ТОВАРОВ:*
${productsList}

💡 *АКЦИИ И СКИДКИ:*
- На все товары действуют скидки от 15% до 25%
- Старая цена зачёркнута, новая указана рядом

🚚 *УСЛОВИЯ:*
- ${storeInfo.delivery}
- ${storeInfo.warranty}
- ${storeInfo.assembly}
- ${storeInfo.payment}
- ${storeInfo.return}

📱 *КОНТАКТЫ:*
- Telegram: ${storeInfo.telegram}
- Сайт: ${storeInfo.website}

*ПРАВИЛА ОТВЕТОВ:*
1. Всегда указывай цену со скидкой и старую цену
2. Показывай размер скидки в процентах
3. Будь вежлив и предлагай альтернативы
4. Если товара нет в ассортименте — скажи об этом
5. Призывай к действию: "Напишите в Telegram ${storeInfo.telegram} для заказа"
`;
};

const isStoreTopic = (text) => {
  const t = text.toLowerCase();
  const keywords = [
    'диван', 'кровать', 'шкаф', 'стол', 'стул', 'тумб', 'комод',
    'мебел', 'цена', 'стоим', 'доставка', 'сборк',
    'оплат', 'гарант', 'возврат', 'налич', 'заказ',
    'каталог', 'размер', 'цвет', 'в наличии', 'прайс',
    'скидк', 'акци', 'выгод', 'дешево', 'недорого'
  ];
  return keywords.some((k) => t.includes(k));
};

// Обработка команды /start
bot.start((ctx) => {
  ctx.reply(`
🏠 *Добро пожаловать в "Мебельный Дом"!*

Я помогу подобрать качественную мебель по выгодным ценам!

🔥 *Сейчас действуют скидки до 25% на все товары!*

Напиши мне, что тебя интересует:
• 🛋️ Диваны
• 🛏️ Кровати
• 🪑 Стулья
• 🪵 Столы
• 🚪 Шкафы
• 📦 Комоды

Или задай любой вопрос о мебели!

📱 Для быстрого заказа: ${storeInfo.telegram}
🌐 Наш сайт: ${storeInfo.website}
`);
});

// Обработка текстовых сообщений
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text;

    // Проверка на тему мебели
    if (!isStoreTopic(text)) {
      return ctx.reply('Я отвечаю только на вопросы, связанные с мебелью и магазином. Спросите про диваны, кровати, столы, стулья, шкафы, комоды, цены, доставку или гарантии!');
    }

    // Поиск товаров по запросу
    const foundProducts = findProducts(text);

    if (foundProducts.length > 0) {
      // Если нашли товары — показываем их
      for (const product of foundProducts.slice(0, 3)) {
        await ctx.reply(getProductResponse(product));
      }
      
      if (foundProducts.length > 3) {
        await ctx.reply(`... и ещё ${foundProducts.length - 3} товара. Уточните запрос!`);
      }
      
      await ctx.reply(`\n📱 Для заказа напишите: ${storeInfo.telegram}`);
      return;
    }

    // Если товаров не нашли — спрашиваем GPT
    await ctx.reply('Секунду, подбираю варианты...');

    const systemPrompt = getSystemPrompt();
    const userQuestion = `Покупатель спрашивает: "${text}". Дай развёрнутый ответ с указанием цен и скидок.`;
    
    const answer = await askYandexGPT(userQuestion, systemPrompt);
    await ctx.reply(answer);
  } catch (err) {
    console.error('Bot error:', err);
    await ctx.reply('Ошибка при обработке запроса. Попробуйте позже или напишите в Telegram: ' + storeInfo.telegram);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));