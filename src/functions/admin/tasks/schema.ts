export const createTaskSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    companyId: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'HOLD', 'DONE'],
    },
    reasonCode: {
      type: ['string', 'null'],
      enum: ['POSTPONED', 'INVALID', 'DUPLICATED', 'DONE'],
    },
    createdUserId: {
      type: 'string',
    },
  },
  required: ['companyId', 'title', 'description', 'status', 'createdUserId'],
  additionalProperties: false,
}

export const updateTaskSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    companyId: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    status: {
      type: 'string',
      enum: ['BACKLOG', 'TODO', 'IN_PROGRESS', 'HOLD', 'DONE'],
    },
    reasonCode: {
      type: ['string', 'null'],
      enum: ['POSTPONED', 'INVALID', 'DUPLICATED', 'DONE'],
    },
  },
  required: ['companyId', 'title', 'description', 'status'],
  additionalProperties: false,
}
