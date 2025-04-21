<script lang="ts">
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  export type Tab = { id: string; label: string; route: string };

  let {
    tabs,
    activeTab,
    children,
  }: { tabs: Tab[]; activeTab: string; children: Snippet } = $props();

  import sidebarButton, { toggleOpen } from "$lib/client/globalStates/sidebarButton.svelte";

  // let mobileMenuOpen = $state(false);

  // // Toggle mobile menu
  // function toggleMobileMenu() {
  //   mobileMenuOpen = !mobileMenuOpen;
  // }
</script>

<div class="container">
  <!-- Mobile Menu Button -->
  <!-- <button class="mobile-menu-button" onclick={toggleMobileMenu}> ☰ </button> -->
  <aside>
    <!-- Vertical Navigation Bar -->
    <nav
      class:open={sidebarButton.opened}
      class="sidebar"
      aria-label="Panel Navigation Sidebar"
      in:fly={{ x: "-200px", duration: 1000 }}
    >
      <h3>Actions</h3>
      <!-- You gotta love the way to sidebar flies in -->
      <ul>
        {#each tabs as tab}
          <li class:active={activeTab === tab.id}>
            <a href={tab.route} onclick={toggleOpen}
              >{tab.label}</a
            >
            <!-- data-sveltekit-preload-data="eager" // this could be used for interesting preload effects -->
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <div class="content">{@render children()}</div>
</div>

<style>
  h3 {
    position: relative; /* Needed for absolute positioning of the ::after element */
    padding-bottom: 8px; /* Add space between text and where the line will sit */
    margin-bottom: 15px;
    margin-left: 20px;
  }

  h3::after {
    content: ""; /* Required for pseudo-elements */
    display: block; /* Make the pseudo-element a block */
    position: absolute; /* Position it relative to the h3 */
    bottom: 0; /* Align its bottom edge with the h3's padding edge */
    left: -5%;
    width: 95%; /* Make the line span the full width */
    height: 1px; /* Example: Make the line 2px thick */
    background-color: #8292ac; /* Example: Solid color before blur */
    z-index: 1; /* Ensure it sits above content if needed */

    /* --- Apply the blur filter --- */
    filter: blur(
      1px
    ); /* Adjust the pixel value to control the amount of blur */
  }

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

  /* Sidebar/Navigation */
  .sidebar {
    margin-top: 0px;
    width: 250px;
    background-color: #2c3e50;
    color: white;
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
    margin: auto 5px;
    border-radius: 18px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .sidebar li:hover {
    background-color: #34495e;
  }

  .sidebar li.active {
    background-color: #3498db;
  }

  .sidebar li.active:hover {
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
      padding: 6%;
      padding-left: 8%;
    }

    .sidebar {
      /* padding-top: 8vh; */
      transform: translateX(-100%);
      width: 280px;
    }

    .sidebar.open {
      transform: translateX(0);
    }
  }

  /* Extra small devices (phones, 400px and down) */
  @media (max-width: 400px) {
    .sidebar {
      width: 85vw; /* Take most of screen but leave some space */
    }
  }
</style>
