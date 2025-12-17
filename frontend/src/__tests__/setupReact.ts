import '@testing-library/jest-dom';
import { server } from '../../../backend/src/tests/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());