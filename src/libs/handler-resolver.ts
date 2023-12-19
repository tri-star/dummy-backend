// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
}
