import factory from '@adonisjs/lucid/factories'
import PhoneNumber from '#models/phone'

export const PhoneNumberFactory = factory
  .define(PhoneNumber, async ({ faker }) => {
    return {
      number: faker.string.numeric(10),
      countryCode: faker.string.numeric(3),
      isActive: false,
    }
  })

  .state('active', (phoneNumber) => (phoneNumber.isActive = true))
  .state('inactive', (phoneNumber) => (phoneNumber.isActive = false))

  .build()
