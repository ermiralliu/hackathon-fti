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
  form {
    display: flex;
    flex-direction: column;
    max-width: 420px;
    margin: 35px auto;
    transition: margin 0.25s ease-in-out;
    padding: min(30px, 5%);
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: black;
  }

  .register {
    margin-top: 12px;
    padding-top: 0;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8em;
  }

  label {
    height: 100%;
    /* transition: height 0.2s ease-in-out; */
    margin-bottom: 10px;
    display: block;
    color: black;
  }

  /* .zooming-label {
    height: 0;
  } */

  input,
  select {
    width: calc(100% - 12px);
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    color: black;
  }

  button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: #c8e6c9;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:disabled {
    background-color: #e0e0e0;
    color: #333;
    cursor: not-allowed;
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
