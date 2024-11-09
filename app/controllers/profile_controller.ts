import type { HttpContext } from '@adonisjs/core/http'

import ProfileService from '#services/profile_service';
import { updateProfileValidator } from '#validators/profile';
import { inject } from '@adonisjs/core';

@inject()
export default class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  async index() {
    return this.profileService.view()
  }

  async update({ request }: HttpContext) {
    const payload = await request.validateUsing(updateProfileValidator)

    return this.profileService.update(payload)
  }
}