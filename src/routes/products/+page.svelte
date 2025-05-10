<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { type ProductType, type Product } from "$prisma-client";

  import ModalDialog from "$lib/client/components/modalDialog.svelte";
  import ProductCard from "$lib/client/components/productCard.svelte";

  let { data } = $props();

  let show = $state(false);

  function closeModal() {
    show = false;
  }

  // let searchStr = $derived(url.searchParams.get('searchString') || null);
  // $effect(()=>console.log(searchStr));

  let pageNumbers = $derived(
    Array.from({ length: data.products.totalPages }, (_, i) => i + 1)
  );

  function changePage(page: number) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("page", page.toString());
    goto(`/products?${urlParams.toString()}`, { noScroll: true });
  }

  let quantity = $state("");
  let messageProdRequest = $state("");
  let selectedProduct: Product | null = $state(null);

  let search = $state("");
  let selectedType: ProductType | null = $state(null);

  const availableTypes = data.allTypes;
</script>

<svelte:head>
  <title>Store</title>
  <meta name="description" content="Here you can buy our products" />
</svelte:head>

<main class="products-container" transition:fade={{ duration: 200 }}>
  <h1>Produktet tona organike 🌱</h1>

  <form method="get" action="?/" class="search-form">
    <input
      type="text"
      name="searchString"
      placeholder="Search products..."
      bind:value={search}
    />
    <select name="type" bind:value={selectedType}>
      <option value="">All Types</option>
      {#each availableTypes as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    <button type="submit">Search</button>
  </form>

  {#if !data.products}
    <div class="loading-spinner">
      <!-- I hoqa keto loading spinner but who cares -->
      <div class="spinner"></div>
      <p>Loading fresh products...</p>
      <p>If it's not loading properly:</p>
      <button onclick={() => invalidateAll()}>Try Again</button>
    </div>
  {:else if !data.products.products.length}
    <div class="empty-state">
      <p>No products available at the moment.</p>
    </div>
  {:else}
    <div class="product-grid">
      {#each data.products.products as product (product.id)}
        <ProductCard {product} bind:selectedProduct bind:show />
        <!-- Using the shorthand for binds, cause I want it that way -->
      {/each}
    </div>
    <div class="pagination">
      {#if data.products.currentPage > 1}
        <button onclick={() => changePage(data.products.currentPage - 1)}>Previous</button>
      {/if}

      {#each pageNumbers as pageNumber}
        <button
          class:non-active={pageNumber !== data.products.currentPage}
          onclick={() => changePage(pageNumber)}
        >
          {pageNumber}
        </button>
      {/each}

      {#if data.products.currentPage < data.products.totalPages}
        <button onclick={() => changePage(Number(data.products.currentPage) + 1)}>Next</button
        >
      {/if}
    </div>
  {/if}
</main>

<ModalDialog bind:show={show}>
  {#snippet header()}
    <h2>{selectedProduct?.name ?? "Product name not found"}</h2>
  {/snippet}

  {#snippet body()}
    <form
      class="modal-form"
      use:enhance
      method="post"
      action="?/addProdRequest"
      enctype="multipart/form-data"
    >
      <label for="description">Description:</label>
      <p>{selectedProduct?.description}</p>
      <label for="price">Price:</label>
      <p>{selectedProduct?.price}</p>

      <label for="quantity">Quantity:</label>
      <input
        type="text"
        id="quantity"
        name="quantity"
        bind:value={quantity}
        required
      />
      <label for="message">Message:</label>
      <input
        type="text"
        name="message"
        bind:value={messageProdRequest}
        required
      />
      <input
        type="hidden"
        name="productId"
        value={selectedProduct?.id ?? -1}
        required
      />
      <footer class="modal-footer">
        <button class="primary" type="submit">Confirm</button>
        <button
          type="button"
          style:background-color="darkred"
          onclick={closeModal}>Cancel</button
        >
      </footer>
    </form>
  {/snippet}
</ModalDialog>

<style>
  form.modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  form.modal-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    /* color: #333; */
  }

  form.modal-form input[type="text"] {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    height: 36px;
    box-sizing: border-box;
  }

  form.modal-form p {
    margin: 0 0 1rem 0;
    /* color: #555; */
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

  @media (max-width: 600px) {
    .modal-footer {
      padding: 1rem;
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

  button {
    width: 100%;
    padding: 0.75rem;
    font-weight: 600;
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
    padding: 0.6rem 1rem;
    margin: 0 0.25rem;
  }

  .pagination button.non-active {
    background-color: rgb(200, 19, 19);
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
  }

  .search-form select {
    flex: 1 1 200px;
    cursor: pointer;
  }

  .search-form button[type="submit"] {
    flex: 0 1 150px;
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
