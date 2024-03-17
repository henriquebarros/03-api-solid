import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBodyShema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodyShema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // usuário perde a conexão se após sete dias de inatividade
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // Define quais rotas terão acesso ao cookie; neste caso, todas podem ler o valor do cookie.
        secure: true, // Define se o cookie será criptografado através do HTTPS.
        sameSite: true, // Define que o cookie só será acessível dentro do domínio, ou seja, no mesmo site
        httpOnly: true, // Define que o cookie só será acessível no contexto da requisição, não ficando disponível no navegador do cliente.
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
