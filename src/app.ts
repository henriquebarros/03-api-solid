import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'henrique barros',
    email: 'henriquebarros@live.com',
  },
})

export const app = fastify()
