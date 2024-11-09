import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UpdateProfileDto } from '../dto/profile.js'
import User from '#models/user'

@inject()
export default class ProfileService {
  constructor(private readonly ctx: HttpContext) {}

  async view() {
    const user = this.ctx.auth.getUserOrFail()

    await this.loadRelationships(user)
    return { user }
  }

  async update(payload: UpdateProfileDto) {
    const user = this.ctx.auth.getUserOrFail()

    console.log(payload)
    if (payload.firstName) user.firstName = payload.firstName
    if (payload.lastName) user.lastName = payload.lastName

    if (user.$dirty) {
      await user.save()
    }

    await this.loadRelationships(user)

    return user
  }

  private async loadRelationships(user: User) {
    await user.load('emails')
    await user.load('phoneNumbers')
    await user.loadCount('polls').loadCount('votes')
  }
}
