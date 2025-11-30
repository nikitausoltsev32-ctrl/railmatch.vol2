# RailMatch Vol 2

Платформа для соединения заказчиков и владельцев вагонов для железнодорожных перевозок.

## Функционал

### Для заказчиков (Заказчик)
- **Дашборд заявок**: Просмотр активных и закрытых заявок
- **Создание заявок**: Форма с валидацией для создания новых заявок на перевозку
- **Детали заявки**: Просмотр полученных ставок и возможность принять/отклонить предложения
- **Статусы**: Отслеживание статуса заявок (активна/закрыта)
- **Уведомления**: Успешное/неуспешное выполнение операций

### Для владельцев (Владелец)
- *В разработке*

## Технологический стек

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Next.js Server Actions
- **База данных**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + Lucide React иконки
- **Формы**: React Hook Form + Zod валидация

## Структура проекта

```
├── app/
│   ├── globals.css              # Глобальные стили
│   ├── layout.tsx               # Корневой layout
│   ├── page.tsx                 # Главная страница
│   ├── shipper/
│   │   ├── page.tsx             # Дашборд заказчика
│   │   └── requests/[id]/page.tsx # Детали заявки
│   └── owner/                   # *Будет реализовано*
├── lib/
│   ├── actions.ts               # Server Actions для Supabase
│   ├── supabase.ts              # Конфигурация Supabase
│   └── validations.ts           # Схемы валидации Zod
└── ...конфигурационные файлы
```

## Установка и запуск

1. **Клонирование репозитория**:
   ```bash
   git clone <repository-url>
   cd railmatch.vol2
   ```

2. **Установка зависимостей**:
   ```bash
   npm install
   ```

3. **Настройка Supabase**:
   - Создайте новый проект в [Supabase](https://supabase.com)
   - Создайте таблицы `requests` и `bids` (см. схему ниже)
   - Скопируйте URL и anon ключ
   - Создайте файл `.env.local` и добавьте:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Запуск приложения**:
   ```bash
   npm run dev
   ```

   Приложение будет доступно по адресу `http://localhost:3000`

## Схема базы данных

### Таблица `requests`
```sql
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipper_id UUID NOT NULL,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  wagon_type TEXT NOT NULL,
  wagon_count INTEGER NOT NULL,
  loading_date DATE NOT NULL,
  target_price INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  accepted_owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Таблица `bids`
```sql
CREATE TABLE bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  price INTEGER NOT NULL,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Особенности реализации

### Server Actions
- Используются для работы с Supabase
- Автоматическая ре-валидация кэша при изменении данных
- Обработка ошибок и валидация на сервере

### Валидация форм
- Zod схемы для типобезопасности
- React Hook Form для управления состоянием форм
- Валидация на клиенте и сервере

### UI/UX
- Полностью на русском языке
- Адаптивный дизайн для мобильных устройств
- Индикаторы загрузки и пустые состояния
- Alert banners для уведомлений

## Разработка

- **Линтинг**: `npm run lint`
- **Сборка**: `npm run build`
- **Production**: `npm start`

## Дорожная карта

- [x] Дашборд заказчика
- [x] Создание заявок
- [x] Просмотр ставок и принятие решений
- [ ] Аутентификация пользователей
- [ ] Кабинет владельца вагонов
- [ ] Система уведомлений
- [ ] История транзакций
- [ ] Рейтинг пользователей