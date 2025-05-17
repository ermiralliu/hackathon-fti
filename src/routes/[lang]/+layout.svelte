<script lang="ts">
  import NavBar from "$lib/client/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import "../../app.css";

  let {
    children,
    data,
  } : { children: Snippet; data: { isLogged: boolean; isDark: boolean;} } 
  = $props();

</script>

<NavBar {...data}/>

{@render children()}
