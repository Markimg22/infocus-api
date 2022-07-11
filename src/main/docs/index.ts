import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'INFOCUS APP',
    description: 'Essa é a documentação da API do projeto INFOCUS',
    version: '1.0.0',
    license: {
      name: 'MIT License',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor Principal',
    },
  ],
  tags: [
    {
      name: 'Login',
      description: 'APIs relacionadas a Login',
    },
  ],
  paths,
  schemas,
  components,
};
