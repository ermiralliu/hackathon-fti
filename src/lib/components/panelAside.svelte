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
  <aside
    class:open={sidebarButton.opened}
    in:fly={{ x: "-200px", duration: 600 }}
  >
    <!-- Vertical Navigation Bar -->
    <nav aria-label="Panel Navigation Sidebar">
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
  :root {
    --color-sidebar-bg: #fcfcfc;
    --color-content-bg: #f8f8f8;
    --color-content-inside-bg: var(
      --color-sidebar-bg
    );
    --color-sidebar-text: #444;
    --color-sidebar-text-light: #777;
    --color-sidebar-border: #e0e0e0;
    --color-sidebar-shadow: rgba(0, 0, 0, 0.08);
    --color-accent: #007bff;
    --color-sidebar-active-indicator: var(
      --color-accent
    );
    --color-sidebar-active-text: var(
      --color-accent
    );
    --color-sidebar-active-bg: #e9ecef;
    --sidebar-width: 250px;
    --header-height: 60px;
  }

  /* Layout Styles */
  .container {
    background-color: var(--color-content-inside-bg);
    display: flex;
    min-height: 100vh;
    min-width: 320px; /* Minimum supported width */
  }

  /* Sidebar/Navigation */
  aside {
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    margin-top: 0px;
    width: var(--sidebar-width);
    background-color: var(--color-sidebar-bg);
    color: var(--color-sidebar-text);
    box-shadow: 2px 0 5px var(--color-sidebar-shadow);
    z-index: 100;
    padding: 20px 0; /* Keep vertical padding */
    overflow-y: auto; /* Use auto for scrolling */
    transition: transform 0.3s ease;
  }

  /* Sidebar Title */
  aside h3 {
    padding: 0 20px 15px;
    margin-top: 0;
    margin-bottom: 15px;
    margin-left: 0;
    color: var(--color-sidebar-text-light);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--color-sidebar-border); /* Use variable */
  }

  aside ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  aside li {
    padding: 0; /* Keep padding 0 here */
    margin: 0; /* Remove auto 5px margin */
    border-radius: 0; /* Remove large border radius */
    cursor: pointer;
    transition: background-color 0.2s ease-in-out; /* Smooth transition */
    position: relative; /* Needed for active indicator */
  }

  aside li:hover {
    background-color: var(--color-sidebar-hover-bg); /* Use variable */
  }

  /* Sidebar List Item Link */
  aside li a {
    display: block;
    padding: 12px 20px; /* Padding on the link is correct */
    color: var(--color-sidebar-text); /* Use variable */
    text-decoration: none;
  }

  /* Sidebar Active State */
  aside li.active {
    background-color: var(--color-sidebar-active-bg); /* Use variable */
    font-weight: bold; /* Make text bold */
  }

  aside li.active a {
    color: var(--color-sidebar-active-text); /* Use variable */
  }

  aside li.active:hover {
    background-color: var(
      --color-sidebar-active-bg
    ); /* Keep active background on hover */
  }

  /* Add the modern active indicator (left border) */
  aside li.active::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px; /* Thickness of the indicator */
    background-color: var(--color-sidebar-active-indicator); /* Use variable */
    border-radius: 0 3px 3px 0; /* Optional: rounded ends for the line */
  }

  /* Main Content */
  .content {
    flex: 1;
    padding: 20px;
    padding-top: 25px;
    background-color: var(--color-content-bg);
    min-height: 100vh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-left: 250px; /* Default for desktop */
    transition: margin-left 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: visible;
  }

  /* .content:not(aside){ overflow: auto; } */ /* Remove invalid rule */

  /* Mobile Styles */
  @media (max-width: 768px) {
    .content {
      margin-left: 0 !important;
      width: 100%;
      padding: 2% 6%;
    }

    /* Mobile Sidebar Positioning & Sliding */
    aside {
      width: 250px;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    }

    aside.open {
      transform: translateX(0); /* Slide into view on mobile */
    }
  }

  /* Extra small devices (phones, 400px and down) */
  @media (max-width: 400px) {
    aside {
      width: 85vw; /* Adjust width */
      transform: translateX(-85vw); /* Hide based on new width */
    }

    aside.open {
      transform: translateX(0);
    }
  }

  /* Optional: Style the scrollbar (for webkit browsers like Chrome, Safari) */
  aside::-webkit-scrollbar {
    width: 8px;
  }

  aside::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  aside::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  aside::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style>
