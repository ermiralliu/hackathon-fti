<script>
// @ts-nocheck

    let newProduct = {
    name: '',
    price: '',
    image: null,
    imagePreview: ''
  };
  // Handle image upload
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      newProduct.image = file;
      newProduct.imagePreview = URL.createObjectURL(file);
    }
  }
  
  // Add new product
  function addProduct() {
    if (newProduct.name && newProduct.price) {
      products.update(p => [...p, {
        id: Date.now(),
        ...newProduct,
        price: parseFloat(newProduct.price)
      }]);
      
      // Reset form
      newProduct = {
        name: '',
        price: '',
        image: null,
        imagePreview: ''
      };
    }
  }
  
</script>
<div class="tab-content">
    <h2>Add New Product</h2>
    <div class="form-group">
      <label for="product-name">Product Name</label>
      <input 
        id="product-name" 
        type="text" 
        bind:value={newProduct.name} 
        placeholder="Enter product name"
      />
    </div>
    <div class="form-group">
      <label for="product-price">Price ($)</label>
      <input 
        id="product-price" 
        type="number" 
        bind:value={newProduct.price} 
        placeholder="Enter price"
      />
    </div>
    <div class="form-group">
      <label for="product-image">Product Image</label>
      <input 
        id="product-image" 
        type="file" 
        accept="image/*" 
        on:change={handleImageUpload}
      />
      {#if newProduct.imagePreview}
        <img src={newProduct.imagePreview} alt="Preview" class="image-preview"/>
      {/if}
    </div>
    <button on:click={addProduct} class="submit-btn">Add Product</button>
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
    
    .submit-btn {
      background-color: #28a745;
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    
    .submit-btn:hover {
      background-color: #218838;
    }
    
    
    
    .image-preview {
      max-width: 100%;
      max-height: 300px;
      margin-top: 15px;
      display: block;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    
    
    
    
    @media (max-width: 576px) {
      
      
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
  
      
  
      /* Smaller image preview */
      .image-preview {
        max-height: 200px;
      }
    }
  
    
  </style>