import vine from '@vinejs/vine'
import { paginationValidator } from './pagination.js'

export const findVotesValidator = vine.compile(
  vine.object({
    ...paginationValidator.getProperties(),

    reference: vine.string().escape().optional(),
    pollOptionId: vine.string().optional(),
    status: vine.string().optional(),
    userId: vine.string().optional(),
    
    params: vine.object({
      pollId: vine.string().uuid(),
    })
  })
)

export const viewVoteValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string(),
    }),
  })
)

export const createVoteValidator = vine.compile(
  vine.object({
    pollOptionId: vine.string().uuid().escape(),

    params: vine.object({
      pollId: vine.string().uuid(),
    })
  })
)

export const updateVoteValidator = vine.compile(
  vine.object({
    pollOptionId: vine.string().uuid().escape(),

    params: vine.object({
      id: vine.string().uuid(),
    }),
  })
)
