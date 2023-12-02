// See https://kit.svelte.dev/docs/types#app
import type { Group, UserSizes } from '$lib/db/schema/user';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			end?: Date;
		}
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
		type DatabaseUserAttributes = {
			id?: string;
			name: string | null;
			user_name: string;
			partner_id: string | null;
			groups?: Group[];
			hue: number;
			sizes: UserSizes | null;
			created_at?: Date;
			updated_at?: Date;
		};
		type DatabaseSessionAttributes = {
			group: Group;
		};
	}
}

export {};
