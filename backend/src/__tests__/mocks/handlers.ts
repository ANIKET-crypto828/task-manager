import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'fake-jwt-token',
    });
  }),

  http.get('/api/v1/tasks', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: '2025-12-31',
      },
    ]);
  }),
];