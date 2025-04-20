<script lang="ts">
  import NavBar from "../lib/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import '../app.css';

  let { children, data } : { children : Snippet; data: {isLogged: boolean}} = $props();
  let isLogged = $derived(data.isLogged);
</script>

<NavBar {isLogged}/>
{@render children()}
