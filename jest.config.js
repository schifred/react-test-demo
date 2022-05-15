module.exports = {
  setupFiles: ['./setup.js'],
  setupFilesAfterEnv: ['./setupAfterEnv.js'],
  snapshotSerializers: [require.resolve('enzyme-to-json/serializer')],
  extraGlobals: [],
  moduleNameMapper: {
    '@@/(.*)': '<rootDir>/src/.umi/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
};
