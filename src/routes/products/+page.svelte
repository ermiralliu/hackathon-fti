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
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', page);
        goto(`/products?${urlParams.toString()}`, { noScroll: true });
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

    let selectedType = $state('');
    let availableTypes = [
        'fruit',
        'vegetable',
        'alcoholicBeverage',
        'juice',
        'dairy',
        'other'
    ];
</script>

<main class="products-container">
    <h1>Produktet tona organike 🌱</h1>

    <form method="get" action="?/" class="search-form">
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
  border-radius: 12px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
}

.modal {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #2b6e30;
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-header button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-body form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-body label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.modal-body input[type="text"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem; 
  margin-bottom: 0.5rem;
  height: 36px;
  box-sizing: border-box;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: #555;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.modal-footer button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  min-width: 100px;
  border: 1px solid transparent;
}

.modal-footer button:first-child {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd !important;
}

.modal-footer button.primary {
  background-color: #2b6e30 !important;
  color: white !important;
  border: 1px solid #2b6e30 !important;
}

/* Për të parandaluar override nga stilet globale */
.modal button,
.modal-footer button,
.modal-header button {
  background: initial;
  color: initial;
  width: auto;
  margin: initial;
  border: initial;
}

@media (max-width: 600px) {
  dialog {
    width: 95%;
    max-width: none;
    margin: 0.5rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
  
  .modal-body img {
    max-height: 150px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .modal-footer button {
    width: 100%;
  }
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
    .search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.search-form input[type="text"] {
  flex: 1 1 200px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-form select {
  flex: 1 1 200px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
}

.search-form button[type="submit"] {
  flex: 0 1 150px;
  padding: 0.75rem;
  background: #2b6e30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-form button[type="submit"]:hover {
  background: #1e5a23;
}

@media (max-width: 600px) {
  .search-form {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-form input[type="text"],
  .search-form select,
  .search-form button[type="submit"] {
    width: 100%;
    flex: 1 1 auto;
  }
}
</style>

