export default () => ({
  type: 'application',

  name: 'CRUD Example App',
  description:
    'An example showing how to build a simple full-stack CRUD app with Layr, Boostr, and TypeScript',

  services: {
    frontend: './frontend',
    backend: './backend',
    database: './database'
  },

  stages: {
    production: {
      environment: {
        NODE_ENV: 'production'
      }
    }
  }
});
