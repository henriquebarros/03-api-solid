import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // garante que inicialização foi concluída antes de executar os testes
  })

  afterAll(async () => {
    await app.close() // garante que a aplicação foi encerrada após executar os testes
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -3.7111866,
        longitude: -38.5661568,
      },
    })
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -3.7111866,
        longitude: -38.5661568,
      })

    expect(response.statusCode).toEqual(201)
  })
})
