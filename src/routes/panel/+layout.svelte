<script lang="ts">
  // @ts-nocheck
  import { page } from '$app/state';
  
  // Përkthimet për panelin
  const translations = {
      en: {
          add: "Add Product",
          view: "View Products",
          notifications: "Notifications",
          messages: "Messages"
      },
      sq: {
          add: "Shto Produkt",
          view: "Shiko Produktet",
          notifications: "Njoftime",
          messages: "Mesazhe"
      }
  };
  
  type LanguageCode = keyof typeof translations;
  let currentLang: LanguageCode = 'en';
  
  if (typeof localStorage !== 'undefined') {
      const savedLang = localStorage.getItem('selectedLanguage') as LanguageCode;
      if (savedLang && translations[savedLang]) {
          currentLang = savedLang;
      }
  }
  
  // Krijimi i tabs me përkthime dinamike
  let tabs = [
      { id: 'add', label: translations[currentLang].add, route: "/panel/add" },
      { id: 'view', label: translations[currentLang].view, route: "/panel/view" },
      { id: 'notifications', label: translations[currentLang].notifications, route: "/panel/notifications" },
      { id: 'messages', label: translations[currentLang].messages, route: "/panel/messages" }
  ];
  
  let activeTab = $state('add');
  let mobileMenuOpen = $state(false);
  let { children } = $props();
  
  // Toggle për menunë mobile
  function toggleMobileMenu() {
      mobileMenuOpen = !mobileMenuOpen;
  }
  
  // Vendos tab-in aktiv sipas URL-së
  $effect(() => {
      const url = page.url.pathname.split("/");
      const temp = url[url.length - 1];
      activeTab = temp;
      return () => {
          mobileMenuOpen = false;
      }
  });
  </script>
  
  <!-- HTML + Styles që nuk kanë ndryshuar -->
  <div class="container">
      <button class="mobile-menu-button" onclick={toggleMobileMenu}>
          ☰
      </button>
      <nav class:open={mobileMenuOpen} class="sidebar">
          <ul>
          {#each tabs as tab}
              <li class:active={activeTab === tab.id}>
                  <a href={tab.route} onclick={() => mobileMenuOpen = false}>{tab.label}</a>
              </li>
          {/each}
          </ul>
      </nav>
      <main class="content">
          {@render children()}
      </main>
  </div>

  
  <style>
    /* Base Styles */
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      color: #212529;
      min-width: 320px; /* Prevent horizontal scrolling on very narrow screens */
    }
  
    /* Layout Styles */
    .container {
      display: flex;
      min-height: 100vh;
      position: relative;
      min-width: 320px; /* Minimum supported width */
      padding-top: 50px;
      
    }
  
    /* Mobile Menu Button */
    .mobile-menu-button {
      display: none;
      position: fixed;
      top: 10px;
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
        height: 100vh;
        z-index: 100;
        overflow-y: auto; /* Allow scrolling if content is too long */
        
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
    
    .sidebar li:hover a{
      background-color: #34495e;
    }
    
    .sidebar li.active {
      background-color: #3498db;
    }
    
    .sidebar a {
        display: block;
        padding: 12px 20px; /* Move padding to anchor */
        color: white;
        text-decoration: none;
        width: 100%;
        height: 100%;
    }
    a{
        text-decoration: none;
    }
    
    /* Main Content */
    .content {
        flex: 1;
        padding: 20px;
        background-color: #ffffff;
        min-height: 100vh;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        margin-left: 250px; /* Default for desktop */
        transition: margin-left 0.3s ease;
        position: relative; /* Add this to ensure proper stacking */
    }
    
    
    
    
    
    @media (max-width: 768px) {
        .content {
            margin-left: 0 !important; /* Remove margin completely on mobile */
            width: 100%; /* Take full width */
        }
      .mobile-menu-button {
        display: block;
      }
      
      .sidebar {
        transform: translateX(-100%);
        width: 280px;
      }
      
      .sidebar.open {
        transform: translateX(0);
        box-shadow: 2px 0 10px rgba(0,0,0,0.2);
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