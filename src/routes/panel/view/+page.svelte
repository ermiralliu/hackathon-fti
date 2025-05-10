<!-- src/routes/products/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";

  import { goto } from "$app/navigation";
  import ModalDialog from "$lib/client/components/modalDialog.svelte";
  import ProductCard from "$lib/client/components/productCard.svelte";
  import type { Product, ProductType } from "$prisma-client";
  import { fade } from "svelte/transition";
  let { data } = $props();

  let { products, currentPage, totalPages } = $derived(data.productData);

  function changePage(page: number) {
    goto(`/panel/view?page=${page}`, { noScroll: true });
  }

  function getPageNumbers() {
    return Array.from({ length: data.productData.totalPages }, (_, i) => i + 1)
  }

  let selectedProduct: null | Product = $state(null);
  let showViewModal = $state(false);
  let showEditModal = $state(false);

  // async function reloadProducts() {
  //   const response = await fetch(`?page=${currentPage}`);
  //   const data = await response.json();
  //   products = data.products.products || [];
  // }

  function openEditModal() {
    if (!selectedProduct) return;

    editValues = selectedProduct;
    showViewModal = false;
    showEditModal = true;
  }

  // let isEditing = $state(false);
  // A lot of questionable stuff here (more stuff we need to check)
  let editValues = $state({
    id: -1 as number,
    name: "",
    type: "other" as ProductType,
    price: 0 as number | null,
    description: "" as string | null,
    imagePath: null as null | File | string,
  });

  // function startEditing() {
  //   if (selectedProduct === null) return;
  //   editValues = selectedProduct;
  //   isEditing = true;
  // }
</script>

<svelte:head>
  <title>View Your Products</title>
  <meta
    name="description"
    content="Here you can view the products you are selling"
  />
</svelte:head>

<main class="products-container">
  <h1>Your Products 🌱</h1>
  {#if !products.length}
    <div class="empty-state">
      <p>No products available at the moment.</p>
    </div>
  {:else}
    <div class="product-grid">
      {#each products as product (product.id)}
        <ProductCard {product} bind:selectedProduct bind:show={showViewModal} />
      {/each}
    </div>
    {#if totalPages > 1}
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
          <button onclick={() => changePage(Number(currentPage) + 1)}
            >Next</button
          >
        {/if}
      </div>
    {/if}
  {/if}
</main>

<ModalDialog bind:show={showViewModal}>
  {#snippet header()}
    <h2>{selectedProduct?.name ?? "Invalid Product name"}</h2>
  {/snippet}
  {#snippet body()}
    {#if selectedProduct}
      <img
        src={selectedProduct.imagePath || "/placeholder-product.jpg"}
        alt={selectedProduct.name}
        loading="lazy"
        class="product-image"
      />

      <div class="product-details">
        <div class="detail-row">
          <span class="detail-label">Type:</span>
          <span class="detail-value">{selectedProduct.type}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Price:</span>
          <span class="detail-value">{selectedProduct.price}€</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value"
            >{selectedProduct.availability || "Available"}</span
          >
        </div>

        <div class="detail-row full-width">
          <span class="detail-label">Description:</span>
          <p class="detail-value">
            {selectedProduct.description || "No description provided"}
          </p>
        </div>
      </div>
    {/if}
  {/snippet}
  {#snippet footer()}
    <form method="POST" action="?/deleteProduct" use:enhance>
      <div class="modal-footer">
        <input
          type="hidden"
          name="productId"
          value={selectedProduct?.id ?? -1}
        />
        <button class="delete-btn" type="submit"> Delete Product </button>
        <button class="edit-btn" type="button" onclick={openEditModal}>
          Modify Product
        </button>
      </div>
    </form>
  {/snippet}
</ModalDialog>

<!-- 
{#if showViewModal && selectedProduct}
  <dialog
    bind:this={modalView}
    onclick={e => e.target === modalView && closeModals()}
  >
    <div class="modal">
      <div class="modal-header">
        <h2>{selectedProduct.name}</h2>
        <button onclick={closeModals}>&times;</button>
      </div>
      <div class="modal-body">
        <img
          src={selectedProduct.imagePath || "/placeholder-product.jpg"}
          alt={selectedProduct.name}
          loading="lazy"
          class="product-image"
        />

        <div class="product-details">
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{selectedProduct.type}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Price:</span>
            <span class="detail-value">{selectedProduct.price}€</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value"
              >{selectedProduct.availability || "Available"}</span
            >
          </div>

          <div class="detail-row full-width">
            <span class="detail-label">Description:</span>
            <p class="detail-value">
              {selectedProduct.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>
      <form method="POST" action="?/deleteProduct" use:enhance>
        <div class="modal-footer">
          <input type="hidden" name="productId" value={selectedProduct.id} />
          <button class="delete-btn" type="submit"> Delete Product </button>
          <button class="edit-btn" type="button" onclick={openEditModal}>
            Modify Product
          </button>
        </div>
      </form>
    </div>
  </dialog>
{/if} -->

<!-- Edit Modal -->
<!-- {#if showEditModal}
  <dialog
    bind:this={modalEdit}
    onclick={e => e.target === modalEdit && closeModals()}
  >
    <div class="modal">
      <div class="modal-header">
        <h2>Edit Product</h2>
        <button onclick={closeModals}>&times;</button>
      </div>
      <form
        id="editProductForm"
        method="POST"
        action="?/updateProduct"
        use:enhance
        enctype="multipart/form-data"
      >
        <div class="modal-body">
          <input type="hidden" name="id" value={selectedProduct?.id} />

          <div class="form-group">
            <label for="editName">Product Name</label>
            <input
              id="editName"
              type="text"
              name="name"
              bind:value={editValues.name}
              required
            />
          </div>

          <div class="form-group">
            <label for="editType">Product Type</label>
            <select id="editType" name="type" bind:value={editValues.type}>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="alcoholicBeverages">Alcoholic Beverage</option>
              <option value="juice">Juice</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="editPrice">Price (€)</label>
            <input
              id="editPrice"
              type="number"
              name="price"
              step="0.01"
              bind:value={editValues.price}
              required
            />
          </div>

          <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea
              id="editDescription"
              name="description"
              bind:value={editValues.description}
              rows="3"
            ></textarea>
          </div> -->

<!-- <div class="form-group">
                        <label for="editImage">Change Image</label>
                        <input 
                            id="editImage" 
                            type="file" 
                            name="photo"
                            accept="image/*"
                        />
                    </div> -->
<!-- </div>
        <div class="modal-footer">
          <button
            class="secondary"
            type="button"
            onclick={() => {
              showEditModal = false;
              showViewModal = true;
            }}
          >
            Cancel
          </button>
          <button class="save-btn" type="submit"> Save Changes </button>
        </div>
      </form>
    </div>
  </dialog>
{/if} -->

<style>
  .modal-footer {
    display: flex;
  }

  .modal-footer button {
    padding: 8px 16px;
  }

  .products-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 0.5rem;
  }

  .product-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .product-details {
    padding: 1.25rem;
  }

  button {
    padding: 0.75rem;
    font-weight: 600;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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
  }

  .pagination button:not(.active) {
    background-color: rgb(200, 19, 19);
  }

  .detail-row {
    display: flex;
    align-items: flex-start;
  }

  .detail-row.full-width {
    flex-direction: column;
  }

  /* 
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .modal-header h2 {
    margin: 0;
    color: #2b6e30;
  }

  .modal-header button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
  } */

  .product-image {
    width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .product-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
  }

  .detail-row.full-width {
    flex-direction: column;
  }

  .detail-label {
    font-weight: bold;
    min-width: 100px;
    /* color: #555; */
  }

  .detail-value {
    flex: 1;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  /* Button styles */
  button {
    font-weight: 600;
    flex: 1;
  }

  button:hover {
    opacity: 0.9;
  }

  .delete-btn {
    background-color: #dc3545;
  }

  .edit-btn {
    background-color: #007bff;
  }

  /* .secondary {
    background-color: #6c757d;
    color: white;
  }

  .save-btn {
    background-color: #28a745;
    color: white;
  }

  /* Form styles */
  /* .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-group textarea {
    min-height: 80px;
    resize: vertical;
  } */
</style>
