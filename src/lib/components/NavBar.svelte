<script>
  let tabs = [
    { name: "Home", link: "/" },
    { name: "Browse Products", link: "/products" },
    { name: "Panel", link: "/panel" },
  ];
</script>

<nav>
  <div class="nav-left">
    <ul>
      {#each tabs as tab}
        <li><a href={tab.link}>{tab.name}</a></li>
      {/each}
    </ul>
  </div>
  <a href="/login" class="login-btn">Login</a>
</nav>

<style>
  nav {
    background-color: #213555;
    padding: 1rem;
    /* position: fixed; */
    position: sticky;
    top: 0; 
    width: 100%;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .nav-left {
    display: flex;
  }

  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 1rem;
  }

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 0.5rem;
  }

  a:hover {
    text-decoration: underline;
  }

  .login-btn {
    background-color: #4f709c;
    color: white;
    border-radius: 4px;
    padding: 0.5rem 1.2rem;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  .login-btn:hover {
    background-color: #3a5a78;
    text-decoration: none;
  }
</style>
