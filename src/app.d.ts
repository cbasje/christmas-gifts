declare global {
	namespace App {
		interface Error {
			end?: Date;
		}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
		// interface PageData {}
		interface PageState {}
		// interface Platform {}
	}
}

export {};
