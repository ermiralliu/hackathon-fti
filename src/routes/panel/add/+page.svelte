<script lang="ts">
  import { enhance } from "$app/forms";
  import { fade } from "svelte/transition";

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
</script>

<svelte:head>
  <title>Add Product</title>
  <meta name="description" content="Add Products to sell" />
</svelte:head>

<div class="tab-content" transition:fade={{ duration: 200 }}>
  <h2>Add New Product</h2>
  <!-- Add enctype attribute here -->
  <form
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
  /* Variables for easier color management within this section */
  /* You might already have these defined at a higher level, but defining local ones provides fallbacks */
  :root {
    --form-border-color: #dcdcdc; /* Softer border */
    --form-bg-color: #ffffff; /* White background for fields */
    --form-bg-color-subtle: #f8f9fa; /* Very light background for container */
    --form-text-color: #333;
    --form-label-color: #555; /* Slightly softer label */
    --form-placeholder-color: #999; /* Soft placeholder */
    --form-focus-color: #007bff; /* Example accent color (can be green or another color) */
    --form-focus-shadow: rgba(0, 123, 255, 0.25); /* Subtle glow for focus */
    --button-primary-bg: #28a745; /* Your current green */
    --button-primary-hover-bg: #218838;
    --button-primary-active-bg: #1e7e34;
    --card-shadow: rgba(0, 0, 0, 0.1); /* Softer card shadow */
  }

  /* --- Tab Content Container (The Card) --- */
  .tab-content {
    max-width: 1200px;
    /* Replace padding: 0; */
    padding: 30px; /* Add internal padding */
    margin: 20px auto; /* Add margin around the card and center it */
    background-color: var(--form-bg-color); /* White background for the card */
    border-radius: 8px; /* Subtle rounded corners for the card */
    box-shadow: 0 4px 12px var(--card-shadow); /* Softer, more spread shadow */
    /* Keep existing width media queries */
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
    margin-bottom: 20px; /* Space between form groups */
  }
  /* Adjust margin for smaller screens */
  @media (max-width: 400px) {
    .form-group {
      margin-bottom: 15px; /* Slightly less space on extra small */
    }
  }

  /* --- Form Group Label --- */
  .form-group label {
    display: block;
    margin-bottom: 8px; /* Space between label and input */
    font-weight: 500; /* Slightly less bold */
    color: var(--form-label-color); /* Use variable */
    font-size: 0.95em; /* Slightly smaller than input text */
  }

  /* --- Form Input Fields (Text, Number, Textarea, Select) --- */
  /* Combine common styles for consistency */
  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group textarea,
  .form-group select {
    display: block; /* Ensure they take full width */
    width: 100%;
    padding: 10px 12px; /* Add slight horizontal padding */
    border: 1px solid var(--form-border-color); /* Use variable */
    border-radius: 4px; /* Subtle rounding */
    font-size: 1em; /* Use relative font size */
    line-height: 1.5; /* Ensure consistent line height */
    color: var(--form-text-color); /* Use variable for text color */
    background-color: var(--form-bg-color); /* White background */
    transition:
      border-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out; /* Smooth transition on focus */
    box-sizing: border-box; /* Include padding and border in element's total width */
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
    appearance: none; /* Keep hiding default arrow */
    /* Add custom arrow/icon */
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); /* Base64 SVG down arrow (light grey) */
    background-repeat: no-repeat;
    background-position: right 12px top 50%; /* Position arrow */
    background-size: 12px auto; /* Size arrow */
    padding-right: 30px; /* Add padding on the right so text doesn't overlap arrow */
    color: var(--form-text-color); /* Use variable */
  }

  /* --- Input Focus State (Apply to all relevant types) --- */
  .form-group input[type="text"]:focus,
  .form-group input[type="number"]:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: var(--form-focus-color); /* Highlight border */
    outline: none; /* Remove default outline */
    box-shadow: 0 0 0 0.2rem var(--form-focus-shadow); /* Subtle glow */
    background-color: var(--form-bg-color); /* Ensure background stays white */
  }

  /* --- Placeholder Text Styling --- */
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: var(--form-placeholder-color); /* Use variable */
    opacity: 1; /* Ensure opacity is not reduced in Firefox */
  }

  /* --- Submit Button --- */
  .submit-btn {
    display: inline-block; /* Or block if full width */
    background-color: var(--button-primary-bg); /* Use variable */
    color: white;
    padding: 12px 25px; /* More padding */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em; /* Use relative size */
    font-weight: 600;
    transition:
      background-color 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out; /* Smooth transition */
    margin-top: 15px; /* Space above button */
    /* Ensure box-sizing if padding/border are part of specific size calculation */
    box-sizing: border-box;
  }

  .submit-btn:hover {
    background-color: var(--button-primary-hover-bg); /* Use variable */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow on hover */
  }

  .submit-btn:active {
    background-color: var(--button-primary-active-bg); /* Use variable */
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2); /* Subtle press effect */
  }

  /* Adjust button padding and font size for smaller screens */
  @media (max-width: 400px) {
    .submit-btn {
      padding: 10px 20px; /* Slightly less padding */
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

  /* --- Optional: Style for file input label (if you hide the default input) --- */
  /* This is an example of styling a label that triggers the file input */
  /* If you don't use this pattern, ignore this rule */
  /*
.form-group input[type="file"] {
    // Hide the default browser file input
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.file-upload-label {
    display: inline-block;
    background-color: #e9ecef; // Light background
    color: var(--form-text-color);
    padding: 8px 12px;
    border: 1px solid var(--form-border-color);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s ease-in-out;
}
.file-upload-label:hover {
    background-color: #d0d3d6;
}
*/
</style>
