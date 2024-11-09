import vine from '@vinejs/vine'
import { paginationValidator } from './pagination.js'
import { PollStatus } from '#models/poll'

export const findPollsValidator = vine.compile(
  vine.object({
    ...paginationValidator.getProperties(),

    status: vine.string().in(Object.keys(PollStatus)).nullable().optional(),
    userId: vine.string().optional(),
    votesGreaterThanOrEqual: vine.number().positive().optional(),
    votesLessThanOrEqual: vine.number().positive().optional(),
  })
)

export const createPollValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(80).escape(),
    description: vine.string().maxLength(255).escape(),
    options: vine
      .array(
        vine.object({
          name: vine.string().maxLength(80).escape(),
          description: vine.string().maxLength(255).escape().nullable().optional(),
        })
      )
      .minLength(2)
      .maxLength(50),
  })
)

export const viewPollValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.string().uuid(),
    }),
  })
)

export const updatePollValidator = vine.compile(
  vine.object({
    name: vine.string().maxLength(80).escape().optional(),
    description: vine.string().maxLength(255).escape().optional(),
    status: vine.string().in(Object.keys(PollStatus)).nullable().optional(),
    params: vine.object({
      id: vine.string().uuid(),
    }),
  })
)
