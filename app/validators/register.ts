import vine from '@vinejs/vine'

export const createAccountValidator = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    email: vine
      .string()
      .email()
      .unique(async (db, email) => {
        const [{ total }] = await db.from('emails').where({ address: email }).count('id as total')
        return Number(total || 0) === 0
      }),
    phone: vine.object({
      number: vine.string().mobile({ strictMode: false }),
      countryCode: vine.string(),
    }),
    password: vine.string(),
  })
)
