<!-- src/routes/purchase-requests/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import InfoRow from "$lib/components/infoRow.svelte";
  import type { Product, PurchaseRequest, Status } from "$prisma-client";
  import { fade } from "svelte/transition";

  let { data } = $props();

  let purchaseRequests = $derived(data.purchaseRequests.requests || []);
  let currentPage = $derived(data.purchaseRequests.currentPage);
  let totalPages = $derived(data.purchaseRequests.totalPages);

  let selectedRequest: null | (typeof purchaseRequests)[0] = $state(null);
  let modalView: HTMLDialogElement; // I'll need to check, cause I think there's probably a better way, but just to remove the error for now

  // Pagination functions
  function changePage(page: number) {
    goto(`/purchase-requests?page=${page}`, { noScroll: true });
  }

  function getPageNumbers() {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  function openViewModal() {
    modalView.showModal();
    // setTimeout(() => {
    modalView.classList.add("openedDialog");
    // }, 50);
  }

  function closeModal() {
    modalView.classList.remove("openedDialog");
    setTimeout(() => {
      modalView.close();
    }, 300);
  }
</script>

<main class="requests-container">
  <h1>Purchase Requests 📋</h1>

  {#if !purchaseRequests}
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading purchase requests...</p>
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

          <dl class="request-details">
            <dt><strong>Product:</strong></dt>
            <dd>{request.product.name}</dd>
            <dt><strong>From:</strong></dt>
            <dd>{request.consumer.name}</dd>
            {#if request.quantity}
              <dt><strong>Quantity:</strong></dt>
              <dd>{request.quantity}</dd>
            {/if}
            <dt><strong>Date:</strong></dt>
            <dd>
              <time datetime={request.createdAt.toISOString()}>
                {request.createdAt.toDateString()}
              </time>
            </dd>
          </dl>

          <div class="request-actions">
            <button
              onclick={() => {
                selectedRequest = request;
                openViewModal();
              }}
            >
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
        <button onclick={() => changePage(Number(currentPage) + 1)}>Next</button
        >
      {/if}
    </div>
  {/if}
</main>

{#snippet modalInfo(label = "Data:", data = "data")}
  <dl class="info-row">
    <dd class="label">{label}</dd>
    <dt class="value">{data}</dt>
  </dl>
{/snippet}

<!-- View Modal -->
<dialog
  bind:this={modalView}
  onclick={e => {
    if (e.target === modalView) closeModal(); // For some reason you should click the part associated with dialog reference
  }}
>
  {#if selectedRequest}
    <div class="modal">
      <header class="modal-header">
        <h2>Request #{selectedRequest.id}</h2>
        <button onclick={closeModal}>&times;</button>
      </header>

      <div class="modal-body">
        <div class="request-info">
          <InfoRow label="Product:" data={selectedRequest.product.name} />
          <InfoRow
            label="From:"
            data={selectedRequest.consumer.name ?? "unnamed?"}
          />
          <InfoRow label="Email:" data={selectedRequest.consumer.email} />
          <InfoRow
            label="Date:"
            data={selectedRequest.createdAt.toDateString()}
          />
          {#if selectedRequest.quantity}
            <InfoRow label="Quantity:" data={selectedRequest.quantity}/>
          {/if}

          {#if selectedRequest.message}
            <InfoRow label="Message:" data={selectedRequest.message}/>
          {/if}
          <InfoRow label="Status:" data={selectedRequest.status}/>
        </div>

      </div>
      
      <footer class="status-actions">
        {#if selectedRequest.status !== "accepted"}
          <form method="POST" action="?/updateRequestStatus" use:enhance>
            <input
              type="hidden"
              value={selectedRequest.id}
              name="requestId"
            />
            <input type="hidden" value="accepted" name="status" />
            <button class="accept-btn"> Accept </button>
          </form>
        {/if}

        {#if selectedRequest.status !== ("rejected" as Status)}
          <form method="POST" action="?/updateRequestStatus" use:enhance>
            <input
              type="hidden"
              value={selectedRequest.id}
              name="requestId"
            />
            <input type="hidden" value="declined" name="status" />

            <button type="submit" class="reject-btn"> Reject </button>
          </form>
        {/if}
      </footer>
    </div>
  {/if}
</dialog>

<style>
  /* Would've preferred to use dialog::backdrop, however transitions there are not compatible with Firefox */
  /* So ::before is the best option */
  dialog::before {
    content: "";
    position: fixed;
    z-index: -1; /* This places it behind the dialog content */
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    pointer-events: none;
  }

  dialog {
    z-index: 1;
  }

  /* hide default backdrop */
  dialog::backdrop {
    opacity: 0;
  }

  :root {
    --transition-delay: 0s;
    --transition-duration: 0.3s;
  }

  /* add transitions */
  dialog,
  dialog::before {
    display: block;
    transition: var(--transition-duration) var(--transition-delay) opacity;
    opacity: 0;
  }

  .openedDialog,
  .openedDialog::before {
    opacity: 1;
  }
  .openedDialog {
    visibility: visible;
  }

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

  .modal {
    padding: 1.5rem;
    /* position: relative; */
    /* z-index: 1; */
    background-color: white;
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

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style>
