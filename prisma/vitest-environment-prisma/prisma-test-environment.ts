import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


function generateDatabaseURL(schema: string){
  if(!process.env.DATABASE_URL){
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema',schema)

  return url.toString()
}


export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    /*
      a propriedade 'deploy', evita que o Prisma compare as migrações com o banco de dados para 
      verificar se houve alterações antes de aplicá-las. Em vez disso, simplesmente aplicando as migrações 
      diretamente, sem esse processo de comparação.

    */ 
    execSync('npx prisma migrate deploy')
    return {
      async teardown() {
        //console.log('Teardown')
        //deleta base se houver
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)

        //encerra a conexão com banco de dados
        await prisma.$disconnect()
      },
    }
  },
  transformMode: 'ssr',
}
