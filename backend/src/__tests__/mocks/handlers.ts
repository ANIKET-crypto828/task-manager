import { rest } from 'msw';

export const handlers = [
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'fake-jwt-token',
      })
    );
  }),

  rest.get('/api/v1/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: '2025-12-31',
        },
      ])
    );
  }),
];
