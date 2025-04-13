<!-- src/routes/products/+page.svelte -->
<script>
// @ts-nocheck
    import { goto } from '$app/navigation';
    import { fade, fly } from 'svelte/transition';
    import {enhance} from '$app/forms';

    let {data} = $props();
    
    let products = $derived(data.products.products || []);
    let isLoading = $derived(false);
    let error = $derived(false);
    let currentPage = $derived(data.products.currentPage);
    let totalPages = $derived(data.products.totalPages);

    // let searchStr = $derived(url.searchParams.get('searchString') || null);
    // $effect(()=>console.log(searchStr));

    let pageNumbers = $derived((()=>{
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    })());
    

    function changePage(page) {
        goto(`/products?page=${page}`, {noScroll:true});
    }

    let showModal = $state(false);
    let quantity = $state('');
    let messageProdRequest = $state('');
    let selectedProduct = $state(null);

    let modal;
  
    function openModal() {
        modal.showModal();
        showModal = true;
    }
  
    function closeModal() {
        modal.close();
        showModal = false;
    }

    let search = $state('');

    // Add this to your existing script section
    let selectedType = $state('');
    let availableTypes = [
        'fruit',
        'vegetable',
        'alcoholicBeverages',
        'juice',
        'dairy',
        'other'
    ];
</script>

<main class="products-container">
    <h1>Produktet tona organike 🌱</h1>

    <form method="get" action="?/">
        <input type="text" name="searchString" placeholder="Search products..." bind:value={search} />
        <select name="type" bind:value={selectedType}>
            <option value="">All Types</option>
            {#each availableTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>
        <button type="submit">Search</button>
    </form>
    
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
                        {console.log("dddff",product.imagePath)}
                    <div class="product-image">
                        <img 
                            src={"../../.."+product.imagePath} 
                            alt={product.name}
                            loading="lazy"
                        />
                        {#if product.isOrganic}
                            <span class="organic-badge">Organic</span>
                        {/if}
                    </div>
                    <div class="product-details">
                        <h2>{product.name}</h2>
                        <p class="product-description">{product.type}</p>
                        <div class="product-meta">
                            <span class="price">{product.price}€</span>
                            <span class="farmer">By {product.farmer.name}</span>
                        </div>
                        <button onclick={() => {
                            selectedProduct = product,
                            openModal()
                            }}>
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

            {#each pageNumbers as pageNumber}
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


<dialog bind:this={modal}>
        {#if showModal}
        <div class="modal">
          <div class="modal-header">
            <h2>{selectedProduct.name}</h2>
            <button onclick={closeModal}>&times;</button>
          </div>
          <div class="modal-body">
            <img 
                src={"../../.."+selectedProduct.imagePath || '/placeholder-product.jpg'} 
                alt={selectedProduct.name}
                loading="lazy"
            />
            <form use:enhance method="POST" action="?/addProdRequest" enctype="multipart/form-data">
                <label for="description">Description:</label>
                <p>{selectedProduct?.description}</p>
                <label for="price">Price:</label>
                <p>{selectedProduct?.price}</p>

                <label for="quantity">Quantity:</label>
                <input type="text" id="quantity" name="quantity" bind:value={quantity} required />
                <label for="message">Message:</label>
                <input type="text" name="message" bind:value={messageProdRequest} required />
                <input type="hidden" name="productId" bind:value={selectedProduct.id} required />
                <div class="modal-footer">
                    <button type="button" onclick={closeModal}>Cancel</button>
                    <button class="primary" type="submit">Confirm</button>
                </div>
            </form>
          </div>
          
        </div>
        {/if}
      </dialog>

  
<style>

dialog {
  border: none;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: auto;
}

.modal-body {
  margin-bottom: 15px;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-body label {
  font-weight: bold;
}

.modal-body input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer button.primary {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
    .products-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

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

    .filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }

    .filters input, 
    .filters select {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        min-width: 200px;
    }

    .filters button {
        padding: 0.5rem 1rem;
        width: auto;
    }

    @media (max-width: 768px) {
        .filters {
            flex-direction: column;
        }
        
        .filters input,
        .filters select,
        .filters button {
            width: 100%;
        }
    }
</style>

