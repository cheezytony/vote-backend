import type { HttpContext } from '@adonisjs/core/http'

import { RegisterService } from '#services/register_service'
import { inject } from '@adonisjs/core'
import { createAccountValidator } from '#validators/register'

@inject()
export default class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createAccountValidator)
    return response.created(await this.registerService.create(payload))
  }
}
