import 'unplugin-icons/types/svelte';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			user: string;
			family: number;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
