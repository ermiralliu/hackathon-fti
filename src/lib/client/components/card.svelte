<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";
  import { fade } from "svelte/transition";

  let props: { children: Snippet; class?: ClassValue } = $props();
</script>

<article class="product-card">
  <div class={props.class} in:fade={{ duration: 700 }} out:fade>
    {@render props.children()}
  </div>
</article>

<style>

  :global(:root){
    --box-shadow-color: rgba(0, 0, 0, 0.25);
  }
  :global(:root):has(:global(#theme-switch):checked){
    --box-shadow-color: rgba(0, 0, 0, 0.4);
  }

  .product-card {
    background-color: var(--color-bg-component);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px var(--box-shadow-color);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px var(--box-shadow-color);
  }

  .product-card:hover :global(img) {
    transform: scale(1.05);
  }
</style>
