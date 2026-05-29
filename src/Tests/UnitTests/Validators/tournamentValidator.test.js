/// <reference types="vitest" />
import '@testing-library/jest-dom'

import { validateTournament } from '../../../Validators/tournamentValidator';

describe('validateTournament', () => {
    it('should return error if name is empty', () => {
        const tournamentData = {
            name: '',
            gameId: '18753',
            rules: 'Standard chess rules apply.',
            maxParticipants: 16
        };
        const result = validateTournament(tournamentData);
        expect(result).toBe("Tournament name is required.");
    });
});

describe('validateTournament', () => {
    it('should return error if game is empty', () => {
        const tournamentData = {
            name: 'Chess Tournament',
            gameId: '',
            rules: 'Standard chess rules apply.',
            maxParticipants: 16
        };
        const result = validateTournament(tournamentData);
        expect(result).toBe("Game selection is required.");
    });
});

describe('validateTournament', () => {
    it('should return null if all fields are valid', () => {
        const tournamentData = {
            name: 'Chess Tournament',
            gameId: '18753',
            rules: 'Standard chess rules apply.',
            maxParticipants: 16
        };
        const result = validateTournament(tournamentData);
        expect(result).toBeNull();
    });
});

describe('validateTournament', () => {
    it('should return error if maxParticipants is less than 2', () => {
        const tournamentData = {
            name: 'Chess Tournament',
            gameId: '18753',
            rules: 'Standard chess rules apply.',
            maxParticipants: -1
        };
        const result = validateTournament(tournamentData);
        expect(result).toBe("Max participants must be positive.");
    });
});

describe('validateTournament', () => {
    it('should return error if maxParticipants is not a power of 2', () => {
        const tournamentData = {
            name: 'Chess Tournament',
            gameId: '18753',
            rules: 'Standard chess rules apply.',
            maxParticipants: 15
        };
        const result = validateTournament(tournamentData);
        expect(result).toBe("Max participants must be a power of 2.");
    });
});

describe('validateTournament', () => {
    it('should return error if maxParticipants is not a number', () => {
        const tournamentData = {
            name: 'Chess Tournament',
            gameId: '18753',
            rules: 'Standard chess rules apply.',
            maxParticipants: 'not-a-number'
        };
        const result = validateTournament(tournamentData);
        expect(result).toBe("Max participants must be a number.");
    });
});
