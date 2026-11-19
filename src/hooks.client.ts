import { bind, observe, set } from '@foleyjs/core';
import type { ClientInit } from '@sveltejs/kit/hooks';

export const init: ClientInit = async () => {
	// Global foley character: soft + quiet, panned to where each element sits.
	set({ theme: 'soft', volume: 0.7, localize: 0.4 });
	bind(); // interaction
	observe(); // appearance and state change
};
