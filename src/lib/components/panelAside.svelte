<script lang="ts">
  import type { Snippet } from "svelte";

  export type Tab = { id: string; label: string; route: string };

  let {
    tabs,
    activeTab,
    children,
  }: { tabs: Tab[]; activeTab: string; children: Snippet } = $props();

  let mobileMenuOpen = $state(false);

  // Toggle mobile menu
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

</script>

<div class="container">
  <!-- Mobile Menu Button -->
  <aside>
    <button class="mobile-menu-button" onclick={toggleMobileMenu}> ☰ </button>
    <!-- Vertical Navigation Bar -->
    <nav
      class:open={mobileMenuOpen}
      class="sidebar"
      aria-label="Panel Navigation Sidebar"
    >
      <ul>
        {#each tabs as tab}
          <li class:active={activeTab === tab.id}>
            <a href={tab.route} onclick={() => (mobileMenuOpen = false) }
              >{tab.label}</a>
              <!-- data-sveltekit-preload-data="eager" // this could be used for interesting preload effects -->
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <div class="content">{@render children()}</div>
</div>

<style>
  aside {
    display: flex;
    flex-direction: column;
  }
  /* Layout Styles */
  .container {
    /* padding-top: 0; */
    display: flex;
    min-height: 100vh;
    min-width: 320px; /* Minimum supported width */
  }

  /* Mobile Menu Button */
  .mobile-menu-button {
    display: none;
    position: fixed;
    top: 10.5vh;
    left: 10px;
    z-index: 1000;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 20px;
  }

  /* Sidebar/Navigation */
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    padding: 20px 0;
    transition: transform 0.3s ease;
    position: fixed;
    min-height: 100vh;
    box-shadow: 5px 0 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
    overflow-y: visible; /* Allow scrolling if content is too long */
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    padding: 0;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .sidebar li:hover a {
    background-color: #34495e;
  }

  .sidebar li.active {
    background-color: #3498db;
  }

  .sidebar li.active:hover a{
    background-color: #65a9d6;
  }

  .sidebar a {
    display: block;
    padding: 12px 20px; /* Move padding to anchor */
    color: white;
    text-decoration: none;
    width: 100%;
    height: 100%;
  }

  a {
    text-decoration: none;
  }

  /* Main Content */
  .content {
    flex: 1;
    padding: 20px;
    padding-top: 25px;
    background-color: #ffffff;
    min-height: 100vh;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-left: 250px; /* Default for desktop */
    transition: margin-left 0.3s ease;
    position: relative; /* Add this to ensure proper stacking */
  }

  @media (max-width: 768px) {
    .content {
      margin-left: 0 !important; /* Remove margin completely on mobile */
      width: 100%; /* Take full width */
      padding:5%;
    }
    .mobile-menu-button {
      display: block;
    }

    .sidebar {
      padding-top: 8vh;
      transform: translateX(-100%);
      width: 280px;
    }

    .sidebar.open {
      transform: translateX(0);
    }
  }

  @media (max-width: 576px) {
    /* Ensure buttons don't overflow */
    button {
      white-space: normal;
      word-wrap: break-word;
    }
  }

  /* Extra small devices (phones, 400px and down) */
  @media (max-width: 400px) {
    .sidebar {
      width: 85vw; /* Take most of screen but leave some space */
    }

    /* Adjust button sizes */
    button {
      padding: 8px 12px;
      font-size: 14px;
    }
  }
</style>
