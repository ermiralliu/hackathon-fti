<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  export let data;
  let activeTab: "users" | "products" = "users";
  let editingUserId: number | null = null;
  let editingProductId: number | null = null;
  
  // Pagination variables
  let currentPage = 1;
  let itemsPerPage = 5;

  // Calculate total pages for users and products
  let totalUserPages = Math.ceil(data.users.length / itemsPerPage);
  let totalProductPages = Math.ceil(data.products.length / itemsPerPage);


  // Funksioni për të lëvizur ndërmjet faqeve
  function changePage(page: number) {
    currentPage = page;
  }


</script>

<div class="admin-panel">
  <h1>Paneli i Administratorit</h1>

  <!-- Tab Switch Buttons -->
  <div class="tabs">
    <button class:active={activeTab === "users"} on:click={() => (activeTab = "users")}>Përdoruesit</button>
    <button class:active={activeTab === "products"} on:click={() => (activeTab = "products")}>Produktet</button>
  </div>

  {#if activeTab === "users"}
    {#if data.users.length === 0}
      <div class="error-message">Nuk ka përdorues ose ndodhi një gabim</div>
    {:else}
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Roli</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user}
            <tr>
              <td>{user.id}</td>
              {#if editingUserId === user.id}
                <td><input name="username" bind:value={user.username} /></td>
                <td><input name="email" bind:value={user.email} /></td>
                <td>
                  <select bind:value={user.role}>
                    <option value="admin">admin</option>
                    <option value="farmer">farmer</option>
                    <option value="consumer">consumer</option>
                  </select>
                </td>
                <td>
                  <button >Ruaj</button>
                  <button>Anulo</button>
                </td>
              {:else}
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <form method="POST" action="?/deleteUser" style="display:inline;" use:enhance>
                    <input type="hidden" name="userId" value={user.id} />
                    <button type="submit">Fshi</button>
                  </form>
                  <button>Modifiko</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>&laquo; Para</button>
        <span>Faqja {currentPage} nga {totalUserPages}</span>
        <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalUserPages}>Pas &raquo;</button>
      </div>
    {/if}
  {/if}

  {#if activeTab === "products"}
    {#if data.products.length === 0}
      <div class="error-message">Nuk ka produkte ose ndodhi një gabim</div>
    {:else}
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Përshkrimi</th>
            <th>Çmimi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {#each data.products as product}
            <tr>
              <td>{product.id}</td>
              {#if editingProductId === product.id}
                <td><input name="name" bind:value={product.name} /></td>
                <td><input name="description" bind:value={product.description} /></td>
                <td><input name="price" type="number" bind:value={product.price} /></td>
                <td>
                  <button >Ruaj</button>
                  <button>Anulo</button>
                </td>
              {:else}
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} €</td>
                <td>
                  <form method="POST" action="?/deleteProduct" style="display:inline;" >
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit">Fshi</button>
                  </form>
                  <button >Modifiko</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="pagination">
        <button on:click={() => changePage(currentPage - 1)} disabled={currentPage === 1}>&laquo; Para</button>
        <span>Faqja {currentPage} nga {totalProductPages}</span>
        <button on:click={() => changePage(currentPage + 1)} disabled={currentPage === totalProductPages}>Pas &raquo;</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .pagination {
    margin-top: 20px;
    text-align: center;
  }

  .pagination button {
    padding: 5px 15px;
    margin: 0 5px;
    cursor: pointer;
  }

  .pagination button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .tabs button.active {
    font-weight: bold;
  }
</style>
