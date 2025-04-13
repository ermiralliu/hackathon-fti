<script lang="ts">
  // @ts-nocheck
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";

  let selectedLanguage: 'en' | 'sq' = 'en';

  onMount(() => {
    const lang = localStorage.getItem('selectedLanguage') as 'en' | 'sq';
    if (lang === 'sq' || lang === 'en') {
      selectedLanguage = lang;
    }
  });

  let currentImage = null;
  let imagePreview = "";

  function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      currentImage = file;
      imagePreview = URL.createObjectURL(file);
    }
  }
</script>

<div class="tab-content">
  <h2>{selectedLanguage === 'sq' ? 'Shto Produkt të Ri' : 'Add New Product'}</h2>
  
  <form use:enhance method="POST" action="?/create" enctype="multipart/form-data">
    <!-- Product Name -->
    <div class="form-group">
      <label for="product-name">
        {selectedLanguage === 'sq' ? 'Emri i Produktit' : 'Product Name'}
      </label>
      <input
        id="product-name"
        type="text"
        name="name"
        placeholder={selectedLanguage === 'sq' ? 'Shkruaj emrin e produktit' : 'Enter product name'}
        required
      />
    </div>

    <!-- Product Type -->
    <div class="form-group">
      <label for="product-type">
        {selectedLanguage === 'sq' ? 'Lloji i Produktit' : 'Product Type'}
      </label>
      <select id="product-type" name="type" required>
        <option value="" selected disabled>
          {selectedLanguage === 'sq' ? '-- Zgjidh llojin --' : '-- Select type --'}
        </option>
        <option value="fruit">{selectedLanguage === 'sq' ? 'Frut' : 'Fruit'}</option>
        <option value="vegetable">{selectedLanguage === 'sq' ? 'Perime' : 'Vegetable'}</option>
        <option value="alcoholic beverages">{selectedLanguage === 'sq' ? 'Pije Alkoolike' : 'Alcoholic Beverage'}</option>
        <option value="juice">{selectedLanguage === 'sq' ? 'Lëng' : 'Juice'}</option>
        <option value="dairy">{selectedLanguage === 'sq' ? 'Bulmet' : 'Dairy'}</option>
        <option value="other">{selectedLanguage === 'sq' ? 'Tjetër' : 'Other'}</option>
      </select>
    </div>

    <!-- Product Price -->
    <div class="form-group">
      <label for="product-price">
        {selectedLanguage === 'sq' ? 'Çmimi (€)' : 'Price (€)'}
      </label>
      <input
        id="product-price"
        type="number"
        name="price"
        placeholder={selectedLanguage === 'sq' ? 'Vendos çmimin' : 'Enter price'}
        step="0.01"
        min="0"
        required
      />
    </div>

    <!-- Product Description -->
    <div class="form-group">
      <label for="product-description">
        {selectedLanguage === 'sq' ? 'Përshkrimi' : 'Description'}
      </label>
      <textarea
        id="product-description"
        name="description"
        placeholder={selectedLanguage === 'sq' ? 'Shkruaj përshkrimin e produktit' : 'Enter product description'}
        rows="4"
      ></textarea>
    </div>

    <!-- Product Image -->
    <div class="form-group">
      <label for="product-image">
        {selectedLanguage === 'sq' ? 'Foto e Produktit' : 'Product Image'}
      </label>
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
    <button type="submit" class="submit-btn">
      {selectedLanguage === 'sq' ? 'Shto Produktin' : 'Add Product'}
    </button>
  </form>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
    color: #212529;
    min-width: 320px;
  }
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
