export default ({services}) => ({
  type: 'backend',

  dependsOn: 'database',

  environment: {
    DATABASE_URL: services.database.url
  },

  stages: {
    development: {
      url: 'http://localhost:16288/',
      platform: 'local'
    },
    production: {
      url: 'https://backend.crud-example-app.layrjs.com/',
      platform: 'aws',
      aws: {
        region: 'us-west-2',
        lambda: {
          memorySize: 1024,
          timeout: 15
        }
      }
    }
  }
});
