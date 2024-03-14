import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export const gymsRoutes = async (app: FastifyInstance) => {
  // Todas as rotas contidas neste arquivo de rotas serão submetidas ao middleware de autenticação.
  app.addHook('onRequest', verifyJWT)

  // rotas a partir dessa linha somente usuários autenticados
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}
