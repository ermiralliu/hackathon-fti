<script lang="ts">
  import { enhance } from "$app/forms";
  import verticalTransition from "$lib/client/transitions/verticalTransition";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let { auth } = $props();
  let isRegisterPage = $derived(auth === "register");
  let otherPage = $derived(isRegisterPage ? "login" : "register");

  let password = $state("");
  let confirmPassword = $state("");

  let passwordsMatch = $derived(
    isRegisterPage ? password === confirmPassword : true,
  );

  // svelte-ignore non_reactive_update
  let usernameInput: HTMLInputElement;

  onMount(() => {
    setTimeout(() => {
      usernameInput.focus();
    }, 400);
  });
</script>

<!-- Making a snippet so we can apply files within here -->
{#snippet Input(name = "", labelText = "", type = "text")}
  <label in:fly={{ x: -20 }} out:verticalTransition>
    {labelText}
    <input {type} {name} required />
  </label>
{/snippet}

<form
  method="post"
  action="?/{auth}"
  use:enhance
  class:register={isRegisterPage}
  in:fade
>
  {#key "sidebar"}
    <!-- The key successfully stops the animation when navigating pages. Nice. -->
    <h1>{isRegisterPage ? "Register" : "Login"}</h1>
    <label in:fly={{ x: -20 }}>
      Username:
      <input bind:this={usernameInput} type="text" name="username" required />
    </label>

    {#if isRegisterPage}
      {@render Input("email", "Email:", "email")}
      {@render Input("name", "Name:", "text")}

      <label in:fly={{ x: -20 }} out:verticalTransition>
        Role:
        <select name="role">
          <option value="consumer" selected> Bleres </option>
          <option value="farmer"> Fermer </option>
        </select>
      </label>
    {/if}
    <label in:fly={{ x: -20 }} out:verticalTransition>
      Password:
      <input type="password" name="password" bind:value={password} />
    </label>
    {#if isRegisterPage}
      <label in:fly={{ x: -20 }} out:verticalTransition>
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
  {/key}
</form>

<style>
  :root {
    --card-shadow: rgba(0, 0, 0, 0.25);
  }

  :global(:root):has(:global(#theme-switch):checked) {
    --card-shadow: rgba(0, 0, 0, 0.4);
  }

  form {
    display: flex;
    flex-direction: column;
    max-width: 420px;
    margin: 35px auto;
    transition: margin 0.25s ease-in-out;
    padding: min(33px, 5%);
    /* border: 1px solid #ddd; */
    box-shadow: 0 4px 12px var(--card-shadow);
    border-radius: 8px;
    background-color: var(--color-bg-component);
  }

  .register {
    margin-top: 12px;
    padding-top: 0;
  }
  .register label{
    margin-bottom: 6px;
  } 
  .register input{
    margin-top: 0;
    margin-bottom: 0.5%;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8em;
  }

  label {
    margin-bottom: 10px;
    display: block;
  }

  input,
  select {
    display: block;
    width: 100%;
    padding: 8px;
    margin-top: 5px;
  }

  button {
    margin-top: 20px;
  }

  a {
    margin-top: 10px;
    text-align: center;
    display: block;
    color: #007bff;
  }

  @media (max-width: 600px) {
    form {
      max-width: 90%;
    }

    input,
    select {
      width: calc(100% - 8px);
      padding: 6px;
    }

    button {
      padding: 8px 12px;
    }
  }
</style>
