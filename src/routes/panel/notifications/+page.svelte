<!-- src/routes/purchase-requests/+page.svelte -->
<script>
  // @ts-nocheck
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let { data } = $props();
  
  let purchaseRequests = $derived(data.purchaseRequests.requests || []);
  let isLoading = $derived(false);
  let error = $derived(false);
  let currentPage = $derived(data.purchaseRequests.currentPage);
  let totalPages = $derived(data.purchaseRequests.totalPages);
  
  let selectedRequest = $state(null);
  let showViewModal = $state(false);
  let modalView;

  // Pagination functions
  function changePage(page) {
      goto(`/purchase-requests?page=${page}`, { noScroll: true });
  }

  function getPageNumbers() {
      let pages = [];
      for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
      }
      return pages;
  }

  // Modal functions
  $effect(() => {
      if (showViewModal && modalView) {
          modalView.showModal();
      }
  });

  function openViewModal(request) {
      selectedRequest = request;
      showViewModal = true;
  }

  function closeModals() {
      if (showViewModal && modalView) modalView.close();
      showViewModal = false;
      selectedRequest = null;
  }

  async function updateRequestStatus(requestId, newStatus) {
      try {
          const response = await fetch(`?/updateRequestStatus`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  requestId,
                  status: newStatus
              })
          });

          const result = await response.json();
          
          if (result.success) {
              // Update local state
              purchaseRequests = purchaseRequests.map(req => 
                  req.id === requestId ? { ...req, status: newStatus } : req
              );
              
              if (selectedRequest?.id === requestId) {
                  selectedRequest = { ...selectedRequest, status: newStatus };
              }
          }
          
          return result;
      } catch (error) {
          console.error('Failed to update status:', error);
          return { success: false, message: 'Failed to update status' };
      }
  }
</script>

<main class="requests-container">
  <h1>Purchase Requests 📋</h1>
  
  {#if isLoading}
      <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading purchase requests...</p>
      </div>
  {:else if error}
      <div class="error-message">
          <p>⚠️ Error loading requests: {error}</p>
          <button onclick={reloadRequests}>Try Again</button>
      </div>
  {:else if !purchaseRequests.length}
      <div class="empty-state">
          <p>No purchase requests available.</p>
      </div>
  {:else}
      <div class="requests-grid">
          {#each purchaseRequests as request (request.id)}
              <article class="request-card" in:fade={{ duration: 300 }}>
                  <div class="request-header">
                      <h3>Request #{request.id}</h3>
                      <span class={`status-badge ${request.status.toLowerCase()}`}>
                          {request.status}
                      </span>
                  </div>
                  
                  <div class="request-details">
                      <p><strong>Product:</strong> {request.product.name}</p>
                      <p><strong>From:</strong> {request.consumer.name}</p>
                      {#if request.quantity}
                          <p><strong>Quantity:</strong> {request.quantity}</p>
                      {/if}
                      <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div class="request-actions">
                      <button onclick={() => openViewModal(request)}>
                          View Details
                      </button>
                  </div>
              </article>
          {/each}
      </div>
      
      <div class="pagination">
          {#if currentPage > 1}
              <button onclick={() => changePage(currentPage - 1)}>Previous</button>
          {/if}

          {#each getPageNumbers() as pageNumber}
              <button
                  class:active={pageNumber === currentPage}
                  onclick={() => changePage(pageNumber)}
              >
                  {pageNumber}
              </button>
          {/each}

          {#if currentPage < totalPages}
              <button onclick={() => changePage(Number(currentPage) + 1)}>Next</button>
          {/if}
      </div>
  {/if}
</main>

<!-- View Modal -->
{#if showViewModal}
<dialog bind:this={modalView} onclick={e => e.target === modalView && closeModals()}>
  <div class="modal">
      <div class="modal-header">
          <h2>Request #{selectedRequest.id}</h2>
          <button onclick={closeModals}>&times;</button>
      </div>
      
      <div class="modal-body">
          <div class="request-info">
              <div class="info-row">
                  <span class="label">Product:</span>
                  <span class="value">{selectedRequest.product.name}</span>
              </div>
              
              <div class="info-row">
                  <span class="label">From:</span>
                  <span class="value">{selectedRequest.consumer.name}</span>
              </div>

              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{selectedRequest.consumer.email}</span>
            </div>
              
              <div class="info-row">
                  <span class="label">Date:</span>
                  <span class="value">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
              </div>
              
              {#if selectedRequest.quantity}
              <div class="info-row">
                  <span class="label">Quantity:</span>
                  <span class="value">{selectedRequest.quantity}</span>
              </div>
              {/if}
              
              {#if selectedRequest.message}
              <div class="info-row">
                  <span class="label">Message:</span>
                  <p class="value">{selectedRequest.message}</p>
              </div>
              {/if}
              
              <div class="info-row">
                  <span class="label">Status:</span>
                  <span class="value status-badge {selectedRequest.status}">
                      {selectedRequest.status}
                  </span>
              </div>
          </div>
          
          <div class="status-actions">
              {#if selectedRequest.status !== 'accepted'}
              <form method="POST" action="?/updateRequestStatus" use:enhance>
                <input type="hidden" value={selectedRequest.id} name="requestId">
                <input type="hidden" value="accepted" name="status">
                  <button 
                      class="accept-btn" 
                  >
                      Accept
                  </button>
              </form>
              
              {/if}
              
              {#if selectedRequest.status !== 'rejected'}
              <form method="POST" action="?/updateRequestStatus" use:enhance>
                <input type="hidden" value={selectedRequest.id} name="requestId">
                <input type="hidden" value="declined" name="status">

                <button 
                    type="submit"
                    class="reject-btn" 
                >
                    Reject
                </button>
              </form>
              
              {/if}
              
              <!-- {#if selectedRequest.status !== 'PENDING'}
              <form method="POST" action="?/deleteProduct" use:enhance>
                <button 
                    class="pending-btn" 
                    onclick={() => updateRequestStatus(selectedRequest.id, 'pending')}
                >
                    Set as Pending
                </button>
              </form>
              {/if} -->
          </div>
      </div>
  </div>
</dialog>
{/if}

<style>
  .requests-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
  }

  h1 {
      text-align: center;
      color: #2b6e30;
      margin-bottom: 2rem;
      font-size: 2rem;
  }

  .requests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
  }

  .request-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
  }

  .request-card:hover {
      transform: translateY(-3px);
  }

  .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
  }

  .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
  }

  .status-badge.pending {
      background-color: #fff3cd;
      color: #856404;
  }

  .status-badge.accepted {
      background-color: #d4edda;
      color: #155724;
  }

  .status-badge.rejected {
      background-color: #f8d7da;
      color: #721c24;
  }

  .request-details {
      margin-bottom: 1rem;
  }

  .request-details p {
      margin: 0.5rem 0;
  }

  .request-actions button {
      width: 100%;
      padding: 0.75rem;
      background: #2b6e30;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s ease;
  }

  .request-actions button:hover {
      background: #1e5a23;
  }

  /* Modal styles */
  dialog {
      border: none;
      border-radius: 8px;
      padding: 0;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  dialog::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
      padding: 1.5rem;
  }

  .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 1rem;
  }

  .modal-header h2 {
      margin: 0;
  }

  .modal-header button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
  }

  .info-row {
      margin-bottom: 1rem;
  }

  .label {
      font-weight: bold;
      display: block;
      margin-bottom: 0.25rem;
      color: #555;
  }

  .value {
      display: block;
  }

  .status-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
  }

  .status-actions button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
  }

  .accept-btn {
      background-color: #28a745;
      color: white;
  }

  .reject-btn {
      background-color: #dc3545;
      color: white;
  }

  .pending-btn {
      background-color: #ffc107;
      color: #212529;
  }

  /* Pagination styles */
  .pagination {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
      gap: 0.5rem;
  }

  .pagination button {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
  }

  .pagination button.active {
      background-color: #2b6e30;
      color: white;
      border-color: #2b6e30;
  }

  .pagination button:hover:not(.active) {
      background-color: #f5f5f5;
  }

  /* Loading and error states */
  .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
  }

  .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #2b6e30;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  .error-message {
      background: #ffecec;
      color: #ff5252;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
  }

  .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
  }
</style>