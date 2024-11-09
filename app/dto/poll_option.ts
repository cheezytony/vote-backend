export interface CreatePollOptionDto {
  name: string
  description?: string | null
}

export interface UpdatePollOptionDto extends Partial<Omit<CreatePollOptionDto, 'pollId'>> {}
