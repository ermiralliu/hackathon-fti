// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import User from '$prisma-client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null | undefined; // Define the 'user' property and its type
      theme?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
