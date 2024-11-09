import { Exception } from '@adonisjs/core/exceptions'

export default class BadRequestException extends Exception {
  static status = 400
  static message = 'Bad Request'
  static code = 'E_BAD_REQUEST'
}