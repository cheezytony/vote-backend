import type { HttpContext } from '@adonisjs/core/http'
import PollOptionService from '#services/poll_option_service'
import {
  createPollOptionValidator,
  findPollOptionsValidator,
  updatePollOptionValidator,
  viewPollOptionValidator,
} from '#validators/poll_option'
import { inject } from '@adonisjs/core'

@inject()
export default class PollOptionsController {
  constructor(private readonly pollOptionService: PollOptionService) {}

  async index({ request }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(findPollOptionsValidator)
    return this.pollOptionService.list(params.pollId, payload)
  }

  async show({ request }: HttpContext) {
    const { params } = await request.validateUsing(viewPollOptionValidator)
    return this.pollOptionService.view(params.id)
  }

  async store({ request, response }: HttpContext) {
    const { params, ...payload} = await request.validateUsing(createPollOptionValidator)
    return response.created(await this.pollOptionService.create(params.pollId, payload))
  }

  async update({ request }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(updatePollOptionValidator)
    return this.pollOptionService.update(params.id, payload)
  }

  async destroy({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(viewPollOptionValidator)
    await this.pollOptionService.delete(params.id)
    return response.noContent()
  }
}
