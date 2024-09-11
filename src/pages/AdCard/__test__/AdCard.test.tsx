/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Advertisment from '../index';
import { useGetAdvertisment, useDeleteAdvertisment, usePatchAdvertisment } from '@/api/advertisments';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('@/api/advertisments', async () => {
  const actual = await vi.importActual('@/api/advertisments');
  return {
    ...actual,
    useGetAdvertisment: vi.fn(),
    useDeleteAdvertisment: vi.fn(),
    usePatchAdvertisment: vi.fn(),
  };
});

const mockAdvertismentData = {
  id: '1',
  name: 'Test Advertisment',
  description: 'This is a test advertisment',
  price: 100,
  imageUrl: 'https://example.com/image.jpg',
  likes: 5,
  views: 10,
  createdAt: new Date().toISOString(),
};

const queryClient = new QueryClient();

describe('Advertisment Component', () => {
  beforeEach(() => {
    vi.mocked(useGetAdvertisment).mockReturnValue({
      data: mockAdvertismentData,
      isLoading: false,
      refetch: vi.fn(),
    } as any);

    vi.mocked(useDeleteAdvertisment).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      isIdle: true,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      isPermanentlyError: false,
      isInitialLoading: false,
    } as any);

    vi.mocked(usePatchAdvertisment).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      isIdle: true,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      isPermanentlyError: false,
      isInitialLoading: false,
    } as any);
  });

  it('renders advertisment data correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/advertisment/1']}>
          <Routes>
            <Route
              path="/advertisment/:id"
              element={<Advertisment />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(mockAdvertismentData.name)).toBeInTheDocument();
    expect(screen.getByText(mockAdvertismentData.description)).toBeInTheDocument();
    expect(screen.getByAltText(mockAdvertismentData.name)).toHaveAttribute('src', mockAdvertismentData.imageUrl);
    expect(screen.getByText(`${mockAdvertismentData.likes}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockAdvertismentData.views}`)).toBeInTheDocument();
  });

  it('toggles edit mode and saves changes', async () => {
    const patchAdvertismentMock = vi.fn();
    vi.mocked(usePatchAdvertisment).mockReturnValue({
      mutate: patchAdvertismentMock,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      isIdle: true,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      isPermanentlyError: false,
      isInitialLoading: false,
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/advertisment/1']}>
          <Routes>
            <Route
              path="/advertisment/:id"
              element={<Advertisment />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Редактировать'));
    expect(screen.getByText('Сохранить')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Сохранить'));
    await waitFor(() => expect(patchAdvertismentMock).toHaveBeenCalled());
  });

  it('deletes advertisment', async () => {
    const deleteAdvertismentMock = vi.fn();
    vi.mocked(useDeleteAdvertisment).mockReturnValue({
      mutate: deleteAdvertismentMock,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      isIdle: true,
      isPaused: false,
      failureCount: 0,
      failureReason: null,
      isPermanentlyError: false,
      isInitialLoading: false,
    } as any);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/advertisment/1']}>
          <Routes>
            <Route
              path="/advertisment/:id"
              element={<Advertisment />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Удалить Объявление'));
    await waitFor(() => expect(deleteAdvertismentMock).toHaveBeenCalledWith('1', expect.any(Object)));
  });
});
