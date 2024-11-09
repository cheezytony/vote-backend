import { Exception } from '@adonisjs/core/exceptions'

export default class NotFoundException extends Exception {
  static status = 404
  static message?: string | undefined = 'Not Found'
  static code?: string | undefined = 'E_NOT_FOUND'
}
