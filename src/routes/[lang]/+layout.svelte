<script lang="ts">
  import NavBar from "$lib/client/components/NavBar.svelte";
  import { type Snippet } from "svelte";
  import "../../app.css";

  let {
    children,
    data,
  } : { children: Snippet; data: { isLogged: boolean; isDark: boolean; lang: 'en'|'sq'} } 
  = $props();

  import { page } from "$app/state";
  import { loadTranslations, locale } from "$lib/translations";

  $effect(() => {
    console.log('loading other language');
    locale.set(data.lang);
    loadTranslations(data.lang, page.url.pathname)?.then(()=>{
      console.log('loaded language successfully');
    }).catch( e => {console.log('problem happened')});
  });

</script>

<NavBar isLogged={data.isLogged} isDark={data.isDark} lang={data.lang} />

{@render children()}
