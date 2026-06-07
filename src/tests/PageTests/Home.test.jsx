import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

vi.mock('../../Services/TournamentService', () => ({
  getTournaments: vi.fn(),
  createTournament: vi.fn(),
}));

vi.mock('../../Services/RAWGService', () => ({
  searchGames: vi.fn(),
}));

vi.mock('../../Validators/tournamentValidator', () => ({
  validateTournament: vi.fn(),
}));

vi.mock('../../Components/TournamentItem.jsx', () => ({
  default: ({ tournament }) => (
    <li data-testid="tournament-item">
      {tournament.name}
    </li>
  ),
}));

import Home from '../../Pages/Home';
import {
  getTournaments,
  createTournament,
} from '../../Services/TournamentService';
import { searchGames } from '../../Services/RAWGService';
import { validateTournament } from '../../Validators/tournamentValidator';

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.alert = vi.fn();

    getTournaments.mockResolvedValue([]);
  });

  test('renders page and loads tournaments', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(getTournaments).toHaveBeenCalled();
    });

    expect(
      screen.getByText('No tournaments found.')
    ).toBeInTheDocument();
  });

  test('renders tournaments returned from API', async () => {
    getTournaments.mockResolvedValue([
      {
        id: 1,
        name: 'Summer Cup',
      },
      {
        id: 2,
        name: 'Winter Cup',
      },
    ]);

    render(<Home />);

    expect(
      await screen.findByText('Summer Cup')
    ).toBeInTheDocument();

    expect(
      await screen.findByText('Winter Cup')
    ).toBeInTheDocument();
  });

  test('searches for games and displays results', async () => {
    searchGames.mockResolvedValue([
      {
        id: 10,
        name: 'Counter-Strike 2',
      },
    ]);

    const user = userEvent.setup();

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(
      'Search Game'
    );

    await user.type(searchInput, 'Counter');

    await waitFor(() => {
      expect(searchGames).toHaveBeenCalled();
    });

    expect(
      await screen.findByText('Counter-Strike 2')
    ).toBeInTheDocument();
  });

  test('selects a game from search results', async () => {
    searchGames.mockResolvedValue([
      {
        id: 10,
        name: 'Counter-Strike 2',
      },
    ]);

    const user = userEvent.setup();

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(
      'Search Game'
    );

    await user.type(searchInput, 'Counter');

    const gameButton =
      await screen.findByText('Counter-Strike 2');

    await user.click(gameButton);

    expect(
      screen.getByText(/Selected Game:/)
    ).toBeInTheDocument();

    expect(
      screen.getByText('Counter-Strike 2')
    ).toBeInTheDocument();
  });

  test('shows validation error and does not create tournament', async () => {
    validateTournament.mockReturnValue(
      'Tournament name is required'
    );

    const user = userEvent.setup();

    render(<Home />);

    await user.click(
      screen.getByText('Create Tournament')
    );

    expect(window.alert).toHaveBeenCalledWith(
      'Tournament name is required'
    );

    expect(createTournament).not.toHaveBeenCalled();
  });

  test('creates tournament successfully', async () => {
    validateTournament.mockReturnValue(null);

    searchGames.mockResolvedValue([
      {
        id: 10,
        name: 'Counter-Strike 2',
      },
    ]);

    createTournament.mockResolvedValue({
      id: 1,
      name: 'Summer Cup',
      gameId: 10,
      maxParticipants: 16,
      rules: 'BO3',
    });

    const user = userEvent.setup();

    render(<Home />);

    await user.type(
      screen.getByPlaceholderText('Tournament Name'),
      'Summer Cup'
    );

    await user.type(
      screen.getByPlaceholderText('Tournament Rules'),
      'BO3'
    );

    await user.type(
      screen.getByPlaceholderText('Max Participants'),
      '16'
    );

    const searchInput = screen.getByPlaceholderText(
      'Search Game'
    );

    await user.type(searchInput, 'Counter');

    const gameButton =
      await screen.findByText('Counter-Strike 2');

    await user.click(gameButton);

    await user.click(
      screen.getByText('Create Tournament')
    );

    await waitFor(() => {
      expect(createTournament).toHaveBeenCalledWith({
        gameId: 10,
        name: 'Summer Cup',
        maxParticipants: 16,
        rules: 'BO3',
      });
    });

    expect(
      await screen.findByText('Summer Cup')
    ).toBeInTheDocument();
  });

  test('handles create tournament API error', async () => {
    validateTournament.mockReturnValue(null);

    searchGames.mockResolvedValue([
      {
        id: 20,
        name: 'Team Fortress 2',
      }
    ]);

    createTournament.mockRejectedValue(
      new Error('Server failed')
    );

    const user = userEvent.setup();

    render(<Home />);

    await user.type(
      screen.getByPlaceholderText('Tournament Name'),
      'Winter Cup'
    );

    await user.type(
      screen.getByPlaceholderText('Tournament Rules'),
      'Dont cheat please!'
    );

    await user.type(
      screen.getByPlaceholderText('Max Participants'),
      '32'
    );

    const searchInput = screen.getByPlaceholderText(
      'Search Game'
    );

    await user.type(searchInput, 'Team Fortress');

    const gameButton =
      await screen.findByText('Team Fortress 2');

    await user.click(gameButton);

    await user.click(
      screen.getByText('Create Tournament')
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Server failed'
      );
    });
  });
});