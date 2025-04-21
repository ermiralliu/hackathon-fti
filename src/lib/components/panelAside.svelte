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
  :root {
    --color-sidebar-bg: #ffffff;
    --color-sidebar-text: #444;
    --color-sidebar-text-light: #777;
    --color-sidebar-border: #e0e0e0;
    --color-sidebar-shadow: rgba(0, 0, 0, 0.08);
    --color-accent: #007bff;
    --color-sidebar-hover-bg: #f8f9fa;
    --color-sidebar-active-indicator: var(--color-accent);
    --color-sidebar-active-text: var(--color-accent);
    --color-sidebar-active-bg: #e9ecef;
    --sidebar-width: 250px;
    --header-height: 60px;
  }

  :global(body){
    overflow-y: hidden;
  }

  .container {
    display: flex;
    min-height: calc(100vh - var(--header-height));
    /* overflow-y: auto; */
  }

  aside {
    position: sticky;
    /* align-self: stretch; */
    top: 300px;
    width: var(--sidebar-width);
    background-color: var(--color-sidebar-bg);
    color: var(--color-sidebar-text);
    box-shadow: 2px 0 5px var(--color-sidebar-shadow);
    z-index: 100;
    padding: 20px 0;
  }

  aside h3 {
    padding: 0 20px 15px;
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--color-sidebar-text-light);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--color-sidebar-border);
  }

  aside ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  aside li {
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    position: relative;
  }

  aside li:hover {
    background-color: var(--color-sidebar-hover-bg);
  }

  aside li a {
    display: block;
    padding: 12px 20px;
    color: var(--color-sidebar-text);
    text-decoration: none;
  }

  aside li.active {
    background-color: var(--color-sidebar-active-bg);
    font-weight: bold;
  }

  aside li.active a {
    color: var(--color-sidebar-active-text);
  }

  aside li.active:hover {
    background-color: var(--color-sidebar-active-bg);
  }

  aside li.active::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 4px;
    background-color: var(--color-sidebar-active-indicator);
    border-radius: 0 3px 3px 0;
  }

  .content {
    flex: 1;
    transition: margin-left 0.3s ease;
    overflow-y: scroll;
    height: 100%;
  }

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
