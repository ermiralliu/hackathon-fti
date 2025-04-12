<script lang="ts">
    export let data;
    let activeTab: "users" | "products" = "users";
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
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td><button>Fshi</button></td>
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
            </tr>
          </thead>
          <tbody>
            {#each data.products as product}
              <tr>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} €</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {/if}
  </div>
  