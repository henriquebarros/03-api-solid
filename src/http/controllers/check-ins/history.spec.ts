import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in History (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // garante que inicialização foi concluída antes de executar os testes
  })

  afterAll(async () => {
    await app.close() // garante que a aplicação foi encerrada após executar os testes
  })

  it('should be able to list the history of check-ins', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const user = await prisma.user.findFirstOrThrow() // métdo que busco o primeiro usuário cadastrado no banco
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -3.7111866,
        longitude: -38.5661568,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })
    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})
