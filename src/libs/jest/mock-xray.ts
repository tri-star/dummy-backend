import { jest } from '@jest/globals'

jest.unstable_mockModule('@libs/xray-tracer', () => {
  return {
    createSegment: jest.fn(() => 'mockedSegment'),
    traceAsync: jest.fn(async (_: string, __: string, fn: () => Promise<unknown>) => await fn()),
  }
})
