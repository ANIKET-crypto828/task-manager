import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock prisma
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  const prisma = require('../lib/prisma').default;
  mockReset(prisma);
});

export const prismaMock = require('../lib/prisma').default as DeepMockProxy<PrismaClient>;