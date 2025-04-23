<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { SubmitFunction, ActionResult } from "@sveltejs/kit";
  import type { MouseEventHandler } from "svelte/elements";

  import sidebarButton, {
    toggleOpen,
  } from "$lib/client/globalStates/sidebarButton.svelte";
  import InputSwitch from "./inputSwitch.svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let tabs = [
    { name: "Home", link: "/" },
    { name: "Browse Products", link: "/products" },
    { name: "Panel", link: "/panel" },
  ];

  let { isLogged }: { isLogged: boolean } = $props();

  let dropdownOpen = $state(false);
  let dropdownVisibility = $state(false);
  let dropdownRef: HTMLMenuElement;

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

  function toggleDropdown(e?: MouseEvent) {
    e?.stopPropagation(); // this was key. It stops document from immediately closing it

    const nextDropdownOpen = !dropdownOpen;

    clearTimeout(closeTimeoutId);
    closeTimeoutId = undefined; // Reset the ID

    if (nextDropdownOpen) {
      dropdownVisibility = true;
    } else {
      closeTimeoutId = setTimeout(() => {
        dropdownVisibility = false;
      }, 200);
    }

    // Update the primary state immediately
    dropdownOpen = nextDropdownOpen;
  }

  const softNavigation: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    toggleDropdown();
    const target = e.target as EventTarget & { href: string };
    console.log(target.href);
    goto(target.href);
  };

  // The section here is all about dark mode toggle
  let isDarkMode = $state(false);

  onMount(() => {
    if (!browser || !window.localStorage) return;
    const id = "theme-switch";
    if (localStorage.getItem(`toggle-switch-${id}-preference`)) return;

    function applyTheme(isDark: boolean) {
      isDarkMode = isDark;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      applyTheme(true);
    } else {
      applyTheme(false);
    }
  });

  $effect(() => {
    if (isDarkMode && !document.body.classList.contains("dark-mode")) {
      document.body.classList.add("dark-mode");
    } else if (!isDarkMode && document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
    }
  });

  // The section in here will be all about sq, en language toggle
  let isEnglish = $state(true);
</script>

<header>
  <nav class="nav">
    <div class="nav-left">
      <button
        class="mobile-menu-button"
        class:hidden={!sidebarButton.isPanelPage}
        aria-hidden={!sidebarButton.isPanelPage}
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
      bind:this={dropdownRef}
    >
      <li role="none" class="theme-switch-li">
        <InputSwitch
          id="theme-switch"
          bind:isOn={isDarkMode}
          labelText="Theme Toggle"
          ariaLabel="Toggle light or dark mode"
        />
      </li>
      <li role="none" class="theme-switch-li">
        <InputSwitch
          id="language-switch"
          bind:isOn={isEnglish}
          labelText={isEnglish ? "English" : "Shqip"}
          ariaLabel="Toggle Albanian or English"
        />
      </li>
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

<svelte:document
  onclick={e => {
    console.log(dropdownOpen);
    if (dropdownOpen) {
      const clickedInsideMenu = dropdownRef.contains(e.target as Node);
      if (!clickedInsideMenu) {
        toggleDropdown();
      }
    }
  }}
/>

<style>

  :root {
    /* --- Navbar Color Variables (Modified) --- */
    --header-bg: #2c3e50; 
    /* --header-bg: #2c3e50;  */
    /* --header-bg: var(--color-text-accent); */
    --header-link-color: lightgray;
    /* --header-link-hover-color: var(--color-accent); */
    --header-link-hover-color: lightgreen;
    --header-shadow: var(--color-shadow);

    --dropdown-bg: var(--color-bg-component);
    --dropdown-border-color: var(--color-border);
    --dropdown-text-color: var(--color-text-primary);
    --dropdown-item-hover-bg: var(--color-bg-hover);

    --trigger-bg: transparent;
    --trigger-color: var(--header-link-color);
    --trigger-hover-bg: rgba(0, 0, 0, 0.05);
  }

  :global(.dark-mode) {
    --header-bg: #030303; 
    --header-link-color: var(--color-text-primary);
    --header-link-hover-color: var(--color-accent);
    --header-shadow: var(--color-shadow);

    --dropdown-bg: var(--color-bg-component);
    --dropdown-border-color: var(--color-border);
    --dropdown-text-color: var(--color-text-primary);
    --dropdown-item-hover-bg: var(--color-bg-hover);

    --trigger-color: var(--header-link-color);
    --trigger-hover-bg: rgba(255, 255, 255, 0.08);
  }

  /* --- Header (Core Flex Container) --- */
  header {
    position: sticky;
    color: #dbdee4;
    top: 0;
    z-index: 100;
    height: 60px;
    box-shadow: 0 2px 6px var(--header-shadow);
    background-color: var(--header-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  /* --- Nav Left (Left side of Header - Flex Item) --- */
  .nav-left {
    display: flex;
    align-items: center;
    margin-left: 0;
  }

  .nav-left ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .nav-left ul li {
    margin: 0 15px;
  }

  header a {
    color: var(--header-link-color); /* Use variable for color */
    text-decoration: none; /* Keep no underline by default */
    font-weight: 500; /* Use a slightly less bold weight for a modern look */
    font-size: 1em;
    transition: color 0.2s ease-in-out; /* Smooth color transition on hover */
    display: flex; /* Use flex to center icon/text if needed */
    align-items: center;
    padding: 5px 0; /* Add vertical padding for larger click/hover area */
  }

  /* --- Nav Link Hover --- */
  .nav-left a:hover {
    color: var(--header-link-hover-color);
    text-shadow: 0 0 12px rgba(106, 166, 170, 0.904);
  }

  /* --- User Dropdown Container --- */
  .user-dropdown {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    /* padding: 0; */ /* Remove padding here if trigger padding is used */
  }

  /* --- User Dropdown Trigger Button --- */
  .user-dropdown-trigger {
    cursor: pointer;
    /* Refine appearance */
    background-color: var(--trigger-bg); /* Transparent background */
    border: none;
    border-radius: 50%; /* Make it round */
    color: var(--trigger-color); /* Use variable for color */
    height: 40px; /* Define a fixed size */
    width: 40px; /* Make it square */
    display: flex; /* Use flex to center icon/text */
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    margin-right: 0;
    transition: background-color 0.2s ease-in-out;
  }
  .user-dropdown-trigger:hover {
    background-color: var(--trigger-hover-bg); /* Subtle hover background */
  }

  /* --- Dropdown Menu --- */
  .dropdown-menu {
    position: absolute;
    visibility: hidden;
    top: 100%;
    right: 0;
    list-style: none;
    padding: 8px 0; /* Adjust vertical padding */
    margin: 0;
    z-index: 1000;
    transition:
      opacity 0.2s ease-in-out,
      visibility 0.2s;
    transition-delay: 0ms;
    opacity: 0;
    width: 150px;

    background-color: var(--dropdown-bg); /* Use variable for background */
    border: 1px solid var(--dropdown-border-color); /* Add subtle border */
    border-radius: 8px; /* Consistent rounding for the menu */
    box-shadow: 0 4px 12px var(--card-shadow); /* Use the same soft shadow */
  }

  /* Rule to show the menu (Keep as is) */
  .dropdown-menu.is-open {
    visibility: visible;
    opacity: 1;
  }

  /* --- Dropdown Menu Items --- */
  .dropdown-menu li {
    display: flex;
    align-items: center;
    margin: 0;
    text-align: left;
    border-radius: 0;
    transition: background-color 0.2s ease-in-out;
  }

  /* --- Dropdown Menu Links/Buttons --- */
  .dropdown-menu a,
  .dropdown-menu button {
    text-decoration: none;
    display: block;
    width: 100%;
    padding: 10px 15px;
    color: var(--dropdown-text-color); /* Use variable for text color */
    font-weight: normal; /* Regular font weight */
    text-align: left; /* Align text to the left */
  }
  .logout-li form {
    /* Ensure form does not interfere */
    width: 100%;
    display: flex;
    align-items: center;
  }
  .logout-btn {
    /* Style the button inside the dropdown item */
    background: none; /* No background */
    color: var(--dropdown-text-color); /* Use variable */
    font: inherit;
    font-weight: normal; /* Regular weight */
    border: none;
    cursor: pointer;
    width: 100%; /* Take full width */
    padding: 10px 15px; /* Match link padding */
    text-align: left; /* Align text to the left */
    transition: none; /* No transition on the button itself, parent li handles hover */
    margin: 0; /* Remove auto margin */
  }

  /* --- Dropdown Menu Item Hover --- */
  .dropdown-menu li:hover {
    background-color: var(
      --dropdown-item-hover-bg
    ); /* Use variable for subtle hover */
  }

  /* --- Mobile Menu Button --- */
  .mobile-menu-button {
    transition:
      width 0.3s ease-out,
      opacity 0.3s ease-out,
      padding 0.3s ease-out,
      visibility 0.3s ease-out;

    /* Basic styling */
    background: none;
    color: var(--header-link-color);
    border: none;
    font-size: 1.5em;
    padding: 0 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    /* I wish I knew a way to remove this redundancy */
    visibility: hidden;
    width: 0;
    opacity: 0;
    padding: 0;
  }
  .mobile-menu-button.hidden {
    visibility: hidden;
    width: 0;
    opacity: 0;
    padding: 0;
  }

  /* Mobile Media Query */
  @media (max-width: 768px) {
    .nav-left {
      margin-left: 0;
    }

    .mobile-menu-button {
      visibility: visible;
      opacity: 1;
      width: 50px;
      padding: 0 4px;
    }

    header {
      padding: 0 10px; /* Adjust header padding on mobile */
    }
    .user-dropdown-trigger {
      margin-right: 0; /* Remove margin on mobile */
    }
  }

  .theme-switch-li {
    /* Apply this class to the li */
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
  }
</style>
