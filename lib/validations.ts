import { z } from 'zod'

export const createRequestSchema = z.object({
  route_from: z.string().min(1, 'Откуда обязательно'),
  route_to: z.string().min(1, 'Куда обязательно'),
  cargo_description: z.string().min(1, 'Описание груза обязательно'),
  wagon_type: z.enum(['крытый', 'полувагон', 'платформа', 'цистерна', 'хоппер']),
  wagon_count: z.number().min(1, 'Количество вагонов должно быть больше 0'),
  loading_date: z.string().min(1, 'Дата погрузки обязательна'),
  target_price: z.number().min(0, 'Целевая цена должна быть положительной'),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>