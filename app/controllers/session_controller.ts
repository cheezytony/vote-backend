import SessionService from '#services/session_service'
import { createSessionValidator } from '#validators/session'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createSessionValidator)
    return this.sessionService.createFromCredentials(payload)
  }
}
