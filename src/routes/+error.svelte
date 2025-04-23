<script lang="ts">

	import { page } from '$app/state';
  import { base } from '$app/paths';

</script>

<svelte:head>
	<title>{page.status} | Oops!</title>
</svelte:head>

<div class="error-page">
	<div class="error-content">
		<h1 class="error-title">{page.status}</h1>
		<p class="error-message">{page.error?.message}</p>
		<p class="error-suggestion">
			Maybe you can <a href="{base}/">go back to the homepage</a>?
		</p>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #f4f4f4;
		color: #333;
		font-family: sans-serif;
	}

	.error-content {
		text-align: center;
		padding: 2rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.error-title {
		font-size: 4rem;
		font-weight: bold;
		color: #e44d26;
		margin-bottom: 1rem;
	}

	.error-message {
		font-size: 1.2rem;
		margin-bottom: 1.5rem;
		color: #555;
	}

	.error-suggestion a {
		color: #007bff;
		text-decoration: none;
	}

	.error-suggestion a:hover {
		text-decoration: underline;
	}
</style>