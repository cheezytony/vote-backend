import vine from '@vinejs/vine'

export const paginationValidator = vine.object({
  page: vine.number().positive().optional(),
  limit: vine.number().positive().optional(),
  sortBy: vine.string().escape().optional(),
  order: vine.string().in(['asc', 'desc', 'ASC', 'DESC']).optional(),
  startDate: vine.date().beforeField('endDate', { compare: 's' }).optional(),
  endDate: vine.date().afterField('startDate', { compare: 's' }).optional(),
})
