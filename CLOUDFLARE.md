# Деплой на Cloudflare Pages (работает в России)

## Почему Cloudflare Pages:
- ✅ Работает в России без VPN
- ✅ Бесплатно
- ✅ Быстрая загрузка (CDN по всему миру)
- ✅ Автоматический HTTPS
- ✅ Нет задержек при "засыпании" (в отличие от Render)

## Инструкция:

### Шаг 1: Создай аккаунт Cloudflare
1. Зайди на https://pages.cloudflare.com
2. Зарегистрируйся (можно через GitHub)

### Шаг 2: Подключи репозиторий
1. Нажми **"Create a project"**
2. Выбери **"Connect to Git"**
3. Найди репозиторий `IgrayMoyaIgrushka/mebelniybot`
4. Нажми **"Begin setup"**

### Шаг 3: Настрой деплой
- **Project name**: `mebelniybot` (или любое другое)
- **Production branch**: `main`
- **Build command**: (оставь пустым)
- **Build output directory**: (оставь пустым)
- **Root directory**: (оставь пустым)

### Шаг 4: Деплой
1. Нажми **"Save and Deploy"**
2. Подожди 30-60 секунд

### Шаг 5: Готово!
Сайт будет доступен по адресу:
```
https://mebelniybot.pages.dev
```

Этот домен работает в России без VPN!

## Примечание:
Не забудь сначала положить изображения в папку `images/` и запушить их на GitHub!
