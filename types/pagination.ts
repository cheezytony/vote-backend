import { CustomPaginationParameters } from '../utils/pagination.js'

export type PaginationParameters<TProperties = unknown> = CustomPaginationParameters & TProperties
