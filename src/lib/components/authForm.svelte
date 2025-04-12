<script>
  // @ts-nocheck
  import { enhance } from "$app/forms";
  import { fade, fly } from "svelte/transition";

  let { auth } = $props();
  let isRegisterPage = $derived(auth === "register");
  let otherPage = $derived(isRegisterPage ? "login" : "register");

  let password = $state("");
  let confirmPassword = $state("");

  let passwordsMatch = $derived(
    isRegisterPage ? password === confirmPassword : true,
  );
</script>

<!-- Making a snippet so we can apply files within here -->
{#snippet Input(name, labelText, type = "text")}
  <label in:fly={{ x: -20 }} out:fade>
    {labelText}
    <input {type} {name} required/>
  </label>
{/snippet}

<form method="post" action="?/{auth}" use:enhance>
  {@render Input("username", "Username:", "text")}

  {#if isRegisterPage}
    {@render Input("email", "Email:", "email")}
    {@render Input("name", "Name:", "text")}

    <label in:fly={{ x: -20 }} out:fade>
      Role:
      <select name="role">
        <option value="consumer" selected> Bleres </option>
        <option value="frmer"> Fermer </option>
      </select>
    </label>
  {/if}
  <label in:fly={{ x: -20 }} out:fade>
    Password:
    <input type="password" name="password" bind:value={password} />
  </label>
  {#if isRegisterPage}
    <label in:fly={{ x: -20 }} out:fade>
      Confirm password:
      <input
        type="password"
        name="confirm_password"
        bind:value={confirmPassword}
      />
    </label>
  {/if}
  {#if !passwordsMatch}
    <p style:color="red">Password mismatch</p>
  {/if}

  <button type="submit" disabled={!passwordsMatch}>Send</button>
  <a href="/{otherPage}"> Go to {otherPage} </a>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

  button {
    margin: 2%;
  }

  label {
    margin: 2%;
  }
</style>
