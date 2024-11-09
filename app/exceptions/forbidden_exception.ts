import { Exception } from '@adonisjs/core/exceptions'

export default class ForbiddenException extends Exception {
  static status = 500
}