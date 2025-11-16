type Player = { id: string; partnerId: string | null };

export class SecretSanta {
	private restrictions = new Map<Player['id'], Set<Player['id']>>();
	private players = new Map<Player['id'], Player>();

	/**
	 * Generates a Secret Santa list ensuring partners don't pick each other
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

			this.players.set(player.id, player);
			this.restrictions.set(player.id, forbidden);
		}
	}

	generate() {
		// Try to find a valid assignment (with retry logic)
		const maxAttempts = 1000;
		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			const result = this.tryAssignment();
			if (result) {
				return result;
			}
		}

		throw new Error(
			'Could not find valid Secret Santa assignment. Check if configuration is possible.'
		);
	}

	private tryAssignment() {
		const givers = Array.from(this.players.keys());
		const receivers = Array.from(this.players.keys());
		const assignments = [];

		// Shuffle receivers
		this.shuffleArray(receivers);

		for (const giver of givers) {
			const forbidden = this.restrictions.get(giver);

			// Find first valid receiver
			const validIndex = receivers.findIndex(
				(r) => forbidden === undefined || !forbidden.has(r)
			);

			if (validIndex === -1) {
				return null; // No valid assignment found
			}

			const receiver = receivers[validIndex];
			receivers.splice(validIndex, 1);
			assignments.push({ giver, receiver });
		}

		return assignments;
	}

	private shuffleArray(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}
