import factory from '@adonisjs/lucid/factories'
import Email from '#models/email'

export const EmailFactory = factory
  .define(Email, async ({ faker }) => {
    return {
      address: faker.internet.email().toLowerCase(),
      isActive: false,
    }
  })

  .state('active', (email) => (email.isActive = true))
  .state('inactive', (email) => (email.isActive = false))

  .build()
