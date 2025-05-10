<script lang="ts">
  import NavBar from "$lib/client/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import '../app.css';

  let { children, data } : { children : Snippet; data: {isLogged: boolean, isDark: boolean}} = $props();
  
</script>

<NavBar isLogged={data.isLogged} isDark={data.isDark}/>

{@render children()}


