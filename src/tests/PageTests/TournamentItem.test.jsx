import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('../../Services/RAWGService', () => ({
  getGameDetails: vi.fn(),
}));

import { getGameDetails } from '../../Services/RAWGService';
import TournamentItem from '../../Components/TournamentItem';

describe('TournamentItem', () => {
  const tournament = {
    id: 1,
    name: 'Summer Cup',
    rules: 'BO3',
    maxParticipants: 16,
    gameId: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders tournament information', () => {
    getGameDetails.mockResolvedValue({
      id: 123,
      name: 'Counter-Strike 2',
    });

    render(
      <TournamentItem tournament={tournament} />
    );

    expect(
      screen.getByText(/Summer Cup/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/BO3/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/16/)
    ).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    getGameDetails.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <TournamentItem tournament={tournament} />
    );

    expect(
      screen.getByText(/Loading.../)
    ).toBeInTheDocument();
  });

  test('fetches and displays game name', async () => {
    getGameDetails.mockResolvedValue({
      id: 123,
      name: 'Counter-Strike 2',
    });

    render(
      <TournamentItem tournament={tournament} />
    );

    expect(getGameDetails)
      .toHaveBeenCalledWith(123);

    await waitFor(() => {
      expect(
        screen.getByText(/Counter-Strike 2/)
      ).toBeInTheDocument();
    });
  });

  test('renders game image when available', async () => {
    getGameDetails.mockResolvedValue({
      id: 123,
      name: 'Counter-Strike 2',
      background_image: 'test-image.jpg',
    });

    render(
      <TournamentItem tournament={tournament} />
    );

    const image = await screen.findByRole('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'test-image.jpg'
    );
    expect(image).toHaveAttribute(
      'alt',
      'Counter-Strike 2'
    );
  });

  test('does not render image when background_image is missing', async () => {
    getGameDetails.mockResolvedValue({
      id: 123,
      name: 'Counter-Strike 2',
    });

    render(
      <TournamentItem tournament={tournament} />
    );

    await screen.findByText(/Counter-Strike 2/);

    expect(
      screen.queryByRole('img')
    ).not.toBeInTheDocument();
  });

  test('handles api error gracefully', async () => {
    const consoleSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    getGameDetails.mockRejectedValue(
      new Error('RAWG failed')
    );

    render(
      <TournamentItem tournament={tournament} />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    expect(
      screen.getByText(/Loading.../)
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});