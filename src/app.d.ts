// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null | undefined; // Define the 'user' property and its type
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
