import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskForm } from '../../components/tasks/TaskForm';
import { SWRConfig } from 'swr';

const renderTaskForm = (props: any) => {
  return render(
    <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <TaskForm {...props} />
    </SWRConfig>
  );
};

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn(() => Promise.resolve());
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render create form', () => {
    renderTaskForm({
      mode: 'create',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
  });

  it('should render edit form with initial data', () => {
    const initialData = {
      title: 'Existing Task',
      description: 'Existing Description',
      dueDate: '2025-12-31T00:00:00',
      priority: 'HIGH',
      status: 'TODO',
    };

    renderTaskForm({
      mode: 'edit',
      initialData,
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
  });

  it('should display validation errors', async () => {
    renderTaskForm({
      mode: 'create',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    renderTaskForm({
      mode: 'create',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with form data', async () => {
    renderTaskForm({
      mode: 'create',
      onSubmit: mockOnSubmit,
      onCancel: mockOnCancel,
    });

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Describe the task in detail');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it('should disable submit button while loading', async () => {
    const slowOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));

    renderTaskForm({
      mode: 'create',
      onSubmit: slowOnSubmit,
      onCancel: mockOnCancel,
    });

    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Describe the task in detail');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Description' } });

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/saving/i);
    });
  });
});
