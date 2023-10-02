// See https://kit.svelte.dev/docs/types#app

import type { User } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
