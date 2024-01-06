import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test|e2e-spec|e2e-spec).[jt]s?(x)'],
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/src/**'],
  roots: ['./test'],
};

export default config;
