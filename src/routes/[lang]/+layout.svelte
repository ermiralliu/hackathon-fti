<script lang="ts">
  import NavBar from "$lib/client/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import "../../app.css";

  import { setLang } from "$lib/client/globalStates/language.svelte";

  let {
    children,
    data,
  } : { children: Snippet; data: { isLogged: boolean; isDark: boolean; lang: 'en'|'sq'} } 
  = $props();

  $effect(()=>{
    setLang(data.lang);
  });

</script>

<NavBar {...data}/>

{@render children()}
