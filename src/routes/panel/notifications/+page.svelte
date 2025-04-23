<!-- src/routes/purchase-requests/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import InfoRow from "$lib/client/components/infoRow.svelte";
  import ModalDialog from "$lib/client/components/modalDialog.svelte";
  import type { Status } from "$prisma-client";
  import { fade } from "svelte/transition";

  let { data } = $props();

  let show = $state(false);
  function closeModal(){
    show = false;
  }
  $inspect(show);

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
</script>

<svelte:head>
  <title>Notifications</title>
  <meta name="description" content="Notifications from buyers" />
</svelte:head>

<main class="requests-container"  transition:fade={{duration: 200}}>
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
                show = true;
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

<!-- View Modal -->
<ModalDialog {show} {closeModal}>
  {#snippet header()}
    <h2>Request #{selectedRequest?.id ?? "bad"}</h2>
  {/snippet}

  {#snippet body()}
    {#if selectedRequest}
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
        <InfoRow
          label="Quantity:"
          data={selectedRequest.quantity ?? "Quantity unknown"}
        />
        <InfoRow
          label="Message:"
          data={selectedRequest.message ?? "No message provided"}
        />
        <InfoRow label="Status:" data={selectedRequest.status} />
      </div>
    {/if}
  {/snippet}

  {#snippet footer()}
    {#if selectedRequest}
      {#if selectedRequest.status !== "accepted"}
        <form method="POST" action="?/updateRequestStatus" use:enhance>
          <input type="hidden" value={selectedRequest.id} name="requestId" />
          <input type="hidden" value="accepted" name="status" />
          <button class="accept-btn footer-button"> Accept </button>
        </form>
      {/if}

      {#if selectedRequest.status !== ("rejected" as Status)}
        <form method="POST" action="?/updateRequestStatus" use:enhance>
          <input type="hidden" value={selectedRequest.id} name="requestId" />
          <input type="hidden" value="declined" name="status" />

          <button type="submit" class="reject-btn footer-button"> Reject </button>
        </form>
      {/if}
    {/if}
  {/snippet}
</ModalDialog>

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
/* Dialog footer buttons */
    button.footer-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }
</style>
