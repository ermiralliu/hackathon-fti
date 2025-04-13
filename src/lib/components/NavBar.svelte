<script>
    let tabs = [
        { name: "Home", link: "/" },
        { name: "Browse Products", link: "/products" },
        { name: "Bookmarks", link: "/bookmarks" },
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
    }
    a:hover {
        text-decoration: underline;
    }
    
</style>

<nav>
    <ul>
        {#each tabs as tab}
            <li><a href={tab.link}>{tab.name}</a></li>
        {/each}
    </ul>
</nav>
