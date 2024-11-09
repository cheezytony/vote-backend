import { MultipartFile } from '@adonisjs/core/bodyparser'

export interface UpdateProfileDto {
  avatar?: MultipartFile
  firstName?: string
  lastName?: string
}
