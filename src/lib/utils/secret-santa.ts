type Player = { id: string; partnerId: string | null };

type Assignment = { giver: string; receiver: string };

export class SecretSanta {
	private restrictions = new Map<Player['id'], Set<Player['id']>>();

	/**
	 * Generates a Secret Santa list ensuring partners don't pick each other.
	 */
	constructor(players: Player[]) {
		// Validate input
		if (!players || players.length < 3) {
			throw new Error('Need at least 3 players for Secret Santa');
		}

		// Create a map of who can't be assigned to whom
		for (const player of players) {
			const forbidden = new Set<Player['id']>();
			forbidden.add(player.id); // Can't pick yourself
			if (player.partnerId) {
				forbidden.add(player.partnerId); // Can't pick your partner
			}

			this.restrictions.set(player.id, forbidden);
		}
	}

	generate(): Assignment[] {
		// The backtracking search below is complete, so a single attempt either
		// finds a valid assignment or proves that none exists.
		const result = this.tryAssignment();
		if (result) {
			return result;
		}

		throw new Error(
			'Could not find valid Secret Santa assignment. Check if configuration is possible.'
		);
	}

	private tryAssignment(): Assignment[] | null {
		const givers = Array.from(this.restrictions.keys());
		const available = new Set<Player['id']>(givers);
		const assigned = new Map<Player['id'], Player['id']>();

		// Most-constrained-first backtracking: at every step pick the giver with
		// the fewest valid receivers left. Dead ends are found early, and unlike
		// a plain greedy pass this is guaranteed to find an assignment whenever
		// one exists.
		const search = (remaining: Player['id'][]): boolean => {
			if (remaining.length === 0) return true;

			// Pick the giver with the fewest currently-valid receivers
			let best: Player['id'] | undefined;
			let bestCandidates: Player['id'][] = [];
			let fewest = Infinity;

			for (const giver of remaining) {
				const forbidden = this.restrictions.get(giver);
				const candidates: Player['id'][] = [];

				for (const receiver of available) {
					if (!forbidden?.has(receiver)) candidates.push(receiver);
				}

				if (candidates.length === 0) return false; // Dead end
				if (candidates.length < fewest) {
					fewest = candidates.length;
					best = giver;
					bestCandidates = candidates;
					if (fewest === 1) break;
				}
			}

			// Shuffle so a re-run produces a different draw
			this.shuffleArray(bestCandidates);

			for (const candidate of bestCandidates) {
				assigned.set(best!, candidate);
				available.delete(candidate);

				if (search(remaining.filter((giver) => giver !== best))) return true;

				available.add(candidate);
				assigned.delete(best!);
			}

			return false;
		};

		if (!search(givers)) return null;

		return Array.from(assigned, ([giver, receiver]) => ({ giver, receiver }));
	}

	private shuffleArray<T>(array: T[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}
