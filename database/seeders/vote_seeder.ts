import Vote from '#models/vote'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class extends BaseSeeder {
  async run() {
    // let count = 0
    await this.chunk(
      Vote.query()
        .preload('pollOption', (option) => option.preload('poll'))
        .where((query) => {
          query.whereNull('pollId').orWhereNull('userId')
        }),
      async (votes) => {
        await Promise.all(votes.map((vote) => {
          // console.log(++count)
          vote.pollId = vote.pollOption.pollId
          vote.userId = vote.pollOption.poll.userId
          return vote.save()
        }))
      }
    )
  }

  private async chunk(
    query: ModelQueryBuilderContract<typeof Vote, Vote>,
    callback: (
      data: Vote[],
      props: { total: number; totalPages: number; currentPage: number }
    ) => Promise<void>,
    chunkSize = 10
  ) {
    let currentPage = 0
    const total = Number((await query.clone().count('* as total'))?.[0].$extras.total || 0)
    const totalPages = Math.ceil(total / chunkSize)

    const chunks: Vote[][] = []
    while (currentPage < totalPages) {
      const chunk = await query
        .limit(chunkSize)
        .offset(currentPage * chunkSize)
        .limit(chunkSize)

      chunks.push(chunk)

      currentPage++
    }

    for await (const chunk of chunks) {
      await callback(chunk, { total, totalPages, currentPage })
    }
  }
}
