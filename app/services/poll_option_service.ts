import PollOption from '#models/poll_option'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { generateReference } from '../../utils/string.js'
import Poll from '#models/poll'
import BadRequestException from '#exceptions/bad_request_exception'
import { PaginationParameters } from '#types/pagination.js'
import { CreatePollOptionDto, UpdatePollOptionDto } from '../dto/poll_option.js'
import { paginateModel } from '../../utils/pagination.js'

@inject()
export default class PollOptionService {
  constructor(private readonly ctx: HttpContext) {}

  async list(
    pollId: string,
    {
      reference,
      status,
      sortBy,
      order = 'asc',
      votesGreaterThanOrEqual,
      votesLessThanOrEqual,
      ...payload
    }: PaginationParameters<{
      reference?: string
      status?: string
      votesGreaterThanOrEqual?: number
      votesLessThanOrEqual?: number
    }>
  ) {
    await this.ctx.bouncer.with('PollOptionPolicy').authorize('list')

    const [existingPoll] = await Poll.query().where('id', pollId).count('* as total')
    if (existingPoll.$extras.total < 1) {
      throw new BadRequestException('Invalid pollId specified')
    }

    const query = PollOption.query()
      .where('pollId', pollId)
      .where((query) => {
        if (reference) {
          query.where({ reference })
        }
        if (status) {
          query.where({ status })
        }
        if (votesGreaterThanOrEqual) {
          query.has('votes', '>=', votesGreaterThanOrEqual)
        }
        if (votesLessThanOrEqual) {
          query.has('votes', '<=', votesLessThanOrEqual)
        }
      })
      .withCount('votes')

    if (sortBy === 'votesCount') {
      const orderQuery = `(SELECT COUNT(*) FROM votes where votes.poll_option_id = poll_options.id) ${order}`
      query.orderByRaw(orderQuery)
    }

    return paginateModel(query, {
      ...payload,
      ...(sortBy !== 'votesCount' ? { sortBy, order } : {}),
    })
  }

  async create(pollId: string, { description, name }: CreatePollOptionDto) {
    const poll = await Poll.findOrFail(pollId)

    await this.ctx.bouncer.with('PollOptionPolicy').authorize('create', poll)

    const pollOption = await PollOption.create({
      description,
      name,
      pollId,
      reference: await generateReference('polls'),
    })

    return { pollOption, poll }
  }

  async view(idOrReference: string) {
    await this.ctx.bouncer.with('PollOptionPolicy').authorize('view')

    return {
      pollOption: await PollOption.query()
        .preload('poll', (poll) => poll.preload('user').withCount('votes'))
        .withCount('votes')
        .where((query) => {
          query.orWhere('id', idOrReference).orWhere('reference', idOrReference)
        })
        .firstOrFail(),
    }
  }

  async update(pollOptionId: string, { description, name }: UpdatePollOptionDto) {
    const pollOption = await this.getPollOptionForModification(pollOptionId)

    await this.ctx.bouncer.with('PollOptionPolicy').authorize('update', pollOption, pollOption.poll)

    if (name) {
      pollOption.name = name
    }
    if (description) {
      pollOption.description = description
    }

    return { pollOption: await pollOption.save() }
  }

  async delete(pollOptionId: string) {
    const pollOption = await this.getPollOptionForModification(pollOptionId)

    await this.ctx.bouncer.with('PollOptionPolicy').authorize('delete', pollOption, pollOption.poll)

    await pollOption.delete()
  }

  private async getPollOptionForModification(pollOptionId: string) {
    const pollOption = await PollOption.query()
      .preload('poll')
      .where('id', pollOptionId)
      .firstOrFail()

    return pollOption
  }
}
