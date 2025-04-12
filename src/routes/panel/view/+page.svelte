<script>
// @ts-nocheck
let products = $state([])
// Modify product
// svelte-ignore non_reactive_update
let modifyingProduct = null;
  function startModify(product) {
    modifyingProduct = { ...product };
  }

  // Delete product
  function deleteProduct(id) {
    products.update(p => p.filter(product => product.id !== id));
  }
  function saveModify() {
    products.update(p => p.map(product => 
      product.id === modifyingProduct.id ? modifyingProduct : product
    ));
    modifyingProduct = null;
  }
  

</script>
<div class="tab-content">
    <h2>Your Products</h2>
    {#if modifyingProduct}
      <div class="modify-form">
        <h3>Modify Product</h3>
        <div class="form-group">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label>Product Name</label>
          <input 
            type="text" 
            bind:value={modifyingProduct.name} 
          />
        </div>
        <div class="form-group">
          <!-- svelte-ignore a11y_label_has_associated_control -->
          <label>Price ($)</label>
          <input 
            type="number" 
            bind:value={modifyingProduct.price} 
          />
        </div>
        <div class="button-group">
          <button onclick={saveModify}>Save Changes</button>
          <button onclick={() => modifyingProduct = null} class="cancel">Cancel</button>
        </div>
      </div>
    {:else}
      <div class="product-grid">
        {#each products as product (product.id)}
          <div class="product-card">
            {#if product.imagePreview}
              <img src={product.imagePreview} alt={product.name} class="product-image"/>
            {/if}
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <div class="product-actions">
              <button onclick={() => startModify(product)}>Modify</button>
              <button onclick={() => deleteProduct(product.id)} class="delete">Delete</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
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

  
    
    
    
    
    
    .tab-content {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    /* Form Styles */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #495057;
    }
    
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
      background-color: #f8f9fa;
    }
    
    
    
    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .product-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    
    .product-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    
    .product-actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    
    .product-actions button:first-child {
      background-color: #17a2b8;
      color: white;
    }
    
    .product-actions .delete {
      background-color: #dc3545;
      color: white;
    }
    
    /* Modify Form */
    .modify-form {
      background: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .button-group {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }
    
    .button-group button {
      flex: 1;
      padding: 12px;
      font-weight: 600;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .button-group button:first-child {
      background-color: #007bff;
      color: white;
    }
    
    .button-group .cancel {
      background-color: #6c757d;
      color: white;
    }
    
    
    
    
    
    @media (max-width: 768px) {
      
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
  
      /* Prevent horizontal overflow */
      .modify-form,
      .product-card {
        min-width: 0; /* Allow these to shrink below content width */
        overflow: hidden; /* Prevent content from overflowing */
      }
    }
    
    @media (max-width: 576px) {
      .product-grid {
        grid-template-columns: 1fr;
      }
      
      .button-group, 
      .product-actions {
        flex-direction: column;
      }
      
      
      
      .tab-content {
        padding: 10px;
      }
  
      /* Better handling for very narrow screens */
      .form-group input {
        width: calc(100% - 30px); /* Account for padding */
      }
  
      /* Ensure buttons don't overflow */
      button {
        white-space: normal;
        word-wrap: break-word;
      }
    }
  
    /* Extra small devices (phones, 400px and down) */
    @media (max-width: 400px) {

    
      /* Make form elements more compact */
      .form-group {
        margin-bottom: 12px;
      }
  
      .form-group input {
        padding: 8px 10px;
        font-size: 14px;
      }
  
      /* Adjust button sizes */
      button {
        padding: 8px 12px;
        font-size: 14px;
      }
  
      /* Reduce card padding */
      .product-card {
        padding: 15px;
      }
  
      
    }
  
    
  </style>