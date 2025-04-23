<script lang="ts">
  let { label, data }: { label: string; data: string } = $props();
</script>

<dl class="info-row">
  <dd class="label">{label}</dd>
  <dt class="value">{data}</dt>
</dl>

<style>
  .info-row {
    margin-bottom: 1rem;
  }

  .label {
    margin-left: 3%;
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
    color: #555;
  }

  .value {
    display: block;
    text-indent: 20%;
  }
</style>
