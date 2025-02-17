import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import KanbanBoard from '../components/KanbanBoard';
import { useToast } from '@chakra-ui/react';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: jest.fn(),
}));

jest.mock('../api/githubApi', () => ({
  fetchRepoIssues: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        title: 'Test Issue',
        state: 'open',
        assignee: null,
        comments: 5,
        created_at: '2024-01-01T00:00:00Z',
        user: { login: 'test-user' },
      },
    ])
  ),
  fetchRepoStars: jest.fn(() => Promise.resolve(10)),
}));

describe('KanbanBoard', () => {
  test('renders Kanban Board header', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );
    const heading = screen.getByText(/Kanban Board/i);

    expect(heading).toBeInTheDocument();
  });

  test('renders input and load button', () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );
    const inputElement = screen.getByPlaceholderText(/Enter GitHub Repo URL/i);
    const buttonElement = screen.getByText(/Load Issues/i);

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  test('shows error when entering invalid URL', async () => {
    const mockToast = jest.fn();

    (useToast as jest.Mock).mockReturnValue(mockToast);

    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText('Enter GitHub Repo URL');
    const buttonElement = screen.getByText('Load Issues');

    fireEvent.change(inputElement, { target: { value: 'invalid-url' } });
    fireEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid GitHub URL',
          description:
            'Please enter a valid GitHub repository URL (https://github.com/github-name/repo-name).',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      )
    );
  });

  test('loads issues when a valid URL is entered', async () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText('Enter GitHub Repo URL');
    const buttonElement = screen.getByText('Load Issues');

    fireEvent.change(inputElement, {
      target: { value: 'https://github.com/test/repo' },
    });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(screen.getByText('Test Issue')).toBeInTheDocument();
    });
  });

  test('displays GitHub stars count', async () => {
    render(
      <Provider store={store}>
        <KanbanBoard />
      </Provider>
    );

    const inputElement = screen.getByPlaceholderText('Enter GitHub Repo URL');
    const buttonElement = screen.getByText('Load Issues');

    fireEvent.change(inputElement, {
      target: { value: 'https://github.com/test/repo' },
    });
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(screen.getByText(/10 stars/i)).toBeInTheDocument();
    });
  });
});
