# MESK Prep

Современное веб-приложение для подготовки к экзаменам МЭСК с минималистичным дизайном в японском стиле.

## Функционал

- **Дашборд предметов** — 5 предметов с возможностью добавления тем и отслеживания прогресса
- **Трекер тем** — чекбоксы "Знаю/Не знаю" с прогресс-барами
- **Календарь подготовки** — интерактивный календарь для планирования занятий с заметками
- **Таймер Помодоро** — настраиваемый таймер (25/5/15 минут) со звуковым уведомлением
- **Дедлайн** — обратный отсчет до 15 мая 2026
- **Темная тема** — переключение светлая/темная тема
- **Локальное хранение** — все данные сохраняются в localStorage
- **Плавные анимации** — красивые transitions и hover-эффекты

## Технологии

- React 18 + TypeScript
- Tailwind CSS
- Lucide React (иконки)
- Vite

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка
npm run build
```

## Деплой на GitHub Pages (Автоматический)

### 1. Создай репозиторий на GitHub
```bash
# Инициализация
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/mesk-prep.git
git branch -M main
git push -u origin main
```

### 2. Настрой GitHub Pages
1. Перейди в Settings → Pages
2. Source: GitHub Actions
3. Готово! При каждом push в main сайт будет автоматически деплоиться

### Ручной деплой (альтернатива)
```bash
npm run deploy
```

## Инструкция по публикации на GitHub

### 1. Инициализация локально

```bash
# Перейти в папку проекта
cd /Users/altairbilalov/Documents/mask-prep

# Инициализировать git-репозиторий
git init

# Добавить все файлы
git add .

# Создать первый коммит
git commit -m "Initial commit: MESK Prep application"
```

### 2. Создание репозитория на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "+" → "New repository"
3. Назовите репозиторий `mesk-prep`
4. Оставьте публичным
5. Не инициализируйте README (уже есть)
6. Нажмите "Create repository"

### 3. Привязка и пуш

```bash
# Добавить удаленный репозиторий (замените USERNAME на ваш)
git remote add origin https://github.com/USERNAME/mesk-prep.git

# Отправить код
git branch -M main
git push -u origin main
```

### 4. Настройка GitHub Pages (опционально)

Для публикации сайта:

1. В репозитории зайдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. Сохраните — сайт будет доступен по адресу `https://username.github.io/mesk-prep`
