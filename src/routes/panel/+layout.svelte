<script lang="ts">
  import PanelAside, { type Tab } from "$lib/components/panelAside.svelte";
  import type { Snippet } from "svelte";
  let { data, children } : {data: {tabs: Tab[], activeTab: string}, children : Snippet} = $props();

</script>

<PanelAside tabs={data.tabs} activeTab={data.activeTab}>
 {@render children()}
</PanelAside>