<script lang="ts">
  import { page } from "$app/state";
  import AuthForm from "$lib/components/authForm.svelte";

  let auth = $derived(page.params.auth) as 'login' | 'register';

</script>

<AuthForm {auth}/>
