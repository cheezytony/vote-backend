export interface CreatePollDto {
  name: string
  description: string
  options: Array<{ name: string; description?: string | null }>
}

export interface UpdatePollDto extends Partial<Omit<CreatePollDto, 'options'>> {
  status?: string | null
}
