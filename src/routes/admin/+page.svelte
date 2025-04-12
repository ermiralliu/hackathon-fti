<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  export let data;
  let activeTab: "users" | "products" = "users";
  let selectedUser: any = null;
  let showUserModal = false;
  let editFormData = {
    username: '',
    password: '',
    role: 'consumer'
  };
  
  // Pagination
  const currentPage = data.currentPage || 1;
  const totalUserPages = data.totalPages || 1;
  const totalProductPages = data.productTotalPages || 1;
  const hasUsers = data.users && data.users.length > 0;
  const hasProducts = data.products && data.products.length > 0;

  function openUserDetails(user: any) {
    selectedUser = user;
    editFormData = {
      username: user.username,
      password: '', // Password field will be empty by default
      role: user.role
    };
    showUserModal = true;
  }

  function closeModal() {
    showUserModal = false;
    selectedUser = null;
  }

  function viewFarmerProducts(userId: number) {
    goto(`/admin/farmer-products/${userId}`);
  }

  async function handleUpdateUser(event: any) {
    const formData = new FormData(event.target);
    const response = await event.submit();
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        // Update the selected user data
        selectedUser.username = formData.get('username') as string;
        selectedUser.role = formData.get('role') as string;
        // Keep the form data populated
        editFormData.username = selectedUser.username;
        editFormData.role = selectedUser.role;
      }
    }
  }
</script>

<div class="admin-panel">
  <h1>Paneli i Administratorit</h1>

  <div class="tabs">
    <button class:active={activeTab === "users"} on:click={() => activeTab = "users"}>
      Përdoruesit
    </button>
    <button class:active={activeTab === "products"} on:click={() => activeTab = "products"}>
      Produktet
    </button>
  </div>

  {#if activeTab === "users"}
    {#if !hasUsers}
      <div class="message error">Nuk ka përdorues</div>
      <div class="pagination">
        <a href="?page=1" class:disabled={currentPage === 1}>
          &laquo; Para
        </a>
        <span>Faqja {currentPage} nga {totalUserPages}</span>
        <a href="?page={currentPage + 1}" class:disabled={currentPage === totalUserPages || !hasUsers}>
          Pas &raquo;
        </a>
      </div>
    {:else}
      <table>
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
          {#each data.users as user (user.id)}
            <tr>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td class="actions">
                <form method="POST" action="?/deleteUser" use:enhance>
                  <input type="hidden" name="userId" value={user.id} />
                  <button type="submit" class="danger">Fshi</button>
                </form>
                <button on:click={() => openUserDetails(user)}>Të dhënat</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="pagination">
        <a href="?page={currentPage - 1}" class:disabled={currentPage === 1}>
          &laquo; Para
        </a>
        <span>Faqja {currentPage} nga {totalUserPages}</span>
        <a href="?page={currentPage + 1}" class:disabled={currentPage === totalUserPages || data.users.length < 6}>
          Pas &raquo;
        </a>
      </div>
    {/if}
  {/if}

  {#if activeTab === "products"}
    {#if !hasProducts}
      <div class="message error">Nuk ka produkte</div>
      <div class="pagination">
        <a href="?page=1" class:disabled={currentPage === 1}>
          &laquo; Para
        </a>
        <span>Faqja {currentPage} nga {totalProductPages}</span>
        <a href="?page={currentPage + 1}" class:disabled={currentPage === totalProductPages || !hasProducts}>
          Pas &raquo;
        </a>
      </div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emri</th>
            <th>Çmimi</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {#each data.products as product (product.id)}
            <tr>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}€</td>
              <td class="actions">
                <form method="POST" action="?/deleteProduct" use:enhance>
                  <input type="hidden" name="productId" value={product.id} />
                  <button type="submit" class="danger">Fshi</button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="pagination">
        <a href="?page={currentPage - 1}" class:disabled={currentPage === 1}>
          &laquo; Para
        </a>
        <span>Faqja {currentPage} nga {totalProductPages}</span>
        <a href="?page={currentPage + 1}" class:disabled={currentPage === totalProductPages || data.products.length < 6}>
          Pas &raquo;
        </a>
      </div>
    {/if}
  {/if}
</div>

{#if showUserModal && selectedUser}
  <div class="modal">
    <div class="modal-content">
      <h2>Të dhënat e përdoruesit</h2>
      <form method="POST" action="?/updateUser" use:enhance on:submit={handleUpdateUser}>
        <input type="hidden" name="id" value={selectedUser.id} />
        
        <div class="form-group">
          <label>Emri:</label>
          <input name="username" bind:value={editFormData.username} />
        </div>
        
        <div class="form-group">
          <label>Fjalëkalimi i ri (lëreni bosh për të mos ndryshuar):</label>
          <input type="password" name="password" bind:value={editFormData.password} />
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input name="email" value={selectedUser.email} readonly class="readonly-field" />
        </div>
        
        <div class="form-group">
          <label>Roli:</label>
          <select name="role" bind:value={editFormData.role}>
            <option value="admin">admin</option>
            <option value="farmer">farmer</option>
            <option value="consumer">consumer</option>
          </select>
        </div>

        <div class="actions">
          <button type="submit" class="primary">Ruaj ndryshimet</button>
          <button type="button" on:click={closeModal}>Mbyll</button>
          {#if selectedUser.role === 'farmer'}
            <button type="button" on:click={() => viewFarmerProducts(selectedUser.id)} class="products-btn">
              Produktet e fermerit
            </button>
          {/if}
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  :root {
    --green: #4CAF50;
    --dark: #333;
    --gray: #f5f5f5;
    --light-gray: #e0e0e0;
    --danger: #f44336;
    --border: #ddd;
    --text: #333;
    --text-light: #666;
    --blue: #2196F3;
  }

  .admin-panel {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    color: var(--text);
  }

  h1 {
    color: var(--green);
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
  }

  .tabs button {
    padding: 0.75rem 1.5rem;
    background: var(--gray);
    border: none;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
    color: var(--text);
  }

  .tabs button.active {
    background: var(--green);
    color: white;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  th, td {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    text-align: left;
    color: var(--text);
  }

  th {
    background: var(--green);
    color: white;
    font-weight: 500;
  }

  tr:hover {
    background-color: rgba(76, 175, 80, 0.05);
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.75rem 1.25rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }

  .primary {
    background: var(--green);
    color: white;
  }

  .primary:hover {
    background: #3d8b40;
  }

  .danger {
    background: var(--danger);
    color: white;
  }

  .danger:hover {
    background: #d32f2f;
  }

  .products-btn {
    background: var(--blue);
    color: white;
  }

  .products-btn:hover {
    background: #1976D2;
  }

  button:not(.primary):not(.danger):not(.products-btn) {
    background: var(--gray);
    color: var(--text);
  }

  button:not(.primary):not(.danger):not(.products-btn):hover {
    background: #e0e0e0;
  }

  .message {
    padding: 1.25rem;
    text-align: center;
    margin: 1.5rem 0;
    border-radius: 4px;
    font-weight: 500;
  }

  .error {
    background: #FFEBEE;
    color: var(--danger);
    border: 1px solid #EF9A9A;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0;
  }

  .pagination a {
    padding: 0.75rem 1.25rem;
    text-decoration: none;
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 4px;
    transition: all 0.2s;
  }

  .pagination a:hover:not(.disabled) {
    background: var(--green);
    color: white;
    border-color: var(--green);
  }

  .pagination a.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .pagination span {
    padding: 0 1rem;
    color: var(--text-light);
  }

  /* Modal Styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .modal-content h2 {
    color: var(--green);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text);
  }

  .form-group input, 
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: white;
    color: var(--text);
    font-size: 1rem;
  }

  .form-group input:focus, 
  .form-group select:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .readonly-field {
    background-color: var(--light-gray);
    color: var(--text-light);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .admin-panel {
      padding: 0.75rem;
    }
    
    table {
      font-size: 0.9rem;
    }
    
    th, td {
      padding: 0.75rem;
    }
    
    .actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    button {
      width: 100%;
    }
    
    .modal-content {
      padding: 1.5rem;
    }
  }
</style>