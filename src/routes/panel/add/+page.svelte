<script lang="ts">
  import { enhance } from "$app/forms";
  import ModalDialog from "$lib/client/components/modalDialog.svelte";
  import styles from "$lib/client/components/modal-footer.module.css";
  import ProductCard from "$lib/client/components/productCard.svelte";

  let { form } = $props();

  let inputs = {
    name : null,
    productType : null,
    price : null,
  } as {
    name: HTMLInputElement| null,
    productType: HTMLSelectElement| null,
    price: HTMLInputElement| null
  }

  let currentImage: null | File = $state(null);
  let imagePreview = $state("");

  function handleImageUpload(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const fileList = inputElement.files;
    if (!fileList) return;
    const file = fileList[0];
    if (file) {
      currentImage = file;
      imagePreview = URL.createObjectURL(file);
    }
  }

  let showConfirmDialog = $state(false);
  let showSuccessDialog = $state(false);

  $inspect("Form success: ", form?.success);

  $effect(() => {
    setTimeout(() => inputs.name?.focus(), 600);
  });
  $effect(()=>{
    if(form?.success){
      showSuccessDialog = true;
      currentImage = null;
      imagePreview = '';
    }
  })

  function validateForm() {
    for( const [_, input] of Object.entries(inputs)){
      if( input?.value.trim() === ''){
        input.reportValidity();
        return false;
      }
    }
    if(currentImage === null)
      return false;
    return true;
  }
</script>

<svelte:head>
  <title>Add Product</title>
  <meta name="description" content="Add Products to sell" />
</svelte:head>

<div class="tab-content">
  <h2>Add New Product</h2>
  <!-- Add enctype attribute here -->
  <form
    id="additionForm"
    use:enhance
    method="POST"
    action="?/create"
    enctype="multipart/form-data"
  >
    <!-- Product Name -->
    <div class="form-group">
      <label for="product-name">Product Name</label>
      <input
        id="product-name"
        type="text"
        name="name"
        placeholder="Enter product name"
        bind:this={inputs.name}
        required
      />
    </div>

    <!-- Product Type -->
    <div class="form-group">
      <label for="product-type">Product Type</label>
      <select id="product-type" name="type"  bind:this={inputs.productType} required>
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
        bind:this={inputs.price}
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
    <button
      type="button"
      class="submit-btn"
      onclick={()=>{
        if(validateForm())
          showConfirmDialog = true
      }
      }>Add Product</button
    >
  </form>
</div>

<ModalDialog bind:show={showConfirmDialog}>
  {#snippet header()}
    <h2>Confirm</h2>
  {/snippet}
  {#snippet body()}
    <p>
      Are you sure you want to proceed to add this product in your catalog?
    </p>
    <footer class={styles["modal-footer"]}>
      <button
        type="submit"
        form="additionForm"
        onclick={() => (showConfirmDialog = false)}>Yes</button
      >
      <button
        type="button"
        class="reject-btn"
        onclick={() => (showConfirmDialog = false)}>No</button
      >
    </footer>
  {/snippet}
</ModalDialog>

<ModalDialog bind:show={showSuccessDialog}>
  {#snippet header()}
    <h2>Addition Successful</h2>
  {/snippet}
  {#snippet body()}
    <p>You successfully added this product to your catalogue</p>
    {#if form?.product}
      <ProductCard product={form?.product} selectedProduct={form?.product}/>
    {/if}
    <footer class={styles['modal-footer']}>
      <button type="button" class="reject-btn" onclick={() => showSuccessDialog = false}>
        Close
      </button>
    </footer>
  {/snippet}
</ModalDialog>

<style>
  :root {
    --card-shadow: rgba(0, 0, 0, 0.25);
    --tab-content-bg-color: var(--color-bg-component);
  }

  :global(:root):has(:global(#theme-switch):checked) {
    --card-shadow: rgba(0, 0, 0, 0.4);
    --tab-content-bg-color: var(--color-bg-hover);
  }

  /* --- Tab Content Container (The Card) --- */
  .tab-content {
    max-width: 1200px;
    padding: 30px 50px;
    margin: 20px auto;
    margin-top: 0;
    background-color: var(--tab-content-bg-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--card-shadow);
  }

  /* Keep existing width media queries */
  @media (min-width: 768px) {
    .tab-content {
      width: 85%;
    }
  }

  @media (min-width: 1200px) {
    .tab-content {
      width: 60%;
    }
  }
  /* Keep existing mobile width media query for tab-content */
  @media (max-width: 400px) {
    .tab-content {
      width: 90%;
      padding: 20px; /* Adjust padding for smaller screens */
      margin: 15px auto; /* Adjust margin for smaller screens */
    }
  }

  /* --- Form Group (Spacing) --- */
  .form-group {
    margin-bottom: 20px;
  }

  /* Adjust margin for smaller screens */
  @media (max-width: 400px) {
    .form-group {
      margin-bottom: 15px;
    }
  }

  /* --- Form Group Label --- */
  .form-group label {
    display: block;
    margin-bottom: 8px; /* Space between label and input */
    font-weight: 500; /* Slightly less bold */
    /* color: var(--form-label-color); */
    font-size: 0.95em; /* Slightly smaller than input text */
  }

  /* --- Form Input Fields (Text, Number, Textarea, Select) --- */
  /* Combine common styles for consistency */
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group textarea,
  .form-group select,
  .form-group option {
    display: block;
    width: 100%;
  }

  /* Adjust padding and font size for smaller screens */
  @media (max-width: 400px) {
    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group textarea,
    .form-group select {
      padding: 8px 10px;
      font-size: 0.9em;
    }
  }

  /* --- Textarea specific --- */
  textarea {
    /* Keep textarea specific styles */
    resize: vertical; /* Allow vertical resizing */
    min-height: 100px; /* Minimum height */
  }

  /* --- Select Dropdown specific --- */
  .form-group select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 12px top 50%;
    background-size: 12px auto;
    padding-right: 30px;
  }

  /* --- Submit Button --- */
  .submit-btn {
    display: inline-block;
    padding: 12px 25px; /* More padding */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em; /* Use relative size */
    font-weight: 600;
    margin-top: 15px; /* Space above button */
    box-sizing: border-box;
  }

  @media (max-width: 1000px) {
    /* .content{
      width: 100%;
    } */
    .tab-content {
      width: 100%;
    }
  }

  @media (max-width: 400px) {
    .submit-btn {
      padding: 10px 20px;
      font-size: 0.95em;
    }
  }

  /* --- Image Preview --- */
  .image-preview {
    /* Keep image preview styles */
    max-width: 100%;
    max-height: 300px;
    margin-top: 15px;
    display: block;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    object-fit: cover; /* Ensure image covers area nicely if constrained */
  }
  /* Adjust image preview max-height for smaller screens */
  @media (max-width: 400px) {
    .image-preview {
      max-height: 150px; /* Reduce height on smaller screens */
    }
  }
</style>
