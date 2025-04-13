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
  <h1>{isRegisterPage ? "Register" : "Login"}</h1>
  {@render Input("username", "Username:", "text")}

  {#if isRegisterPage}
    {@render Input("email", "Email:", "email")}
    {@render Input("name", "Name:", "text")}

    <label in:fly={{ x: -20 }} out:fade>
      Role:
      <select name="role">
        <option value="consumer" selected> Bleres </option>
        <option value="farmer"> Fermer </option>
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
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: black;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8em;
  }

  label {
    margin-bottom: 10px;
    display: block;
    color: black;
  }

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

  p[style="color:red"] {
    margin-top: 10px;
    text-align: center;
    color: red; 
  }

  @media (max-width: 600px) {
    form {
      max-width: 90%;
      margin: 10px auto;
      padding: 10px;
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
