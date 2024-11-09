import { BaseModel } from '@adonisjs/lucid/orm'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export const paginateModel = async <Model extends typeof BaseModel>(
  baseQuery: ModelQueryBuilderContract<Model>,
  { page = 1, limit = 10, startDate, endDate, sortBy, order }: CustomPaginationParameters
) => {
  let query = baseQuery.where((currentQuery) => {
    if (startDate && endDate) {
      return currentQuery.whereBetween('createdAt', [startDate, endDate])
    }
    if (startDate) {
      currentQuery.where('createdAt', '>=', startDate)
    }
    if (endDate) {
      currentQuery.where('createdAt', '<=', endDate)
    }
  })

  if (sortBy) {
    query.orderBy(sortBy, order as 'asc' | 'desc')
  }

  return query.paginate(page, limit)
}

export interface CustomPaginationParameters {
  page?: number
  limit?: number
  startDate?: string | Date
  endDate?: string | Date
  sortBy?: string
  order?: string
}

export const chunkModel = async <Model extends typeof BaseModel>(
  query: ModelQueryBuilderContract<Model>,
  callback: (
    data: InstanceType<Model>[],
    props: { total: number; totalPages: number; currentPage: number }
  ) => Promise<void>,
  chunkSize = 10
) => {
  let currentPage = 0
  const [countResult] = await query.clone().count('* as total')
  const total = Number(countResult.$extras.total || 0)
  const totalPages = Math.ceil(total / chunkSize)

  const chunks: InstanceType<Model>[][] = []
  while (currentPage < totalPages) {
    const chunk = await query
      .limit(chunkSize)
      .offset(currentPage * chunkSize)
      .limit(chunkSize)

    chunks.push(chunk)

    currentPage++
  }

  for await (const chunk of chunks) {
    await callback(chunk, { total, totalPages, currentPage })
  }
}
