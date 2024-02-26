import AWSXRay from 'aws-xray-sdk-core'

export function createSegment(name: string) {
  return new AWSXRay.Segment(name)
}

export async function traceAsync<T>(
  segment: AWSXRay.Segment,
  traceName: string,
  callback: () => Promise<T>,
): Promise<T> {
  segment.addNewSubsegment(traceName)

  const result = await new Promise<T>((resolve, reject) => {
    void AWSXRay.captureAsyncFunc(
      traceName,
      async (subsegment) => {
        try {
          const result = await callback()
          resolve(result)
        } catch (e) {
          subsegment?.addError(e as Error)
          reject(e)
        } finally {
          subsegment?.close()
        }
      },
      segment,
    )
  })
  return result
}
