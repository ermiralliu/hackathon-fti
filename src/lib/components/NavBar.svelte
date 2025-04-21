<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { SubmitFunction, ActionResult } from "@sveltejs/kit";

  let tabs = [
    { name: "Home", link: "/" },
    { name: "Browse Products", link: "/products" },
    { name: "Panel", link: "/panel" },
  ];

  let { isLogged } = $props();

  const handleLogout: SubmitFunction = () => {
    console.log("Form Called");
    return async ({ result }: { result: ActionResult }) => {
      console.log(JSON.stringify(result));

      console.log("Form result received");
      const res = result as ActionResult & { success: boolean };
      if (res.success) {
        goto("/", { invalidateAll: true });
      }
    };
  };
</script>

<nav>
  <div class="nav-left">
    <ul>
      {#each tabs as tab}
        <li><a href={tab.link}>{tab.name}</a></li>
      {/each}
    </ul>
  </div>
  {#if !isLogged}
    <a href="/login" class="login-btn">Log In</a>
  {:else}
    <form method="POST" action="/logout" use:enhance={handleLogout}>
      <button type="submit" aria-label="Log Out" class="logout-btn">Log Out</button>
    </form>
  {/if}
</nav>

<style>
  nav {
    background-color: #213555;
    padding: 1rem;
    position: sticky;
    top: 0;
    width: 100%;
    height: 60px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .nav-left {
    display: flex;
  }

  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 1rem;
  }

  a,
  form > button {
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 0.5rem;
  }

  .logout-btn {
    padding:0;
    width: 100%;
    text-align: center;
    background-color: rgba(156, 94, 94, 0.658);
    border-radius: 4px;
    border-style: none;
    font-size: 0.9rem;
  }
  .logout-btn:hover{
    background-color: rgba(155, 74, 74, 0.658);
    cursor: pointer;
  }

  form {
    height: 40px;
    min-width: 80px;
    width: 10%;
    display: flex;
    align-items: stretch;
  }

  a:hover {
    text-decoration: underline;
  }

  .login-btn {
    width: 10%;
    text-align: center;
    background-color: #4f709c;
    color: white;
    border-radius: 4px;
    padding: 0.5rem 1.2rem;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  .login-btn:hover {
    background-color: #3a5a78;
    text-decoration: none;
  }
</style>
