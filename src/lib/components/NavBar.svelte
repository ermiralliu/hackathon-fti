<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { SubmitFunction, ActionResult } from "@sveltejs/kit";
  import type { MouseEventHandler } from "svelte/elements";

  import sidebarButton, {toggleOpen} from "$lib/client/globalStates/sidebarButton.svelte";

  let tabs = [
    { name: "Home", link: "/" },
    { name: "Browse Products", link: "/products" },
    { name: "Panel", link: "/panel" },
  ];

  let { isLogged }: { isLogged: boolean } = $props();

  let dropdownOpen = $state(false);

  let dropdownVisibility = $state(false);

  const handleLogout: SubmitFunction = () => {
    console.log("Form Called");
    return async ({ result }: { result: ActionResult }) => {
      console.log(JSON.stringify(result));

      console.log("Form result received");
      const res = result as ActionResult & { success: boolean };
      if (res.success) {
        toggleDropdown();
        goto("/", { invalidateAll: true });
      }
    };
  };

  let closeTimeoutId: NodeJS.Timeout | undefined;

  function toggleDropdown() {
    const nextDropdownOpen = !dropdownOpen;

    clearTimeout(closeTimeoutId);
    closeTimeoutId = undefined; // Reset the ID

    if (nextDropdownOpen) {
      // When opening, set visibility to true immediately
      dropdownVisibility = true;
    } else {
      // When closing, schedule the visibility update after a delay
      closeTimeoutId = setTimeout(() => {
        dropdownVisibility = false;
      }, 200);
    }

    // Update the primary state immediately
    dropdownOpen = nextDropdownOpen;
  }
  $inspect(sidebarButton.opened);

  const softNavigation: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    toggleDropdown();
    const target = e.target as EventTarget & { href: string };
    console.log(target.href);
    goto(target.href);
  };
</script>

<header>
  <nav class="nav">
    <div class="nav-left">
      <button
        class="mobile-menu-button"
        aria-hidden={sidebarButton.opened}
        aria-label="Toggle Sidebar"
        onclick={toggleOpen}
      >
        ☰
      </button>
      <ul>
        {#each tabs as tab}
          <li><a href={tab.link}>{tab.name}</a></li>
        {/each}
      </ul>
    </div>
  </nav>
  <div class="user-dropdown">
    <button
      class="user-dropdown-trigger"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="User menu"
      onclick={toggleDropdown}
    >
      👤
    </button>
    <menu
      class="dropdown-menu"
      class:is-open={dropdownOpen}
      style:visibility={dropdownVisibility ? "visible" : "hidden"}
    >
      {#if isLogged}
        <li role="none">
          <a href="/profile" role="menuitem" onclick={softNavigation}>Profile</a
          >
        </li>
        <li role="none">
          <a href="/settings" role="menuitem">Settings</a>
        </li>
        <li role="none" class="logout-li">
          <form method="POST" action="/logout" use:enhance={handleLogout}>
            <button type="submit" aria-label="Log Out" class="logout-btn"
              >Log Out</button
            >
          </form>
        </li>
      {:else}
        <li role="none">
          <a href="/login" role="menuitem" onclick={softNavigation}>Log In</a>
        </li>
      {/if}
    </menu>
  </div>
</header>

<style>
  .nav {
    position: sticky;
    width: 100%;
    z-index: 1;
  }
  .nav a:hover {
    text-decoration: underline;
  }

  header {
    height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    background-color: #213555;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-left {
    display: flex;
    align-self: stretch;
    align-items: stretch;
    margin-bottom: 3px;
  }

  .nav-left ul li{
    display: flex;
    align-items: center;
  }

  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 2rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }

  .logout-btn {
    margin: auto;
    width: 100%;
    background-color: inherit;
    color: white;
    font: inherit;
    font-weight: bold;
    border-style: none;
    cursor: pointer;
  }

  /* --- Minimal CSS for Dropdown Functionality --- */

  /* 1. Container needs relative positioning */
  .user-dropdown {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0;
  }

  /* 2. The dropdown menu is absolutely positioned relative to its container */
  .dropdown-menu {
    position: absolute;
    top: 100%; /* Positions the top edge of the menu just below the trigger */
    right: 0;
    display: block;
    visibility: hidden;
    list-style: none;
    padding: 4px 0;
    padding-bottom: 5px;
    margin: 0;
    z-index: 1000;
    transition: opacity 0.2s ease-in-out;
    transition-delay: 10ms;
    opacity: 0;
    width: 10vw;
    min-width: 120px;

    background-color: #2c3e50;
    border-bottom-left-radius: 12px;
  }

  /* 3. Rule to show the menu when the 'is-open' class is applied by JavaScript */
  .dropdown-menu.is-open {
    visibility: visible;
    opacity: 1;
  }

  /* Minimal styling for menu items to ensure they are block elements */
  .dropdown-menu li {
    min-height: 40px;
    /* display: block; */
    margin: 0 5px;
    text-align: center;
    border-radius: 12px;
  }

  .logout-li {
    display: flex;
    align-items: stretch;
  }
  .logout-li form {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .dropdown-menu a,
  .dropdown-menu button {
    text-decoration: none;
    display: block;
    width: 100%;
  }

  .dropdown-menu li:hover {
    background-color: #34495e;
  }

  .user-dropdown-trigger {
    cursor: pointer;
    background-color: lightblue;
    border: none;
    border-radius: 11px;
    color: white;
    height: 100%;
    max-height: 42px;
    min-width: 42px;
    margin-right: 1.5vw;
    font-size: 1.2rem;
  }
  .user-dropdown-trigger:hover {
    background-color: rgb(198, 224, 233);
  }

  /* Mobile Menu Button */
  .mobile-menu-button {
    visibility: hidden;
    width: 0;
    transition: width 0.3s ease-out;
    padding-bottom: 6px;
    margin-left: 10px;
    cursor: pointer;
    background: #213555;
    color: white;
    border: none;
    font-size: 20px;
  }

  @media (max-width: 768px) {
    .mobile-menu-button {
      visibility: visible;
      width: 5vw;
    }
  }
</style>
