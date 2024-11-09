import VoteService from '#services/vote_service'
import {
  createVoteValidator,
  findVotesValidator,
  updateVoteValidator,
  viewVoteValidator,
} from '#validators/vote'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class VotesController {
  constructor(private readonly voteService: VoteService) {}

  async index({ request }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(findVotesValidator)
    return this.voteService.list(params.pollId, payload)
  }

  async show({ request }: HttpContext) {
    const { params } = await request.validateUsing(viewVoteValidator)
    return this.voteService.view(params.id)
  }

  async store({ request, response }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(createVoteValidator)
    return response.created(await this.voteService.create(params.pollId, payload))
  }

  async update({ request }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(updateVoteValidator)
    return this.voteService.update(params.id, payload)
  }
}
