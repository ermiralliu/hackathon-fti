<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

  interface Translation {
    title: string;
    tabs: { users: string; products: string };
    tableHeaders: { id: string; name: string; email: string; role: string; actions: string; price: string };
    messages: { noUsers: string; noProducts: string };
    buttons: { delete: string; details: string; save: string; close: string; farmerProducts: string; prev: string; next: string };
    userModal: { title: string; username: string; password: string; email: string; role: string };
    roles: { admin: string; farmer: string; consumer: string };
    pagination: string;
  }

  const translations: Record<string, Translation> = {
    en: {
      title: "Admin Panel",
      tabs: { users: "Users", products: "Products" },
      tableHeaders: { id: "ID", name: "Name", email: "Email", role: "Role", actions: "Actions", price: "Price" },
      messages: { noUsers: "No users found", noProducts: "No products found" },
      buttons: { delete: "Delete", details: "Details", save: "Save Changes", close: "Close", farmerProducts: "Farmer's Products", prev: "« Prev", next: "Next »" },
      userModal: { title: "User Details", username: "Username:", password: "New Password (leave blank to keep current):", email: "Email:", role: "Role:" },
      roles: { admin: "admin", farmer: "farmer", consumer: "consumer" },
      pagination: "Page {0} of {1}"
    },
    sq: {
      title: "Paneli i Administratorit",
      tabs: { users: "Përdoruesit", products: "Produktet" },
      tableHeaders: { id: "ID", name: "Emri", email: "Email", role: "Roli", actions: "Veprime", price: "Çmimi" },
      messages: { noUsers: "Nuk ka përdorues", noProducts: "Nuk ka produkte" },
      buttons: { delete: "Fshi", details: "Të dhënat", save: "Ruaj ndryshimet", close: "Mbyll", farmerProducts: "Produktet e fermerit", prev: "« Para", next: "Pas »" },
      userModal: { title: "Të dhënat e përdoruesit", username: "Emri:", password: "Fjalëkalimi i ri (lëreni bosh për të mos ndryshuar):", email: "Email:", role: "Roli:" },
      roles: { admin: "admin", farmer: "fermer", consumer: "konsumator" },
      pagination: "Faqja {0} nga {1}"
    }
  };

  let currentLang = 'sq';
  if (typeof localStorage !== 'undefined') {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && translations[savedLang]) {
      currentLang = savedLang;
    }
  }

  function t(key: string, ...params: any[]): string {
    const keys = key.split('.');
    let value: any = translations[currentLang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else return key;
    }

    if (typeof value === 'string' && params.length > 0) {
      return params.reduce((acc, param, index) => acc.replace(`{${index}}`, param), value);
    }

    return value || key;
  }

  export let data;
  let activeTab: "users" | "products" = "users";
  let selectedUser: any = null;
  let showUserModal = false;
  let editFormData = {
    username: '',
    password: '',
    role: 'consumer'
  };

  const currentPage = data.currentPage || 1;
  const totalUserPages = data.totalPages || 1;
  const totalProductPages = data.productTotalPages || 1;
  const hasUsers = data.users && data.users.length > 0;
  const hasProducts = data.products && data.products.length > 0;

  function openUserDetails(user: any) {
    selectedUser = user;
    editFormData = {
      username: user.username,
      password: '',
      role: user.role
    };
    showUserModal = true;
  }

  function closeModal() {
    showUserModal = false;
    selectedUser = null;
  }

  async function handleUpdateUser(event: any) {
    const formData = new FormData(event.target);
    const response = await event.submit();
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        selectedUser.username = formData.get('username') as string;
        selectedUser.role = formData.get('role') as string;
        editFormData.username = selectedUser.username;
        editFormData.role = selectedUser.role;
        closeModal();
      }
    }
  }

  $: {
    if (typeof localStorage !== 'undefined') {
      const lang = localStorage.getItem('selectedLanguage') || 'sq';
      if (lang !== currentLang && translations[lang]) {
        currentLang = lang;
      }
    }
  }
</script>

<div class="admin-panel">
  <div class="header">
    <h1>{t('title')}</h1>
    <LanguageSwitcher />
  </div>

  <div class="tabs">
    <button class:active={activeTab === "users"} on:click={() => activeTab = "users"}>
      {t('tabs.users')}
    </button>
    <button class:active={activeTab === "products"} on:click={() => activeTab = "products"}>
      {t('tabs.products')}
    </button>
  </div>

  {#if activeTab === "users"}
    {#if !hasUsers}
      <div class="message error">{t('messages.noUsers')}</div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{t('tableHeaders.id')}</th>
            <th>{t('tableHeaders.name')}</th>
            <th>{t('tableHeaders.email')}</th>
            <th>{t('tableHeaders.role')}</th>
            <th>{t('tableHeaders.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {#each data.users as user (user.id)}
            <tr>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{t('roles.' + user.role)}</td>
              <td class="actions">
                <form method="POST" action="?/deleteUser" use:enhance>
                  <input type="hidden" name="userId" value={user.id} />
                  <button type="submit" class="danger">{t('buttons.delete')}</button>
                </form>
                <button on:click={() => openUserDetails(user)}>{t('buttons.details')}</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <div class="pagination">
      <a href="?page={currentPage - 1}" class:disabled={currentPage === 1}>
        {t('buttons.prev')}
      </a>
      <span>{t('pagination', currentPage, totalUserPages)}</span>
      <a href="?page={currentPage + 1}" class:disabled={currentPage === totalUserPages || data.users.length < 6}>
        {t('buttons.next')}
      </a>
    </div>
  {/if}

  {#if activeTab === "products"}
    {#if !hasProducts}
      <div class="message error">{t('messages.noProducts')}</div>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{t('tableHeaders.id')}</th>
            <th>{t('tableHeaders.name')}</th>
            <th>{t('tableHeaders.price')}</th>
            <th>{t('tableHeaders.actions')}</th>
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
                  <button type="submit" class="danger">{t('buttons.delete')}</button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    <div class="pagination">
      <a href="?page={currentPage - 1}" class:disabled={currentPage === 1}>
        {t('buttons.prev')}
      </a>
      <span>{t('pagination', currentPage, totalProductPages)}</span>
      <a href="?page={currentPage + 1}" class:disabled={currentPage === totalProductPages || data.products.length < 6}>
        {t('buttons.next')}
      </a>
    </div>
  {/if}
</div>

{#if showUserModal && selectedUser}
  <div class="modal">
    <div class="modal-content">
      <h2>{t('userModal.title')}</h2>
      <form method="POST" action="?/updateUser" use:enhance on:submit={handleUpdateUser}>
        <input type="hidden" name="id" value={selectedUser.id} />

        <div class="form-group">
          <label for="username">{t('userModal.username')}</label>
          <input id="username" name="username" bind:value={editFormData.username} />
        </div>

        <div class="form-group">
          <label for="password">{t('userModal.password')}</label>
          <input id="password" type="password" name="password" bind:value={editFormData.password} />
        </div>

        <div class="form-group">
          <label for="email">{t('userModal.email')}</label>
          <input id="email" name="email" value={selectedUser.email} readonly class="readonly-field" />
        </div>

        <div class="form-group">
          <label for="role">{t('userModal.role')}</label>
          <select id="role" name="role" bind:value={editFormData.role}>
            <option value="admin">{t('roles.admin')}</option>
            <option value="farmer">{t('roles.farmer')}</option>
            <option value="consumer">{t('roles.consumer')}</option>
          </select>
        </div>

        <div class="actions">
          <button type="submit" class="primary">{t('buttons.save')}</button>
          <button type="button" on:click={closeModal}>{t('buttons.close')}</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  :root {
    --primary-green: #2E7D32;
    --secondary-green: #4CAF50;
    --light-green: #8BC34A;
    --lighter-green: #C8E6C9;
    --dark: #2E2E2E;
    --light-gray: #F5F5F5;
    --medium-gray: #E0E0E0;
    --danger: #D32F2F;
    --warning: #FFA000;
    --white: #FFFFFF;
    --text-light: #757575;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .admin-panel {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: var(--dark);
    background-color: var(--white);
    border-radius: 8px;
    box-shadow: var(--shadow);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--medium-gray);
  }

  h1 {
    color: var(--primary-green);
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .tabs button {
    padding: 0.75rem 1.5rem;
    border: none;
    background-color: transparent;
    color: var(--text-light);
    font-weight: 500;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    position: relative;
  }

  .tabs button.active {
    color: var(--primary-green);
    background-color: var(--lighter-green);
    font-weight: 600;
  }

  .tabs button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--primary-green);
    border-radius: 3px 3px 0 0;
  }

  .tabs button:hover:not(.active) {
    background-color: rgba(139, 195, 74, 0.1);
    color: var(--primary-green);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
    background-color: var(--white);
    box-shadow: var(--shadow);
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--medium-gray);
  }

  th {
    background-color: var(--primary-green);
    color: var(--white);
    font-weight: 500;
  }

  tr:nth-child(even) {
    background-color: var(--light-gray);
  }

  tr:hover {
    background-color: var(--lighter-green);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  button.primary {
    background-color: var(--primary-green);
    color: var(--white);
  }

  button.primary:hover {
    background-color: #1B5E20;
  }

  button.danger {
    background-color: var(--danger);
    color: var(--white);
  }

  button.danger:hover {
    background-color: #B71C1C;
  }


  .message {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .message.error {
    background-color: #FFEBEE;
    color: var(--danger);
    border-left: 4px solid var(--danger);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .pagination a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--primary-green);
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .pagination a:hover:not(.disabled) {
    background-color: var(--lighter-green);
    border-color: var(--primary-green);
  }

  .pagination a.disabled {
    color: var(--text-light);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .pagination span {
    color: var(--text-light);
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--white);
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .modal h2 {
    color: var(--primary-green);
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--dark);
    font-weight: 500;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    font-size: 1rem;
  }

  .form-group input.readonly-field {
    background-color: var(--light-gray);
    color: var(--text-light);
  }

  .modal .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .admin-panel {
      padding: 1rem;
    }
    
    .tabs {
      flex-direction: column;
    }
    
    .actions {
      flex-direction: column;
    }
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
</style>