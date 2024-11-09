import vine from '@vinejs/vine'
import { paginationValidator } from './pagination.js'
import { PollOptionStatus } from '#models/poll_option'

export const findPollOptionsValidator = vine.compile(
  vine.object({
    ...paginationValidator.getProperties(),

    reference: vine.string().optional(),
    userId: vine.string().optional(),
    status: vine.string().in(Object.keys(PollOptionStatus)).optional(),
    votesGreaterThanOrEqual: vine.number().positive().optional(),
    votesLessThanOrEqual: vine.number().positive().optional(),

    params: vine.object({
      pollId: vine.string().uuid(),
    })
  })
)

export const createPollOptionValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(80).escape(),
    description: vine.string().maxLength(255).escape(),

    params: vine.object({
      pollId: vine.string().uuid(),
    })
  })
)

export const viewPollOptionValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string(),
    }),
  })
)

export const updatePollOptionValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(80).escape().optional(),
    description: vine.string().maxLength(255).escape().optional(),
    status: vine.string().in(Object.keys(PollOptionStatus)).optional(),
    params: vine.object({
      id: vine.string().uuid(),
    }),
  })
)
