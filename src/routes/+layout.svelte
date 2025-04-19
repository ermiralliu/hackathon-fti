<script lang="ts">
  import NavBar from "../lib/components/NavBar.svelte";
  import { type Snippet } from "svelte";

  let { children } : { children : Snippet} = $props();
</script>

<NavBar />

{@render children()}
