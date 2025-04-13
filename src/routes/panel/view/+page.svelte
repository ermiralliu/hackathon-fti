<!-- src/routes/products/+page.svelte -->
<script>
  // @ts-nocheck
    import { enhance } from '$app/forms';
  
      import { goto } from '$app/navigation';
      import { fade, fly } from 'svelte/transition';
      let {data} = $props();
      
      let products = $derived(data.products.products || []);
      let previousProducts = $state([]);
      let shouldCloseModals = $state(false);
      let isLoading = $derived(false);
      let error = $derived(false);
      let currentPage = $derived(data.products.currentPage);
      let totalPages = $derived(data.products.totalPages);
      
      
  
      function changePage(page) {
          goto(`/panel/view?page=${page}`, {noScroll:true});
      }
  
      function getPageNumbers() {
          let pages = [];
          for (let i = 1; i <= totalPages; i++) {
              pages.push(i);
          }
          return pages;
      }
      let quantity = $state('');
      let messageProdRequest = $state('');
      let selectedProduct = $state(null);
      let showViewModal = $state(false);
        let showEditModal = $state(false);
    let modalView, modalEdit;
  
  
      $effect(() => {
          // Only try to show modal if it exists and is supposed to be shown
        if (showViewModal && modalView) {
            modalView.showModal();
        } else if (showViewModal && !modalView) {
            console.error("View modal element not found");
        }

        if (showEditModal && modalEdit) {
            modalEdit.showModal();
        } else if (showEditModal && !modalEdit) {
            console.error("Edit modal element not found");
        }

        
        
        
      });
      
      function openViewModal(product) {
        selectedProduct = product;
        showViewModal = true;
        showEditModal = false;
    }
    function closeModals() {
        if (showViewModal && modalView) modalView.close();
        if (showEditModal && modalEdit) modalEdit.close();
        showViewModal = false;
        showEditModal = false;
        isEditing = false;
        selectedProduct = null;
    }
    async function reloadProducts() {
    const response = await fetch(`?page=${currentPage}`);
    const data = await response.json();
    products = data.products.products || [];
}

    function openEditModal() {
        if (!selectedProduct) return;
        
        editValues = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            type: selectedProduct.type,
            price: selectedProduct.price,
            description: selectedProduct.description
        };
        showViewModal = false;
        showEditModal = true;
    }
  
      
      let isEditing = $state(false);
    let editValues = $state({
        name: '',
        type: '',
        price: '',
        description: '',
        image: null
    });
    
    function startEditing() {
        editValues = {
            name: selectedProduct.name,
            type: selectedProduct.type,
            price: selectedProduct.price,
            description: selectedProduct.description,
            image: null
        };
        isEditing = true;
    }
    
    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            editValues.image = file;
        }
    }
    
    async function saveChanges() {
        try {
            // Here you would call your API to update the product
            // const response = await updateProduct(selectedProduct.id, editValues);
            console.log('Saving changes:', editValues);
            
            // Update the local product data
            selectedProduct = {
                ...selectedProduct,
                ...editValues
            };
            
            isEditing = false;
            // Optional: show success message or refresh data
        } catch (error) {
            console.error('Failed to update product:', error);
            // Show error message to user
        }
    }
    
    function confirmDelete() {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct();
        }
    }
    
    async function deleteProduct() {
        try {
            // Here you would call your API to delete the product
            // await deleteProduct(selectedProduct.id);
            console.log('Deleting product:', selectedProduct.id);
            
            closeModal();
            // Optional: refresh the product list or remove the product from the local array
        } catch (error) {
            console.error('Failed to delete product:', error);
            // Show error message to user
        }
    }

    async function handleEditSubmit({ form, formData, cancel }) {
      // Update local state immediately
      products = products.map(p => 
          p.id === selectedProduct.id ? {
              ...p,
              name: formData.get('name'),
              type: formData.get('type'),
              price: formData.get('price'),
              description: formData.get('description')
          } : p
      );
      
      // Also update the selected product
      selectedProduct = {
          ...selectedProduct,
          name: formData.get('name'),
          type: formData.get('type'),
          price: formData.get('price'),
          description: formData.get('description')
      };
      
      // Submit to server
      const response = await fetch('?/updateProduct', {
          method: 'POST',
          body: formData
      });
      
      if (!response.ok) {
          // Optional: handle error case
          cancel();
      }
      
      return await response.json();
  }


    

    
  </script>
  
  <main class="products-container">
      <h1>Your Products 🌱</h1>
      
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
                          {console.log(product.imagePath)}
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
                              openViewModal(product)
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
  
  <!-- View Modal -->
{#if showViewModal}
<dialog bind:this={modalView} onclick={e => e.target === modalView && closeModals()}>
    <div class="modal">
        <div class="modal-header">
            <h2>{selectedProduct.name}</h2>
            <button onclick={closeModals}>&times;</button>
        </div>
        <div class="modal-body">
            <img 
                src={selectedProduct.imagePath || '/placeholder-product.jpg'} 
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
                    <span class="detail-value">{selectedProduct.status || 'Available'}</span>
                </div>
                
                <div class="detail-row full-width">
                    <span class="detail-label">Description:</span>
                    <p class="detail-value">{selectedProduct.description || 'No description provided'}</p>
                </div>
            </div>
        </div>
        <form method="POST" action="?/deleteProduct" use:enhance>
          <div class="modal-footer">
              
                  <input type="hidden" name="productId" value={selectedProduct.id} />
                  <button class="delete-btn" type="submit">
                      Delete Product
                  </button>
                  <button class="edit-btn" type="button" onclick={openEditModal}>
                      Modify Product
                  </button>
          </div>
        </form>
    </div>
</dialog>
{/if}
  

<!-- Edit Modal -->
{#if showEditModal}
    <dialog bind:this={modalEdit} onclick={e => e.target === modalEdit && closeModals()}>
        <div class="modal">
            <div class="modal-header">
                <h2>Edit Product</h2>
                <button onclick={closeModals}>&times;</button>
            </div>
            <form id="editProductForm" method="POST" action="?/updateProduct" use:enhance={handleEditSubmit} enctype=multipart/form-data>
            <div class="modal-body">
                
                    <input type="hidden" name="id"  value={selectedProduct?.id}>

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
                    </div>
                    
                    <!-- <div class="form-group">
                        <label for="editImage">Change Image</label>
                        <input 
                            id="editImage" 
                            type="file" 
                            name="photo"
                            accept="image/*"
                        />
                    </div> -->
                
            </div>
            <div class="modal-footer">
              <button class="secondary" type="button" onclick={() => {
                  showEditModal = false;
                  showViewModal = true;
              }}>
                  Cancel
              </button>
              <button class="save-btn" type="submit">
                  Save Changes
              </button>
          </div>
          </form>
            
            
        </div>
    </dialog>
{/if}

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
    .product-image-modal {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      border-radius: 8px;
      margin-bottom: 1rem;
  }
  
  .product-details-modal {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
  }
  
  .detail-row {
      display: flex;
      align-items: flex-start;
  }
  
  .detail-row.full-width {
      flex-direction: column;
  }
  
  .detail-label {
      font-weight: bold;
      min-width: 100px;
      color: #555;
  }
  
  .detail-value {
      flex: 1;
  }
  
  .edit-form {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
  }
  
  .edit-form h3 {
      margin-bottom: 1rem;
      color: #2b6e30;
  }
  
  .form-group {
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
  }
  
  /* Button styles */
  .modal-footer {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
  }
  
  .secondary {
      background-color: #6c757d;
      color: white;
  }
  
  .save-btn {
      background-color: #28a745;
      color: white;
  }
  
  .edit-btn {
      background-color: #007bff;
      color: white;
  }
  
  .delete-btn {
      background-color: #dc3545;
      color: white;
  }
  
  button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
  }
  
  button:hover {
      opacity: 0.9;
  }

  /* Modal styles */
  dialog {
      border: none;
      border-radius: 8px;
      padding: 0;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal {
      padding: 1.5rem;
  }
  
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
  }
  
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
      color: #555;
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
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
      flex: 1;
  }
  
  button:hover {
      opacity: 0.9;
  }
  
  .delete-btn {
      background-color: #dc3545;
      color: white;
  }
  
  .edit-btn {
      background-color: #007bff;
      color: white;
  }
  
  .secondary {
      background-color: #6c757d;
      color: white;
  }
  
  .save-btn {
      background-color: #28a745;
      color: white;
  }
  
  /* Form styles */
  .form-group {
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
  }
</style>