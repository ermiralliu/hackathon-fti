<script lang="ts">
	import { enhance } from '$app/forms';

	const { products, userId } = $props();

	let selectedProduct = $state<any>(null);
	let showEditModal = $state(false);
	let modal = $state<HTMLDialogElement | null>(null);

	let editForm = $state({
		id: 0,
		name: '',
		type: '',
		price: 0,
		description: ''
	});

	function openEditModal(product: any) {
		selectedProduct = product;
		editForm = {
			id: product.id,
			name: product.name,
			type: product.type,
			price: product.price,
			description: product.description
		};
		showEditModal = true;
	}

	function closeModal() {
		showEditModal = false;
		selectedProduct = null;
	}
</script>

<div class="admin-container">
    <h1>Produktet e Fermerit (ID: {userId})</h1>
    
    {#if products.length === 0}
        <p class="no-products">Ky fermer nuk ka produkte.</p>
    {:else}
        <table class="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Emri</th>
                    <th>Lloji</th>
                    <th>Çmimi</th>
                    <th>Veprime</th>
                </tr>
            </thead>
            <tbody>
                {#each products as product (product.id)}
                    <tr>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>{product.price}€</td>
                        <td class="actions">
                            <button onclick={() => openEditModal(product)}>Modifiko</button>
                            <form method="POST" action="?/deleteProduct" use:enhance>
                                <input type="hidden" name="id" value={product.id} />
                                <button type="submit" class="danger">Fshi</button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {/if}
</div>

{#if showEditModal && selectedProduct}
    <dialog class="modal" bind:this={modal} onclick={(e) => e.target === modal && closeModal()}>
        <div class="modal-content">
            <h2>Modifiko Produktin</h2>
            
            <form method="POST" action="?/updateProduct" use:enhance>
                <input type="hidden" name="id" value={editForm.id} />
                
                <div class="form-group">
                    <label for="product-name">Emri:</label>
                    <input id="product-name" name="name" bind:value={editForm.name} required />
                </div>
                
                <div class="form-group">
                    <label for="product-type">Lloji:</label>
                    <select id="product-type" name="type" bind:value={editForm.type} required>
                        <option value="FRUIT">Fruta</option>
                        <option value="VEGETABLE">Perime</option>
                        <option value="DAIRY">Qumështore</option>
                        <option value="OTHER">Tjera</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="product-price">Çmimi (€):</label>
                    <input 
                        id="product-price"
                        type="number" 
                        name="price" 
                        bind:value={editForm.price} 
                        step="0.01" 
                        min="0" 
                        required 
                    />
                </div>
                
                <div class="form-group">
                    <label for="product-description">Përshkrimi:</label>
                    <textarea 
                        id="product-description"
                        name="description" 
                        bind:value={editForm.description} 
                        rows="3"
                    ></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="primary">Ruaj Ndryshimet</button>
                    <button type="button" onclick={closeModal}>Anulo</button>
                </div>
            </form>
        </div>
    </dialog>
{/if}

<style>
    /* Your existing styles remain unchanged */
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .no-products {
        text-align: center;
        padding: 2rem;
        color: #666;
    }
    
    .products-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    .products-table th, 
    .products-table td {
        padding: 0.75rem;
        border: 1px solid #ddd;
        text-align: left;
    }
    
    .products-table th {
        background-color: #f5f5f5;
    }
    
    .actions {
        display: flex;
        gap: 0.5rem;
    }
    
    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    button.primary {
        background-color: #4CAF50;
        color: white;
    }
    
    button.danger {
        background-color: #f44336;
        color: white;
    }
    
    .modal {
        border: none;
        border-radius: 8px;
        padding: 1.5rem;
        width: 90%;
        max-width: 500px;
    }
    
    .modal::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 600;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
</style>