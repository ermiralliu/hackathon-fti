<script lang="ts">
  import NavBar from "../lib/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import '../app.css';

  let { children } : { children : Snippet} = $props();
</script>

<NavBar/>
<!-- <main> -->
  {@render children()}
<!-- </main> -->
