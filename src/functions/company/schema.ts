export const createCompanySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    prefecture: {
      type: 'string',
    },
    address1: {
      type: 'string',
      description: '市区町村',
    },
    address2: {
      type: 'string',
      description: '番地',
    },
    address3: {
      type: 'string',
      description: 'アパート',
      nullable: true,
    },
    phone: {
      type: 'string',
    },
    canUseFeatureA: {
      type: 'boolean',
      default: false,
    },
    canUseFeatureB: {
      type: 'boolean',
      default: false,
    },
    canUseFeatureC: {
      type: 'boolean',
      default: false,
    },
  },
  required: ['name', 'postalCode', 'prefecture', 'address1', 'address2', 'phone'],
  additionalProperties: false,
}

export const updateCompanySchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    prefecture: {
      type: 'string',
    },
    address1: {
      type: 'string',
      description: '市区町村',
    },
    address2: {
      type: 'string',
      description: '番地',
    },
    address3: {
      type: 'string',
      description: 'アパート',
      nullable: true,
    },
    phone: {
      type: 'string',
    },
    canUseFeatureA: {
      type: 'boolean',
    },
    canUseFeatureB: {
      type: 'boolean',
    },
    canUseFeatureC: {
      type: 'boolean',
    },
  },
  required: [
    'name',
    'postalCode',
    'prefecture',
    'address1',
    'address2',
    'phone',
    'canUseFeatureA',
    'canUseFeatureB',
    'canUseFeatureC',
  ],
  additionalProperties: false,
}
