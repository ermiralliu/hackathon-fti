<script lang="ts">
  import type { Snippet } from "svelte";
  import { fade, fly } from "svelte/transition";

  export type Tab = { id: string; label: string; route: string };

  let {
    tabs,
    activeTab,
    children,
  }: { tabs: Tab[]; activeTab: string; children: Snippet } = $props();

  import sidebarButton, {
    toggleOpen,
  } from "$lib/client/globalStates/sidebarButton.svelte";
    import verticalTransition from "../transitions/verticalTransition";

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
  {#key activeTab}
    <div class="content" out:verticalTransition={{duration: 250}} in:fade={{delay:150,duration:200}}>{@render children()}</div>
  {/key}
</div>

<style>
  /* --- Apply variables to Layout Components --- */

  /* Container holding sidebar + content */
  .container {
    /* This container might not need its own background if html/body handles it,
     or it might represent the main content block background */
    background-color: var(
      --color-bg-page
    );
    /* display: flex; */
    min-height: 100vh;
    min-width: 320px;
  }

  /* Sidebar/Navigation */
  aside {
    position: fixed;
    top: var(--header-height);
    bottom: 0;
    margin-top: 0px;
    width: var(--sidebar-width);
    box-shadow: 2px 0 5px var(--color-shadow);
    /* This needs a background-color, otherwise it's transparent */
    background-color: var(--color-bg-component);
    z-index: 100;
    padding: 20px 0;
    overflow-y: auto;
    transition: transform 0.3s ease;
  }

  /* Sidebar Title */
  aside h3 {
    padding: 0 20px 15px;
    margin: 0 0 15px 0; /* Adjusted margin */
    color: var(--color-text-secondary); /* Use secondary text color */
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--color-border); /* Use border variable */
  }

  aside ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  aside li {
    padding: 0;
    margin: 0;
    border-radius: 0;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    position: relative;
  }

  aside li:hover {
    background-color: var(--color-bg-hover);
  }

  /* Sidebar List Item Link */
  aside li a {
    display: block;
    padding: 12px 20px;
    color: var(--color-text-primary);
    text-decoration: none;
  }

  /* Sidebar Active State */
  aside li.active {
    background-color: var(--color-bg-active);
    font-weight: bold;
  }

  aside li.active a {
    color: var(--color-text-accent);
  }

  /* Keep active hover same as active */
  aside li.active:hover {
    background-color: var(--color-bg-active);
  }

  /* Active indicator */
  aside li.active::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--color-indicator-active);
    border-radius: 0 3px 3px 0;
  }

  /* Main Content Area */
  .content {
    /* flex: 1; */
    padding: 20px 20px 20px;
    /* height: 100%; */
    margin-left: var(--sidebar-width);
    transition: margin-left 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: visible;
  }

  /* --- Mobile Styles (Layout unchanged, colors inherit) --- */
  @media (max-width: 768px) {
    .content {
      margin-left: 0 !important; /* Sidebar collapses */
      width: 100%;
      /* padding: 2% 6%; */
      padding: 0;
      margin-top: 0;
    }

    aside {
      width: var(--sidebar-width); /* Use variable */
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 2px 0 5px var(--color-shadow); /* Use shadow variable */
    }

    aside.open {
      transform: translateX(0);
    }
  }

  @media (max-width: 400px) {
    aside {
      width: 85vw;
      transform: translateX(-85vw);
    }

    aside.open {
      transform: translateX(0);
    }
  }

  /* Optional: Style the scrollbar using variables */
  aside::-webkit-scrollbar {
    width: 8px;
  }

  aside::-webkit-scrollbar-track {
    background: var(--color-bg-component); /* Match sidebar background */
  }

  aside::-webkit-scrollbar-thumb {
    background: var(
      --color-text-secondary
    ); /* Use secondary text color (or border) */
    border-radius: 4px;
  }

  aside::-webkit-scrollbar-thumb:hover {
    background: var(
      --color-text-primary
    ); /* Use primary text color (or a darker gray) */
  }
</style>
