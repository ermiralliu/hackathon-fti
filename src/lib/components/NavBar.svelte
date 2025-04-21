<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { SubmitFunction, ActionResult } from "@sveltejs/kit";
  import type { MouseEventHandler } from "svelte/elements";

  import sidebarButton, {
    toggleOpen,
  } from "$lib/client/globalStates/sidebarButton.svelte";

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
  /* Use CSS Variables for better theming within the header */
  /* Define colors specific to the header, potentially linking to a global palette */
  :root {
    --header-bg: #2c3e50; /* A refined dark blue/grey */
    --header-link-color: #ecf0f1; /* Light text for links */
    --header-link-hover-color: #3498db; /* Example highlight color */
    --header-shadow: rgba(0, 0, 0, 0.1); /* Softer shadow */

    --dropdown-bg: #ffffff; /* Lighter dropdown background */
    --dropdown-border-color: #e0e0e0; /* Subtle border */
    --dropdown-text-color: #333;
    --dropdown-item-hover-bg: #f8f9fa; /* Very subtle item hover */

    --trigger-bg: transparent; /* Make trigger background transparent by default */
    --trigger-color: var(
      --header-link-color
    ); /* Use link color for trigger icon/text */
    --trigger-hover-bg: rgba(255, 255, 255, 0.1); /* Subtle hover on trigger */
  }

  .nav {
    width: 100%;
    z-index: 1000;
  }

  /* --- Header (Core Flex Container) --- */
  header {
    position: sticky;
    top: 0;
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
    margin-left: -20px; /* Compensate for header left padding */
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
  /* Keep the hover rule but make it a color change */
  .nav-left a:hover {
    text-decoration: none; /* Ensure no underline */
    color: var(--header-link-hover-color); /* Change color on hover */
    /* Optional: Subtle bottom border animation */
    /* border-bottom: 2px solid var(--header-link-hover-color); */
    /* padding-bottom: 3px; // Adjust padding to make space for border */
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
    font-size: 1.2em; /* Adjust font size for icon/initials */
    margin-right: 0; /* Adjust margin - padding on header handles space */
    transition: background-color 0.2s ease-in-out; /* Smooth hover */
    /* Remove min-width: 42px; and max-height: 42px; as height/width are set */
  }
  .user-dropdown-trigger:hover {
    background-color: var(--trigger-hover-bg); /* Subtle hover background */
  }

  /* --- Dropdown Menu --- */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    /* Keep display, visibility, opacity for fade transition */
    /* display: block; */ /* This will be block when visible */
    /* visibility: hidden; */
    list-style: none;
    padding: 8px 0; /* Adjust vertical padding */
    margin: 0;
    z-index: 1000;
    transition:
      opacity 0.2s ease-in-out,
      visibility 0.2s ease-in-out; /* Transition both */
    transition-delay: 0ms; /* Remove delay or adjust */
    opacity: 0;
    width: 150px; /* Give it a fixed width */
    /* Remove min-width: 120px; if width is fixed */

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
    /* min-height: 40px; */ /* Keep min-height or use padding on content */
    display: flex; /* Keep flex */
    align-items: center; /* Keep center alignment */
    /* Remove horizontal margin inside li */
    margin: 0;
    /* Remove text-align: center; - flex + justify/align is better for centering content */
    text-align: left; /* Default text alignment */
    /* Remove border-radius: 12px; - Apply padding/hover background to the link/button inside */
    border-radius: 0; /* Ensure no rounding on the list item itself */
    transition: background-color 0.2s ease-in-out; /* Smooth hover background */
  }

  /* --- Dropdown Menu Links/Buttons --- */
  .dropdown-menu a,
  .dropdown-menu button {
    text-decoration: none;
    display: block;
    width: 100%;
    padding: 10px 15px; /* Add padding to the interactive element */
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
    /* background-color: inherit; Remove */
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
    /* Keep default hidden state for desktop */
    visibility: hidden;
    width: 0;
    /* Adjust transition if needed */
    transition:
      width 0.3s ease-out,
      visibility 0.3s ease-out;

    /* Basic styling */
    background: none; /* Remove background color */
    color: var(--header-link-color); /* Use variable for color */
    border: none;
    font-size: 1.5em; /* Larger icon size */
    padding: 0 15px; /* Add horizontal padding */
    margin-left: 0; /* Remove margin-left: 10px; - padding handles spacing */
    cursor: pointer;
    display: flex; /* Use flex to center icon */
    align-items: center;
    justify-content: center;
    height: 60px; /* Match header height for click area */
  }

  /* .mobile-menu-button.hidden { visibility: hidden; width: 0; } */ /* Redundant */

  /* Mobile Media Query */
  @media (max-width: 768px) {
    .nav-left {
      margin-left: 0; /* Remove negative margin on mobile */
    }
    .nav-left ul {
      /* Hide the main navigation links on mobile */
      display: none;
    }

    .mobile-menu-button {
      visibility: visible;
      width: auto; /* Let width be determined by padding/content */
      transition:
        width 0.3s ease-out,
        visibility 0.3s ease-out; /* Keep transition */
    }

    header {
      padding: 0 10px; /* Adjust header padding on mobile */
    }
    .user-dropdown-trigger {
      margin-right: 0; /* Remove margin on mobile */
    }
  }

  /* Optional: Adjust dropdown position if header padding changes */
  /* @media (max-width: 768px) {
    .dropdown-menu {
        right: 10px; // Match header right padding
    }
} */
</style>
