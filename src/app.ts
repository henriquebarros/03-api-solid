import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    // define que o cookie específico não é um cookie assinado, ou seja, que nenhum hash de assinatura foi gerado para ele.
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)
// docker 670d562d00fd
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV === 'dev') {
    console.error(error)
  } else {
    // TODO: Here we should log to on external tool like Datadog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
