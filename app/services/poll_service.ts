import Poll, { PollStatus } from '#models/poll'
import PollOption from '#models/poll_option'
import User from '#models/user'
import { PaginationParameters } from '#types/pagination.js'
import BadRequestException from '#exceptions/bad_request_exception'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import PollPolicy from '#policies/poll_policy'
import { generateReference } from '../../utils/string.js'
import db from '@adonisjs/lucid/services/db'
import { CreatePollDto, UpdatePollDto } from '../dto/poll.js'
import { paginateModel } from '../../utils/pagination.js'

@inject()
export default class PollService {
  constructor(protected ctx: HttpContext) {}

  async list({
    reference,
    status,
    userId,
    sortBy,
    order = 'asc',
    votesGreaterThanOrEqual,
    votesLessThanOrEqual,
    ...payload
  }: PaginationParameters<{
    reference?: string
    status?: string | null
    userId?: string
    votesGreaterThanOrEqual?: number
    votesLessThanOrEqual?: number
  }>) {
    await this.ctx.bouncer.with(PollPolicy).authorize('list')

    const query = Poll.query()
      .withCount('votes')
      .where((query) => {
        if (reference) {
          query.where({ reference })
        }
        if (status) {
          query.where('status', status)
        }
        if (userId) query.where('userId', userId)
        if (votesGreaterThanOrEqual) {
          query.has('votes', '>=', votesGreaterThanOrEqual)
        }
        if (votesLessThanOrEqual) {
          query.has('votes', '<=', votesLessThanOrEqual)
        }
      })
      .preload('user')

    if (sortBy === 'votesCount') {
      const orderQuery = `(SELECT COUNT(*) FROM votes where votes.poll_id = polls.id) ${order}`
      query.orderByRaw(orderQuery)
    }

    return paginateModel(query, {
      ...payload,
      ...(sortBy !== 'votesCount' ? { sortBy, order } : {}),
    })
  }

  async create({ name, description, options: rawOptions }: CreatePollDto, user: User) {
    await this.ctx.bouncer.with(PollPolicy).authorize('create')

    const reference = await generateReference('polls')

    await db.beginGlobalTransaction()

    try {
      const poll = await Poll.create({ name, description, reference, userId: user.id })
      const pollOptions = await this.generateOptions(poll.id, rawOptions)

      await db.commitGlobalTransaction()

      return {
        poll,
        pollOptions,
      }
    } catch (error) {
      await db.rollbackGlobalTransaction()
      throw error
    }
  }

  async view(idOrReference: string) {
    await this.ctx.bouncer.with(PollPolicy).authorize('view')

    return {
      poll: await Poll.query()
        .where((query) => {
          query.orWhere('id', idOrReference).orWhere('reference', idOrReference)
        })
        .preload('user')
        .withCount('votes')
        .firstOrFail(),
    }
  }

  async update(pollId: string, payload: UpdatePollDto) {
    const poll = await Poll.findOrFail(pollId)

    await this.ctx.bouncer.with(PollPolicy).authorize('update', poll, payload)

    if (payload.name) poll.name = payload.name
    if (payload.description) poll.description = payload.description
    if (payload.status) {
      if (poll.status === PollStatus.CLOSED) {
        throw new BadRequestException("Once a poll is closed, it's status CANNOT be changed")
      }

      if (poll.status === PollStatus.OPEN && payload.status === PollStatus.PENDING) {
        throw new BadRequestException('Once a poll is opened, it CANNOT be set back to pending')
      }

      poll.status = payload.status as PollStatus
    }

    if (poll.$isDirty) {
      await poll.save()
    }

    return { poll }
  }

  private async generateOptions(
    pollId: string,
    options: Array<{ name: string; description?: string | null }>
  ) {
    const references: string[] = []
    return PollOption.createMany(
      await Promise.all(
        options.map(async ({ name, description }) => {
          const reference = await generateReference('poll_options', references)
          references.push(reference)
          return {
            name,
            pollId,
            description,
            reference,
          }
        })
      )
    )
  }
}
