<script>
    let tabs = [
        { name: "Home", link: "/" },
        { name: "Browse Products", link: "/products" },
        { name: "Panel", link: "/panel" }
    ];
</script>

<style>
    nav {
        background-color: #213555;
        padding: 1rem;
        position: fixed; 
        top: 0; 
        width: 100%;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        background-color: #4F709C;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        margin-right: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .login-btn:hover {
        background-color: #3a5a78;
        text-decoration: none;
    }
</style>

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