# Agricultural E-commerce

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
pnpm run dev
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Composing up with Docker

```Docker
docker compose up
```
Build the production app in a docker container and composes it along with the postgres database
To run it you need to manage https certificates. 
To run it in my computer I have used Caddy (you need to install it first) with:
```caddy
caddy run
```
Then you can open the app in https://0.0.0.0:443 or https://myapp.local