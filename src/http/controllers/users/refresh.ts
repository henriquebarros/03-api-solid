import { FastifyRequest, FastifyReply } from 'fastify'

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify({ onlyCookie: true })
  /* 
  onlyCookie: true => onlyCookie: true => para garantir que a autenticação do usuário seja validada exclusivamente com base no cookie, 
  verificando se exite o refreshToken, sem levar em conta informações adicionais do cabeçalho da requisição.
  
  se passar a partir daqui é pq existe...
  */
  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
