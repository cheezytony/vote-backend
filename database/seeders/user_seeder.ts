import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await UserFactory.with('emails', 1, (email) => email.apply('active'))
      .with('phoneNumbers', 1, (phoneNumber) => phoneNumber.apply('active'))
      .with('polls', 2, (poll) => poll.with('options', 3, (option) => option.with('votes', 5)))
      .createMany(5)
  }
}
