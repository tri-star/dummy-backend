export const formatJSONResponse = (response: Record<string, unknown>, statusCode: number = 200) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  }
}

export const formatJSONUserErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
  }
}

export const formatJSONErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(response),
  }
}
