import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // garante que inicialização foi concluída antes de executar os testes
  })

  afterAll(async () => {
    await app.close() // garante que a aplicação foi encerrada após executar os testes
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '859999999999',
        latitude: -3.7111866,
        longitude: -38.5661568,
      })

    expect(response.statusCode).toEqual(201)
  })
})
