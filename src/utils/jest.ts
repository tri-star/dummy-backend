import z from 'zod'

const responseSchema = z.object({
  statusCode: z.number(),
  body: z.string(),
})

export function parseHandlerJsonResponse<T>(response: unknown) {
  const parsedResponse = responseSchema.parse(response)

  let bodyJson
  try {
    bodyJson = JSON.parse(parsedResponse.body ?? '') as T
  } catch (e) {
    // 403などのエラーの際はbodyに非JSONの文字列が格納されるためエラーとしない
    bodyJson = undefined
  }

  return {
    statusCode: parsedResponse.statusCode,
    body: bodyJson,
  }
}
