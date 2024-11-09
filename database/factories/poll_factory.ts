import factory from '@adonisjs/lucid/factories'
import Poll, { PollStatus } from '#models/poll'
import { PollOptionFactory } from './poll_option_factory.js'
import { DateTime } from 'luxon'

export const PollFactory = factory
  .define(Poll, async ({ faker }) => {
    const products = Array(faker.number.int({ min: 2, max: 5 }))
      .fill(0)
      .map(() => {
        return [faker.vehicle.manufacturer(), faker.vehicle.model()]
      })

    const formatter = new Intl.ListFormat('en-NG', { type: 'disjunction' })
    const name = formatter.format(products.map((product) => product.join(' '))) + '?'

    return {
      name,
      description: faker.commerce.productDescription(),
      reference: faker.string.alphanumeric({ length: { max: 16, min: 16 } }),
      status: faker.helpers.arrayElement(Object.keys(PollStatus)) as PollStatus,
      expiresAt: DateTime.fromJSDate(faker.date.soon()),
      canChangeOption: faker.datatype.boolean(),
    }
  })

  .state('open', (poll) => (poll.status = PollStatus.OPEN))
  .state('closed', (poll) => (poll.status = PollStatus.CLOSED))

  .relation('options', () => PollOptionFactory)

  .build()
