import type { HttpContext } from '@adonisjs/core/http'

import PollService from '#services/poll_service'
import { inject } from '@adonisjs/core'
import {
  createPollValidator,
  findPollsValidator,
  updatePollValidator,
  viewPollValidator,
} from '#validators/poll'

@inject()
export default class PollsController {
  constructor(private readonly pollService: PollService) {}

  async index({ request }: HttpContext) {
    const payload = await request.validateUsing(findPollsValidator)
    return this.pollService.list(payload)
  }

  async show({ request }: HttpContext) {
    const { params } = await request.validateUsing(viewPollValidator)
    return this.pollService.view(params.id)
  }

  async store({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(createPollValidator)
    return response.created(await this.pollService.create(payload, auth.user!))
  }

  async update({ request }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(updatePollValidator)
    return this.pollService.update(params.id, payload)
  }
}
