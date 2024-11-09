import vine from '@vinejs/vine'

export const updateProfileValidator = vine.compile(
  vine.object({
    firstName: vine.string().alpha().optional(),
    lastName: vine.string().alpha().optional(),
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png'],
      })
      .optional(),
  })
)
