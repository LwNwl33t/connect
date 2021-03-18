/*
 * Unit tests for source with coverage
 */

module.exports = {
    rootDir: './',
    moduleFileExtensions: ['js'],
    testMatch: ['**/src/js/**/*.test.js'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/js/device/_old/'],
    coverageDirectory: './coverage/',
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/js/**',
        '!**/constants/**',
        '!**/__tests__/**',
        '!**/__fixtures__/**',
    ],
    modulePathIgnorePatterns: ['node_modules'],
    setupFiles: ['./tests/jest.setup.js'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
};
