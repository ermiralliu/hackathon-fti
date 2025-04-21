<script lang="ts">
  import { enhance } from "$app/forms";
    import { fade } from "svelte/transition";
  
  let currentImage: null| File = $state(null);
  let imagePreview = $state("");
  
  function handleImageUpload(event: Event){
    const inputElement = event.target as HTMLInputElement
    const fileList = inputElement.files;
    if(!fileList)
     return;
    const file = fileList[0];
    if (file) {
      currentImage = file;
      imagePreview = URL.createObjectURL(file);
    }
  }
</script>

<svelte:head>
  <title>Add Product</title>
  <meta name="description" content="Add Products to sell" />
</svelte:head>

<div class="tab-content" transition:fade={{duration: 200}}>
  <h2>Add New Product</h2>
  <!-- Add enctype attribute here -->
  <form use:enhance method="POST" action="?/create" enctype="multipart/form-data">
      <!-- Product Name -->
      <div class="form-group">
          <label for="product-name">Product Name</label>
          <input
              id="product-name"
              type="text"
              name="name"
              placeholder="Enter product name"
              required
          />
      </div>

      <!-- Product Type -->
      <div class="form-group">
          <label for="product-type">Product Type</label>
          <select id="product-type" name="type" required>
              <option value="" selected disabled>-- Select type --</option>
              <option value="fruit">Fruit</option>
              <option value="vegetable">Vegetable</option>
              <option value="alcoholicBeverage">Alcoholic Beverage</option>
              <option value="juice">Juice</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
          </select>
      </div>

      <!-- Product Price -->
      <div class="form-group">
          <label for="product-price">Price ($)</label>
          <input
              id="product-price"
              type="number"
              name="price"
              placeholder="Enter price"
              step="0.01"
              min="0"
              required
          />
      </div>
  
      <!-- Product Description -->
      <div class="form-group">
          <label for="product-description">Description</label>
          <textarea
              id="product-description"
              name="description"
              placeholder="Enter product description"
              rows="4"
          ></textarea>
      </div>
  
      <!-- Product Image -->
      <div class="form-group">
          <label for="product-image">Product Image</label>
          <input
              id="product-image"
              type="file"
              accept="image/*"
              name="photo"
              onchange={handleImageUpload}
          />
          {#if imagePreview}
              <img src={imagePreview} alt="Preview" class="image-preview" />
          {/if}
      </div>
  
      <!-- Submit Button -->
      <button type="submit" class="submit-btn">Add Product</button>
  </form>
</div>

<style>

  .tab-content {
    max-width: 1200px;
    margin: 0 auto;
  }
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
  textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
      background-color: #f8f9fa;
      resize: vertical;
  }
  .form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f8f9fa;
  color: #212529;
  appearance: none; 
  }
  @media (max-width: 576px) {
    .tab-content {
      padding: 10px;
    }
    .form-group input {
      width: calc(100% - 30px);
    }
    button {
      white-space: normal;
      word-wrap: break-word;
    }
  }
  @media (max-width: 400px) {
    .form-group {
      margin-bottom: 12px;
    }
    .form-group input {
      padding: 8px 10px;
      font-size: 14px;
    }
    button {
      padding: 8px 12px;
      font-size: 14px;
    }
      .image-preview {
      max-height: 200px;
    }
  }
</style>