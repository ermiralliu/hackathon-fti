<script lang="ts">
    import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

  export let data;
  let activeTab: "users" | "products" = "users";
  let editingUserId: number | null = null;
  let editingProductId: number | null = null;

  // Funksioni për të kontrolluar dhe siguruar që nuk kemi null në vlera
  function getValidString(value: string | null): string {
    return value ?? '';
  }

  function getValidNumber(value: number | null): number {
    return value ?? 0;
  }

  // Funksioni për të përditësuar përdoruesin
  function updateUser(user: any) {
    const updatedUser = {
      ...user,
      username: getValidString(user.username),
      email: getValidString(user.email),
      role: user.role ?? 'consumer',
    };
    // Përdorni funksionalitetin për përditësimin e përdoruesit
    data.users = data.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    editingUserId = null; // Mbyll modalin e editimit
  }

  // Funksioni për të përditësuar produktin
  function updateProduct(product: any) {
    const updatedProduct = {
      ...product,
      name: getValidString(product.name),
      description: getValidString(product.description),
      price: getValidNumber(product.price),
    };
    // Përdorni funksionalitetin për përditësimin e produktit
    data.products = data.products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    editingProductId = null; // Mbyll modalin e editimit
  }

  // Funksioni për të fshirë produktin
  function deleteProduct(productId: number) {
    data.products = data.products.filter(product => product.id !== productId);
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
                  <button on:click={() => updateUser(user)}>Ruaj</button>
                  <button on:click={() => editingUserId = null}>Anulo</button>
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
                  <button on:click={() => editingUserId = user.id}>Modifiko</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
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
                  <button on:click={() => updateProduct(product)}>Ruaj</button>
                  <button on:click={() => editingProductId = null}>Anulo</button>
                </td>
              {:else}
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} €</td>
                <td>
                  <form method="POST" action="?/deleteProduct" style="display:inline;" on:submit={() => deleteProduct(product.id)}>
                    <input type="hidden" name="productId" value={product.id} />
                    <button type="submit">Fshi</button>
                  </form>
                  <button on:click={() => editingProductId = product.id}>Modifiko</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
</div>
