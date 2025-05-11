<script lang="ts">
  import NavBar from "$lib/client/components/NavBar.svelte";
  import { onMount, type Snippet } from "svelte";
  import '../../app.css';
    import { locale } from "svelte-i18n";

  let { children, data } : { children : Snippet; data: {isLogged: boolean, isDark: boolean}} = $props();
  onMount( async()=>{
    await locale.set('en');
    console.log('set the locale');
  });
</script>

<NavBar isLogged={data.isLogged} isDark={data.isDark}/>

{@render children()}


