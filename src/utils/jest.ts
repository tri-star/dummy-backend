import z from 'zod'

const responseSchema = z.object({
  statusCode: z.number(),
  body: z.string(),
})

export function parseHandlerJsonResponse<T>(response: unknown) {
  const parsedResponse = responseSchema.parse(response)

  return {
    statusCode: parsedResponse.statusCode,
    body: JSON.parse(parsedResponse.body ?? '') as T,
  }
}
