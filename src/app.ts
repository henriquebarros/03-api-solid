import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)
// docker 670d562d00fd
