# AI Mastery Platform — Этап 3: Полный React App

## Структура проекта
```
ai-mastery-app/
├── src/
│   ├── lib/
│   │   ├── supabase.js        # Supabase клиент
│   │   └── notion.js          # Notion API клиент
│   ├── hooks/
│   │   ├── useAuth.js         # Авторизация через Telegram
│   │   ├── useProgress.js     # Прогресс пользователя
│   │   └── useLessons.js      # Загрузка уроков
│   ├── pages/
│   │   ├── Home.jsx           # Главная / список уровней
│   │   ├── Lesson.jsx         # Страница урока
│   │   ├── Cabinet.jsx        # Личный кабинет
│   │   └── Paywall.jsx        # Экран подписки
│   ├── components/
│   │   ├── LevelCard.jsx      # Карточка уровня
│   │   ├── LessonItem.jsx     # Элемент урока в списке
│   │   ├── ProgressBar.jsx    # Прогресс-бар
│   │   └── Nav.jsx            # Навигация
│   └── App.jsx                # Роутер
├── .env.example               # Переменные окружения
└── package.json
```

## Установка
```bash
npm install
cp .env.example .env
# Заполни .env своими ключами
npm run dev
```

## Переменные окружения (.env)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_NOTION_TOKEN=secret_...
```

## Деплой на Vercel
```bash
npm install -g vercel
vercel --prod
```
