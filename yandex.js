export async function askYandexGPT(userText, systemPrompt) {
  const folderId = process.env.FOLDER_ID;
  const apiKey = process.env.YA_API_KEY;

  // Если системный промпт не передан, используем стандартный
  if (!systemPrompt) {
    systemPrompt = `
Ты ассистент мебельного магазина.
Отвечай только по теме магазина и лендинга: диваны, кровати, шкафы, столы, стулья, тумбы, цены, наличие, доставка, сборка, оплата, гарантия, возврат, контакты и оформление заявки.
Если вопрос не по теме магазина, вежливо откажи и скажи:
"Я отвечаю только по вопросам магазина мебели."
Не выдумывай товары и цены. Если данных нет — попроси уточнить у менеджера.
Если пользователь готов покупать, предложи оставить контакт для связи с менеджером.
`;
  }

  const res = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${apiKey}`,
      'x-folder-id': folderId,
    },
    body: JSON.stringify({
      modelUri: `gpt://${folderId}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.4,
        maxTokens: 700,
      },
      messages: [
        {
          role: 'system',
          text: systemPrompt.trim(),
        },
        {
          role: 'user',
          text: userText,
        },
      ],
    }),
  });

  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`YandexGPT ${res.status}: ${raw}`);
  }

  const data = JSON.parse(raw);
  return data.result.alternatives?.[0]?.message?.text || 'Пустой ответ от модели.';
}