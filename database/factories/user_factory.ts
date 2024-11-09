import factory from '@adonisjs/lucid/factories'
import User, { UserStatus } from '#models/user'
import { EmailFactory } from './email_factory.js'
import { PhoneNumberFactory } from './phone_number_factory.js'
import { PollFactory } from './poll_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
      firstName,
      lastName,
      password: 'password',
      status: faker.helpers.arrayElement(Object.keys(UserStatus)) as UserStatus,
    }
  })

  .state('active', (user) => (user.status = UserStatus.ACTIVE))
  .state('inactive', (user) => (user.status = UserStatus.INACTIVE))

  .relation('emails', () => EmailFactory)
  .relation('phoneNumbers', () => PhoneNumberFactory)
  .relation('polls', () => PollFactory)

  .build()
