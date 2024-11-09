import BadRequestException from '#exceptions/bad_request_exception'
import Poll from '#models/poll'
import PollOption from '#models/poll_option'
import Vote from '#models/vote'
import { PaginationParameters } from '#types/pagination.js'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { generateReference } from '../../utils/string.js'
import VotePolicy from '#policies/vote_policy'
import { CreateVoteDto, UpdateVoteDto } from '../dto/vote.js'
import { paginateModel } from '../../utils/pagination.js'

@inject()
export default class VoteService {
  constructor(protected ctx: HttpContext) {}

  async list(
    pollId: string,
    {
      reference,
      pollOptionId,
      status,
      userId,
      ...payload
    }: PaginationParameters<{
      reference?: string
      pollOptionId?: string
      status?: string
      userId?: string
    }>
  ) {
    await this.ctx.bouncer.with(VotePolicy).authorize('list')

    if (!pollId) {
      throw new BadRequestException('A poll id is required to fetch votes')
    }
    const [existingPoll] = await Poll.query().where('id', pollId).count('* as total')
    if (existingPoll.$extras.total < 1) {
      throw new BadRequestException('Invalid pollId specified')
    }

    return paginateModel(
      Vote.query()
        .where('pollId', pollId)
        .preload('user')
        .preload('pollOption')
        .where((query) => {
          if (reference) {
            query.where({ reference })
          }
          if (userId) {
            query.where({ userId })
          }
          if (pollOptionId) {
            query.where({ pollOptionId })
          }
          if (status) {
            query.where({ status })
          }
        }),
      payload
    )
  }

  async view(idOrReference: string) {
    await this.ctx.bouncer.with(VotePolicy).authorize('view')

    return {
      vote: await Vote.query()
        .preload('poll', (poll) => poll.preload('user').withCount('votes'))
        .preload('pollOption')
        .preload('user')
        .where((query) => {
          query.orWhere('id', idOrReference).orWhere('reference', idOrReference)
        })
        .firstOrFail(),
    }
  }

  async create(pollId: string, { pollOptionId }: CreateVoteDto) {
    const user = this.ctx.auth.getUserOrFail()
    const pollOption = await PollOption.query()
      .where({
        id: pollOptionId,
        pollId,
      })
      .firstOrFail()

    await pollOption.load('poll')
    const poll = pollOption.poll

    await this.ctx.bouncer.with(VotePolicy).authorize('create', poll, pollOption)

    const [{ $extras }] = await Vote.query()
      .where({
        pollId,
        userId: user.id,
      })
      .count('id as total')
    if (Number($extras.total ?? 0) > 0) {
      throw new BadRequestException(
        'This user has already voted on this poll. Please use the update feature to change the selected option.'
      )
    }

    const vote = await Vote.create({
      reference: await generateReference('votes'),
      pollId: pollOption.pollId,
      userId: user.id,
      pollOptionId: pollOptionId,
    })

    return {
      vote,
      poll,
      pollOption,
    }
  }

  async update(voteId: string, { pollOptionId }: UpdateVoteDto) {
    const vote = await Vote.query().preload('poll').where('id', voteId).firstOrFail()
    const poll = vote.poll

    await this.ctx.bouncer.with(VotePolicy).authorize('update', vote, poll, pollOptionId)

    const pollOption = await PollOption.query().where('id', pollOptionId).first()
    if (!pollOption) {
      throw new BadRequestException('The selected poll option is invalid')
    }

    vote.pollOptionId = pollOptionId
    await vote.save()

    await vote.load('pollOption', (pollOption) => pollOption.withCount('votes'))

    return { vote }
  }
}
