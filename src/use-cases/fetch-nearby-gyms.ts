import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGymsUseCaseCaseRequest {
  userLatitude: number
  userLongetude: number
}

interface FetchNearbyGymsUseCaseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCaseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongetude,
  }: FetchNearbyGymsUseCaseCaseRequest): Promise<FetchNearbyGymsUseCaseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongetude,
    })

    return {
      gyms,
    }
  }
}
