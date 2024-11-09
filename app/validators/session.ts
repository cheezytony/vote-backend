import vine from '@vinejs/vine'

export const createSessionValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().trim(),
  })
)
