import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../../components/tasks/TaskCard';
import { Priority, Status } from '../../types';

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  status: Status.TODO,
  priority: Priority.HIGH,
  dueDate: '2025-12-31T00:00:00Z',
  creatorId: 'user-1',
  creator: { id: 'user-1', name: 'John Doe', email: 'john@example.com' },
  assignedToId: 'user-2',
  assignedTo: { id: 'user-2', name: 'Jane Doe', email: 'jane@example.com' },
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

describe('TaskCard', () => {
  it('should render task information', () => {
    const handleClick = jest.fn();
    render(<TaskCard task={mockTask} onClick={handleClick} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/created by john doe/i)).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<TaskCard task={mockTask} onClick={handleClick} />);

    const card = screen.getByText('Test Task').closest('div');
    if (card) {
      fireEvent.click(card);
    }

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display overdue indicator for overdue tasks', () => {
    const overdueTask = {
      ...mockTask,
      dueDate: '2020-01-01T00:00:00Z',
      status: Status.TODO,
    };

    const handleClick = jest.fn();
    render(<TaskCard task={overdueTask} onClick={handleClick} />);

    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('should not display overdue indicator for completed tasks', () => {
    const completedTask = {
      ...mockTask,
      dueDate: '2020-01-01T00:00:00Z',
      status: Status.COMPLETED,
    };

    const handleClick = jest.fn();
    render(<TaskCard task={completedTask} onClick={handleClick} />);

    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('should display unassigned when no assignee', () => {
    const unassignedTask = {
      ...mockTask,
      assignedToId: null,
      assignedTo: null,
    };

    const handleClick = jest.fn();
    render(<TaskCard task={unassignedTask} onClick={handleClick} />);

    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });
});
