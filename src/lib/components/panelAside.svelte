<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  export type Tab = { id: string; label: string; route: string };

  let {
    tabs,
    activeTab,
    children,
  }: { tabs: Tab[]; activeTab: string; children: Snippet } = $props();

  import sidebarButton, {
    toggleOpen,
  } from "$lib/client/globalStates/sidebarButton.svelte";

  $inspect(sidebarButton.opened);
</script>

<div class="container">
  <!-- Mobile Menu Button -->
  <aside class:open={sidebarButton.opened}>
    <!-- Vertical Navigation Bar -->
    <nav
      class="sidebar"
      aria-label="Panel Navigation Sidebar"
      in:fly={{ x: "-200px", duration: 1000 }}
    >
      <h3>Actions</h3>
      <!-- You gotta love the way to sidebar flies in -->
      <ul>
        {#each tabs as tab}
          <li class:active={activeTab === tab.id}>
            <a href={tab.route} onclick={toggleOpen}>{tab.label}</a>
            <!-- data-sveltekit-preload-data="eager" // this could be used for interesting preload effects -->
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <div class="content">{@render children()}</div>
</div>

<style>
  /* Use CSS Variables for better theming */
  :root {
    --color-sidebar-bg: #ffffff; /* Lighter sidebar background */
    --color-sidebar-text: #444; /* Softer text color */
    --color-sidebar-text-light: #777; /* Lighter text for titles */
    --color-sidebar-border: #e0e0e0; /* Subtle border color */
    --color-sidebar-shadow: rgba(0, 0, 0, 0.08); /* Softer shadow */

    --color-accent: #007bff; /* Example modern accent blue */
    /* --color-accent: #28a745; /* Example modern accent green */
    /* --color-accent: #6f42c1; /* Example modern accent purple */

    --color-sidebar-hover-bg: #f8f9fa; /* Very subtle hover background */
    --color-sidebar-active-indicator: var(
      --color-accent
    ); /* Use accent for indicator */
    --color-sidebar-active-text: var(
      --color-accent
    ); /* Accent color for active text */
    --color-sidebar-active-bg: #e9ecef; /* Very light background for active */

    --sidebar-width: 250px; /* Define sidebar width as a variable */
    --header-height: 60px; /* Assuming a header height for padding below it */
  }

  .container {
    display: flex;
    min-height: calc(100vh - var(--header-height));
  }

  /* --- Sidebar/Navigation --- */
  .sidebar {
    width: var(--sidebar-width);
    background-color: var(--color-sidebar-bg);
    color: var(--color-sidebar-text);
    transition: transform 0.3s ease;
    height: 100%;
    box-shadow: 2px 0 5px var(--color-sidebar-shadow);
    z-index: 100;
    padding: 20px 0;
  }

  /* --- Sidebar Title --- */
  .sidebar h3 {
    margin-top: 3px;
    position: relative;
    padding: 0 20px 15px;
    color: var(--color-sidebar-text-light);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--color-sidebar-border);
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    padding: 0; /* Keep padding 0 here */
    margin: 0; /* Remove auto 5px margin */
    border-radius: 0; /* Remove large border radius */
    cursor: pointer;
    transition: background-color 0.2s ease-in-out; /* Smooth transition */
    position: relative;
  }

  .sidebar li:hover {
    background-color: var(--color-sidebar-hover-bg);
  }

  /* --- Sidebar List Item Link --- */
  .sidebar li a {
    display: block;
    padding: 12px 20px;
    color: var(--color-sidebar-text); /* Link color */
    text-decoration: none;
  }

  /* --- Sidebar Active State --- */
  .sidebar li.active {
    background-color: var(--color-sidebar-active-bg);
    font-weight: bold; /* Make text bold */
  }

  .sidebar li.active a {
    color: var(--color-sidebar-active-text); /* Accent color for active text */
  }

  .sidebar li.active:hover {
    background-color: var(
      --color-sidebar-active-bg
    ); /* Keep active background on hover */
  }

  /* Add the modern active indicator (left border) */
  .sidebar li.active::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px; /* Thickness of the indicator */
    background-color: var(
      --color-sidebar-active-indicator
    ); /* Use accent color */
    border-radius: 0 3px 3px 0; /* Optional: rounded ends for the line */
  }

  /* --- Main Content --- */
  .content {
    overflow: visible;
    flex: 1;
    transition: margin-left 0.3s ease;
  }

  /* .content:not(aside){
    overflow: auto;
  } */

  aside {
    position: sticky;
    top: 0;
    bottom: 0;
  }

  /* --- Mobile Styles --- */
  @media (max-width: 768px) {
    aside {
      /* Positioning and Sizing */
      position: fixed; /* Stay in place relative to the viewport */
      height: 100%;
      width: 250px;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out; /* Adjust duration and easing */

      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    }

    aside.open {
      transform: translateX(0);
    }

    .content {
      /* margin: 20px 80px; */
      /* margin-left: 0; */
      padding: 15px 40px;
      margin: 0;
      border-radius: 0;
      box-shadow: none;
    }
  }

  /* Extra small devices (phones, 400px and down) */
  @media (max-width: 400px) {
    .sidebar {
      width: 85vw; /* Take most of screen but leave some space */
    }
  }

  /* Optional: Style the scrollbar (for webkit browsers like Chrome, Safari) */
  .sidebar::-webkit-scrollbar {
    width: 8px;
  }

  .sidebar::-webkit-scrollbar-track {
    background: #f1f1f1; /* Light track */
  }

  .sidebar::-webkit-scrollbar-thumb {
    background: #888; /* Darker thumb */
    border-radius: 4px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover {
    background: #555; /* Even darker on hover */
  }
</style>
