<script>
  import CommonLayout from '../../panel/+layout.svelte';

  let {children} = $props();

</script>

<CommonLayout>
  {@render children()}
</CommonLayout>