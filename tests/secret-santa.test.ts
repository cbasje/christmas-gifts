import { describe, expect, it } from 'vitest';
import { SecretSanta } from '#lib/utils/secret-santa.ts';

type Player = { id: string; partnerId: string | null };
type Assignment = { giver: string; receiver: string };

const players = (n: number): Player[] =>
	Array.from({ length: n }, (_, i) => ({ id: `u${i}`, partnerId: null }));

function expectValidDraw(assignments: Assignment[], roster: Player[]) {
	// Complete permutation: everyone gives and receives exactly once
	expect(assignments).toHaveLength(roster.length);
	expect(new Set(assignments.map((a) => a.giver))).toEqual(
		new Set(roster.map((p) => p.id))
	);
	expect(new Set(assignments.map((a) => a.receiver))).toEqual(
		new Set(roster.map((p) => p.id))
	);

	const byId = new Map(roster.map((p) => [p.id, p]));
	for (const a of assignments) {
		expect(a.giver).not.toBe(a.receiver); // no self-pick
		expect(byId.get(a.giver)?.partnerId).not.toBe(a.receiver); // no partner-pick
	}
}

describe('SecretSanta', () => {
	it('requires at least 3 players', () => {
		expect(() => new SecretSanta([])).toThrow();
		expect(() => new SecretSanta(players(2))).toThrow();
	});

	it('handles 3 players without partners', () => {
		const roster = players(3);
		expectValidDraw(new SecretSanta(roster).generate(), roster);
	});

	it('keeps two couples apart', () => {
		const roster: Player[] = [
			{ id: 'a', partnerId: 'b' },
			{ id: 'b', partnerId: 'a' },
			{ id: 'c', partnerId: 'd' },
			{ id: 'd', partnerId: 'c' },
		];
		expectValidDraw(new SecretSanta(roster).generate(), roster);
	});

	it('solves the two-couples swap', () => {
		const roster: Player[] = [
			{ id: 'a', partnerId: 'b' },
			{ id: 'b', partnerId: 'a' },
			{ id: 'c', partnerId: 'd' },
			{ id: 'd', partnerId: 'c' },
		];
		expectValidDraw(new SecretSanta(roster).generate(), roster);
	});

	it('throws when no valid assignment exists (mutual couple among 3 players)', () => {
		const roster: Player[] = [
			{ id: 'a', partnerId: 'b' },
			{ id: 'b', partnerId: 'a' },
			{ id: 'c', partnerId: null },
		];
		expect(() => new SecretSanta(roster).generate()).toThrow();
	});

	it('produces a fresh draw on every run', () => {
		const roster = players(8);
		const draws = new Set<string>();
		for (let i = 0; i < 25; i++) {
			draws.add(JSON.stringify(new SecretSanta(roster).generate()));
		}
		expect(draws.size).toBeGreaterThan(1);
	});

	it('handles large families with random partner pairs', () => {
		for (let t = 0; t < 50; t++) {
			const roster = players(20);
			for (let i = 0; i < 20; i += 2) {
				if (Math.random() < 0.6) {
					roster[i].partnerId = roster[i + 1].id;
					roster[i + 1].partnerId = roster[i].id;
				}
			}
			expectValidDraw(new SecretSanta(roster).generate(), roster);
		}
	});
});