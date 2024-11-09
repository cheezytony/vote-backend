import { Exception } from '@adonisjs/core/exceptions'

export default class UnprocessibleEntityException extends Exception {
  static status = 401
  static message = 'Unprocessible Entity'
  static code = 'E_UNPROCESSIBLE_ENTITY'
}
