<script lang="ts">
  import type { Product, ProductType } from "$prisma-client";
  import Card from "./card.svelte";
  export interface ProductDto {
    name: string;
    type: ProductType;
    price: number | null; // kto null do behen undefined maybe, idk
    imagePath: string | null;
    farmer: {
      name: string| null;
    };
  }
  let {
    product,
    selectedProduct = $bindable(),
    show = $bindable(),
  }: {
    product: ProductDto;
    selectedProduct?: ProductDto | Product | null;
    show?: boolean;
  } = $props();
</script>

<Card>
  <div class="product-image">
    <img src={product.imagePath} alt={product.name} loading="lazy" />
    <!-- {#if product.isOrganic} // we have to add isOrganic to the database table
          <span class="organic-badge">Organic</span>
        {/if} -->
  </div>
  <div class="product-details">
    <h2>{product.name}</h2>
    <p class="product-description">{product.type}</p>
    <div class="product-meta">
      <span class="price">{product.price}€</span>
      <span class="farmer">By {product.farmer.name}</span>
    </div>
    {#if show !== undefined }
      <button
        onclick={() => {
          selectedProduct = product;
          show = true;
        }}
      >
        Me shume
      </button>
    {/if}
  </div>
</Card>

<style>
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

  /* .organic-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #2b6e30;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
  } */

  .product-details {
    padding: 1.25rem;
  }

  .product-details h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    /* color: #333; */
  }

  .product-description {
    /* color: #666; */
    font-size: 0.9rem;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
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
</style>
