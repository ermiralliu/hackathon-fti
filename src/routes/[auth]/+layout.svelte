<script>
    import { fade } from 'svelte/transition';

  let { children } = $props();
</script>

<div class="main-content" out:fade>
  {@render children()}
</div>

<style>
  .main-content {
    height: 100%;
    align-items: center;
    padding: 10px;
  }
</style>
