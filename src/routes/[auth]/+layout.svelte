<script>
  let { children } = $props();
</script>

<div class="main-content">
  {@render children()}
</div>

<style>
  .main-content {
    height: 75%;
    align-items: center;
    padding: 10px;
  }
</style>
