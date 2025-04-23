<script lang="ts">
  let { label, data }: { label: string; data: string } = $props();
</script>

<dl>
  <dd class="label">{label}</dd>
  <dt class="value">{data}</dt>
</dl>

<style>

  .label {
    margin-left: 3%;
    font-weight: bold;
    display: block;
    color: var(--color-text-secondary);
  }

  .value {
    display: block;
    text-indent: 20%;
  }
</style>
