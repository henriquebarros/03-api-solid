import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // garante que inicialização foi concluída antes de executar os testes
  })

  afterAll(async () => {
    await app.close() // garante que a aplicação foi encerrada após executar os testes
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '859999999999',
        latitude: -3.7111866,
        longitude: -38.5661568,
      })

    await request(app.server)
      .post('/gyms')

      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '859999999999',
        latitude: -3.7111866,
        longitude: -39.5661568,
      })
    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.7111866,
        longitude: -38.5661568,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
