import stringHelpers from '@adonisjs/core/helpers/string'
import db from '@adonisjs/lucid/services/db'

export const generateReference = async (tableName: string, references?: string[]) => {
  const referenceExists = async (reference: string) => {
    const [{ total }] = await db.from(tableName).where({ reference }).count({ total: '*' })
    return Number(total) > 0
  }
  const createReference = () => stringHelpers.random(16)

  let reference = createReference()

  while (references?.includes(reference) || (await referenceExists(reference))) {
    reference = createReference()
  }

  return reference
}
