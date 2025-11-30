# RailMatch Vol. 2

Логистическая платформа, соединяющая грузоотправителей и перевозчиков для железнодорожных перевозок, построенная на Supabase и современных веб-технологиях.

## Обзор

RailMatch - это B2B платформа, которая способствует соединению компаний, нуждающихся в перевозке грузов по железной дороге (грузоотправители), с поставщиками железнодорожных перевозок (перевозчики). Платформа позволяет грузоотправителям размещать заявки на перевозку грузов, а перевозчикам - подавать конкурентные предложения.

## Технологический стек

- **База данных**: Supabase (PostgreSQL с возможностями реального времени)
- **Бэкенд**: Supabase (Аутентификация, База данных, Хранилище)
- **Фронтенд**: Next.js 16 с TypeScript
- **Язык**: TypeScript
- **Стили**: Tailwind CSS 4
- **Иконки**: Lucide React
- **Форматирование**: ESLint & Prettier

## Структура базы данных

### Основные таблицы

#### `profiles`
Пользовательские профили с контролем доступа на основе ролей.
- **Колонки**: `id`, `email`, `full_name`, `role`, `company_name`, `phone`, временные метки
- **Роли**: `shipper` (Заказчик), `carrier` (Исполнитель), `admin`
- **Доступ**: Пользователи могут просматривать/редактировать только свой профиль; администраторы могут просматривать все

#### `requests`
Заявки на перевозку грузов, размещаемые грузоотправителями.
- **Колонки**: `id`, `shipper_id`, `route_from`, `route_to`, `cargo_description`, `cargo_weight`, `wagon_type`, `wagon_count`, `loading_date`, `unloading_date`, `target_price`, `status`, `additional_requirements`, временные метки
- **Статусы**: `open`, `in_progress`, `completed`, `cancelled`
- **Доступ**: Публичный доступ на чтение, грузоотправители могут создавать/обновлять свои заявки

#### `bids`
Конкурентные предложения, подаваемые перевозчиками на конкретные заявки.
- **Колонки**: `id`, `request_id`, `owner_id`, `amount`, `notes`, `status`, `valid_until`, временные метки
- **Статусы**: `pending`, `accepted`, `rejected`, `withdrawn`
- **Доступ**: Пользователи могут видеть свои предложения и предложения на своих заявках; перевозчики могут создавать предложения, грузоотправители могут принимать/отклонять

#### `messages`
Общение между пользователями, связанное с предложениями и заявками.
- **Колонки**: `id`, `bid_id`, `request_id`, `sender_id`, `body`, `read_at`, временные метки
- **Доступ**: Пользователи могут видеть только сообщения, которые они отправили или получили (участники предложений или владелец заявки)

## Начало работы

### Предварительные требования

- Node.js 18+ и npm/yarn
- Аккаунт Supabase и проект
- Git

### Установка

1. **Клонирование репозитория**
A logistics platform connecting shippers and carriers for rail cargo transport, built with Supabase and modern web technologies.

## Overview

RailMatch is a B2B platform that facilitates the connection between companies needing to transport cargo by rail (shippers) and rail transport providers (carriers). The platform allows shippers to post cargo requests and carriers to submit competitive bids.

## Tech Stack

- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Backend**: Supabase (Authentication, Database, Storage)
- **Frontend**: Next.js 14 with TypeScript
- **Language**: TypeScript

## Database Schema

### Core Tables

#### `profiles`
User profiles with role-based access control.
- **Columns**: `id`, `email`, `full_name`, `role`, `company_name`, `phone`, timestamps
- **Roles**: `shipper`, `carrier`, `admin`
- **Access**: Users can only view/edit their own profile; admins can view all

#### `requests`
Cargo transport requests posted by shippers.
- **Columns**: `id`, `shipper_id`, `route_from`, `route_to`, `cargo_description`, `cargo_weight`, `wagon_type`, `wagon_count`, `loading_date`, `unloading_date`, `target_price`, `status`, `additional_requirements`, timestamps
- **Status**: `open`, `in_progress`, `completed`, `cancelled`
- **Access**: Public read access, shippers can create/update their own requests

#### `bids`
Competitive bids submitted by carriers for specific requests.
- **Columns**: `id`, `request_id`, `owner_id`, `amount`, `notes`, `status`, `valid_until`, timestamps
- **Status**: `pending`, `accepted`, `rejected`, `withdrawn`
- **Access**: Users can see their own bids and bids on their requests; carriers can create bids, shippers can accept/reject

#### `messages`
Communication between users related to bids and requests.
- **Columns**: `id`, `bid_id`, `request_id`, `sender_id`, `body`, `read_at`, timestamps
- **Access**: Users can only see messages they sent or received (bid participants or request owner)

### Relationships

```
profiles (1) ←→ (N) requests (shipper_id)
profiles (1) ←→ (N) bids (owner_id)
requests (1) ←→ (N) bids (request_id)
bids (1) ←→ (N) messages (bid_id)
requests (1) ←→ (N) messages (request_id)
profiles (1) ←→ (N) messages (sender_id)
```

## Security Model

The platform implements Row Level Security (RLS) with the following policies:

- **Public Data**: Requests are publicly readable to create an open job market
- **Private Data**: Bids and messages are restricted to participants only
- **Role-Based Access**: Different permissions for shippers, carriers, and admins
- **Ownership**: Users can only modify their own data unless they have admin privileges

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd railmatch.vol2
   ```

2. **Установка зависимостей**
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Настройка переменных окружения**
   ```bash
   cp .env.example .env.local
   ```
   Обновите `.env.local` с вашими учетными данными проекта Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL вашего проекта Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Ваш анонимный ключ Supabase

4. **Настройка базы данных**
   
   Если вы начинаете с нуля:
   ```bash
   # Отправить начальную схему в ваш проект Supabase
   npm run db:push
   ```
   
   Или если вам нужно сбросить:
3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Supabase project credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. **Set up the database**
   
   If you're starting fresh:
   ```bash
   # Push the initial schema to your Supabase project
   npm run db:push
   ```
   
   Or if you need to reset:
   ```bash
   npm run db:reset
   ```

5. **Генерация TypeScript типов**
5. **Generate TypeScript types**
   ```bash
   npm run db:generate-types
   ```

### Разработка
### Development

```bash
# Start the development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Database Management

### Migration Commands

```bash
# Push local changes to remote database
npm run db:push

# Reset database to match local schema
npm run db:reset

# Show differences between local and remote
npm run db:diff

# Generate TypeScript types from database schema
npm run db:generate-types
```

### Schema Changes

1. Create new migration files in `supabase/migrations/`
2. Use timestamp naming convention: `YYYYMMDDHHMMSS_description.sql`
3. Test locally with `npm run db:diff`
4. Apply changes with `npm run db:push`

## API Usage

The Supabase client is pre-configured in `lib/supabase.ts` with TypeScript types:

```typescript
import { supabase, Database, Profile, Request } from '@/lib/supabase'

// Example: Fetch public requests
const { data: requests, error } = await supabase
  .from('requests')
  .select('*')
  .eq('status', 'open')

// Example: Create a new request
const { data: newRequest, error } = await supabase
  .from('requests')
  .insert({
    shipper_id: userId,
    route_from: 'Berlin',
    route_to: 'Hamburg',
    cargo_description: 'Electronics',
    wagon_type: 'covered',
    wagon_count: 2,
    loading_date: '2024-02-01'
  })
```

## Project Structure

```
railmatch.vol2/
├── lib/
│   ├── supabase.ts          # Supabase client and types
│   └── database.types.ts    # Generated TypeScript types
├── supabase/
│   ├── migrations/          # Database migration files
│   └── config.json          # Supabase configuration
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md               # This file
```

## Key Features

### For Shippers
- Post cargo transport requests with detailed specifications
- Browse and compare competitive bids from carriers
- Communicate directly with carriers through messages
- Track request status from open to completion

### For Carriers
- Browse available cargo requests in real-time
- Submit competitive bids with detailed proposals
- Communicate with shippers to clarify requirements
- Manage bid status and track accepted contracts

### For Platform Administrators
- User management and role assignment
- Monitor platform activity and transactions
- Resolve disputes and provide support
- Access comprehensive analytics and reporting

## Security Considerations

- **Row Level Security**: All database access is controlled by RLS policies
- **Authentication**: Supabase Auth handles user authentication securely
- **Input Validation**: Database constraints and application-level validation
- **Privacy**: Private data (bids, messages) is only accessible to authorized participants
- **Audit Trail**: Automatic timestamps track all data changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Test database changes with migration commands
5. Submit a pull request

## License

[Add your license information here]
# B2B Platform - Next.js 15 with TypeScript & Tailwind CSS

```bash
# Запустить сервер разработки
npm run dev

# Проверка типов
npm run type-check

# Линтинг
npm run lint
```

## Управление базой данных

### Команды миграции

```bash
# Отправить локальные изменения в удаленную базу данных
npm run db:push

# Сбросить базу данных для соответствия локальной схеме
npm run db:reset

# Показать различия между локальной и удаленной
npm run db:diff

# Сгенерировать TypeScript типы из схемы базы данных
npm run db:generate-types
```

### Изменения схемы

1. Создайте новые файлы миграции в `supabase/migrations/`
2. Используйте соглашение об именовании с временной меткой: `YYYYMMDDHHMMSS_description.sql`
3. Протестируйте локально с `npm run db:diff`
4. Примените изменения с `npm run db:push`

## Структура проекта

```
railmatch.vol2/
├── app/
│   ├── auth/                 # Страницы аутентификации
│   ├── dashboard/            # Защищенные дашборды
│   ├── layout.tsx           # Корневой layout
│   ├── page.tsx             # Главная страница
│   └── globals.css          # Глобальные стили
├── components/
│   ├── auth/                # Компоненты аутентификации
│   ├── ui/                  # Базовые UI компоненты
│   ├── Navigation.tsx       # Навигация
│   ├── Hero.tsx            # Hero секция
│   └── Footer.tsx          # Footer
├── lib/
│   ├── supabase.ts          # Supabase клиент и типы
│   ├── auth.ts              # Хелперы аутентификации
│   └── database.types.ts    # Сгенерированные TypeScript типы
├── supabase/
│   ├── migrations/          # Файлы миграций базы данных
│   └── config.json          # Конфигурация Supabase
├── middleware.ts            # Middleware для защиты маршрутов
└── .env.example             # Шаблон переменных окружения
```

## Ключевые функции

### Для Грузоотправителей (Заказчиков)
- Размещение заявок на перевозку грузов с детальными спецификациями
- Просмотр и сравнение конкурентных предложений от перевозчиков
- Прямая коммуникация с перевозчиками через сообщения
- Отслеживание статуса заявки от открытой до завершенной

### для Перевозчиков (Исполнителей)
- Просмотр доступных заявок на перевозку грузов в реальном времени
- Подача конкурентных предложений с детальными предложениями
- Общение с грузоотправителями для уточнения требований
- Управление статусом предложений и отслеживание принятых контрактов

### для Администраторов Платформы
- Управление пользователями и назначение ролей
- Мониторинг активности платформы и транзакций
- Разрешение споров и предоставление поддержки
- Доступ к комплексной аналитике и отчетности

## Соображения безопасности

- **Row Level Security**: Весь доступ к базе данных контролируется политиками RLS
- **Аутентификация**: Supabase Auth безопасно обрабатывает аутентификацию пользователей
- **Валидация входных данных**: Ограничения базы данных и валидация на уровне приложения
- **Конфиденциальность**: Приватные данные (предложения, сообщения) доступны только авторизованным участникам
- **Аудит**: Автоматические временные метки отслеживают все изменения данных