export const accountSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    emailConfirmated: {
      type: 'boolean',
    },
  },
  required: ['accessToken', 'name', 'emailConfirmated'],
};
