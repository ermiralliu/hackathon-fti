<!-- src/routes/products/+page.svelte -->
<script>
    import { goto } from '$app/navigation';
    import { fade, fly } from 'svelte/transition';
    let {data} = $props();
    
    let products = $derived(data.products.products || []);
    let isLoading = $derived(false);
    let error = $derived(false);
    let currentPage = $derived(data.products.currentPage);
    let totalPages = $derived(data.products.totalPages);
    
    async function reloadProducts() {
        window.location.reload();
    }

    /**
     * @param {number} page
     */
    function changePage(page) {
        goto(`/products?page=${page}`, {noScroll:true});
    }

    function getPageNumbers() {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

</script>

<main class="products-container">
    <h1>Produktet tona organike 🌱</h1>
    
    {#if isLoading}
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading fresh products...</p>
        </div>
    {:else if error}
        <div class="error-message">
            <p>⚠️ Error loading products: {error}</p>
            <button onclick={reloadProducts}>Try Again</button>
        </div>
    {:else if !products.length}
        <div class="empty-state">
            <p>No products available at the moment.</p>
        </div>
    {:else}
        <div class="product-grid">
            {#each products as product (product.id)}
                <article class="product-card">
                    <div  in:fade={{ duration: 700 }} out:fade>
                    <div class="product-image">
                        <img 
                            src={product.imageUrl || '/placeholder-product.jpg'} 
                            alt={product.name}
                            loading="lazy"
                        />
                        {#if product.isOrganic}
                            <span class="organic-badge">Organic</span>
                        {/if}
                    </div>
                    <div class="product-details">
                        <h2>{product.name}</h2>
                        <p class="product-description">{product.description}</p>
                        <div class="product-meta">
                            <span class="price">{product.price}€</span>
                            <span class="farmer">By {product.farmer.name}</span>
                        </div>
                        <button onclick={openModal}>
                            Me shume
                        </button>
                    </div>
                </div>
                </article>
            {/each}
        </div>
        <div class="pagination">
            {#if currentPage > 1}
                <button onclick={() => changePage(currentPage - 1)}>Previous</button>
            {/if}

            {#each getPageNumbers() as pageNumber}
                <button
                    class:active={pageNumber === currentPage}
                    onclick={() => changePage(pageNumber)}
                >
                    {pageNumber}
                </button>
            {/each}

            {#if currentPage < totalPages}
                <button onclick={() => changePage(Number(currentPage) + 1)}>Next</button>
            {/if}
        </div>
    {/if}
</main>


  
<style>


    h1 {
        text-align: center;
        color: #2b6e30;
        margin-bottom: 2rem;
        font-size: 2rem;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        padding: 0.5rem;
    }

    .product-card {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .product-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
        transform: scale(1.05);
    }

    .organic-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #2b6e30;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: bold;
    }

    .product-details {
        padding: 1.25rem;
    }

    .product-details h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        color: #333;
    }

    .product-description {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .price {
        font-weight: bold;
        color: #2b6e30;
        font-size: 1.1rem;
    }

    .farmer {
        font-size: 0.8rem;
        color: #888;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: #2b6e30;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s ease;
    }

    button:hover {
        background: #1e5a23;
    }

    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #2b6e30;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .error-message {
        background: #ffecec;
        color: #ff5252;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        max-width: 500px;
        margin: 0 auto;
    }

    .error-message button {
        margin-top: 1rem;
        background: #ff5252;
    }

    .empty-state {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    @media (max-width: 768px) {
        .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
    }
    .pagination {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
    }

    .pagination button {
        padding: 0.5rem 1rem;
        margin: 0 0.25rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: rgb(200, 19, 19);
        cursor: pointer;
    }

    .pagination button.active {
        background-color: #2b6e30;
        color: white;
        border-color: #2b6e30;
    }

    .pagination button:hover {
        background-color: #f0f0f0;
    }
</style>

