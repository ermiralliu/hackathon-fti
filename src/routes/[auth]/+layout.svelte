<script>

  let { children } = $props();

</script>

<div class="auth-layout">
  <div class="main-content">
    {@render children()}
  </div>
</div>

<style>

  .auth-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
</style>
