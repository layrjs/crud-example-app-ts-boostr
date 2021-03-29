export default () => ({
  type: 'database',

  stages: {
    development: {
      url: 'mongodb://localhost:16289/dev',
      platform: 'local'
    }
  }
});
