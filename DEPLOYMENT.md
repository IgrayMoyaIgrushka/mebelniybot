# Инструкция по деплою на Render

## Шаг 1: Подготовьте проект

1. Убедитесь, что все файлы закоммичены в Git репозиторий
2. Если у вас ещё нет репозитория, создайте его на GitHub или GitLab

```bash
git init
git add .
git commit -m "Initial commit"
```

## Шаг 2: Создайте репозиторий на GitHub

1. Зайдите на https://github.com
2. Создайте новый публичный или приватный репозиторий
3. Запушьте код:

```bash
git remote add origin https://github.com/your-username/mebelniybot.git
git push -u origin main
```

## Шаг 3: Настройте Render

1. Зайдите на https://render.com
2. Войдите через GitHub аккаунт
3. Нажмите **"New +"** → **"Web Service"**
4. Выберите ваш репозиторий `mebelniybot`
5. Настройте параметры:
   - **Name**: `mebelniy-landing` (или любое другое)
   - **Region**: Выберите ближайший к вам
   - **Branch**: `main`
   - **Root Directory**: оставьте пустым
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run web`
   - **Instance Type**: `Free`

6. Нажмите **"Create Web Service"**

## Шаг 4: Проверьте работу

После деплоя Render предоставит вам URL вида:
```
https://mebelniy-landing.onrender.com
```

Ваш лендинг будет доступен по этому адресу!

## Примечания

- На бесплатном тарифе сервис может "засыпать" после 15 минут бездействия
- Первое открытие после простоя займёт около 30-50 секунд
- Для постоянного доступа рассмотрите платный тариф ($7/мес)

## Локальное тестирование

Перед деплоем протестируйте локально:

```bash
npm install
npm run web
```

Откройте http://localhost:3000 в браузере
