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
    }
  }
});
