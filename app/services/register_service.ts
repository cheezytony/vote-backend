import User, { UserStatus } from '#models/user'
import { inject } from '@adonisjs/core'
import SessionService from './session_service.js'
import PhoneNumber from '#models/phone'
import Email from '#models/email'
import { HasMany } from '@adonisjs/lucid/types/relations'

@inject()
export class RegisterService {
  constructor(private readonly sessionService: SessionService) {}

  async create(payload: CreateAccountDto) {
    const user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
      status: UserStatus.ACTIVE
    })

    const email = await Email.create({
      userId: user.id,
      address: payload.email,
      isActive: true,
    })

    const phone = await PhoneNumber.create({
      userId: user.id,
      countryCode: payload.phone.countryCode,
      number: payload.phone.number,
      isActive: true,
    })

    const token = await this.sessionService.createFromUser(user)

    user.emails = [email] as HasMany<typeof Email>
    user.phoneNumbers = [phone] as HasMany<typeof PhoneNumber>

    return {
      user,
      token,
    }
  }
}

interface CreateAccountDto {
  firstName: string
  lastName: string
  email: string
  phone: {
    countryCode: string
    number: string
  }
  password: string
}
