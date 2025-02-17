export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-dnd|some-other-esm-package)/',
  ],
  moduleNameMapper: {
    '\\.(svg|jpg|jpeg|png|gif|webp|bmp|tiff)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};
