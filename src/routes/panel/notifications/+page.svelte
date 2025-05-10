<!-- src/routes/purchase-requests/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import Card from "$lib/client/components/card.svelte";
  import InfoRow from "$lib/client/components/infoRow.svelte";
  import ModalDialog from "$lib/client/components/modalDialog.svelte";
  import type { Status } from "$prisma-client";
  import { fade } from "svelte/transition";

  let { data } = $props();

  let show = $state(false);
  function closeModal() {
    show = false;
  }
  $inspect(show);

  let selectedRequest: null | (typeof data.purchaseRequests.requests)[0] =
    $state(null);

  // Pagination functions
  function changePage(page: number) {
    goto(`/purchase-requests?page=${page}`, { noScroll: true });
  }

  function getPageNumbers() {
    return Array.from(
      { length: data.purchaseRequests.totalPages },
      (_, i) => i + 1,
    );
  }
</script>

<svelte:head>
  <title>Notifications</title>
  <meta name="description" content="Notifications from buyers" />
</svelte:head>

<main class="requests-container">
  <h1 class="main-header">Purchase Requests 📋</h1>

  {#if !data.purchaseRequests}
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading purchase requests...</p>
    </div>
  {:else if !data.purchaseRequests.requests.length}
    <div class="empty-state">
      <p>No purchase requests available.</p>
    </div>
  {:else}
    <ul class="requests-grid">
      {#each data.purchaseRequests.requests as request (request.id)}
        <li>
          <Card class="notification-item">
            <div class="request-header-notification">
              <h3 class="request-id">Request #{request.id}</h3>
              <span
                class={[
                  "status-badge",
                  `status-${request.status.toLowerCase()}`,
                ]}
              >
                {request.status}
              </span>
            </div>
            <dl class="request-details-notification">
              <div class="detail-pair">
                <dt><strong>Product:</strong></dt>
                <dd>{request.product.name}</dd>
              </div>
              <div class="detail-pair">
                <dt><strong>From:</strong></dt>
                <dd>{request.consumer.name}</dd>
              </div>
              {#if request.quantity}
                <div class="detail-pair">
                  <dt><strong>Quantity:</strong></dt>
                  <dd>{request.quantity}</dd>
                </div>
              {/if}
              <div class="detail-pair">
                <dt><strong>Date:</strong></dt>
                <dd>
                  <time datetime={request.createdAt.toISOString()}>
                    {request.createdAt.toDateString()}
                  </time>
                </dd>
              </div>
            </dl>
            <div class="request-actions-notification">
              <button
                class="view-details-button"
                onclick={() => {
                  selectedRequest = request;
                  show = true;
                }}
              >
                View Details
              </button>
            </div>
          </Card>
        </li>
      {/each}
    </ul>
    {#if data.purchaseRequests.totalPages < 1}
      <div class="pagination">
        {#if data.purchaseRequests.currentPage > 1}
          <button
            onclick={() => changePage(data.purchaseRequests.currentPage - 1)}
            >Previous</button
          >
        {/if}

        {#each getPageNumbers() as pageNumber}
          <button
            class:active={pageNumber === data.purchaseRequests.currentPage}
            onclick={() => changePage(pageNumber)}
          >
            {pageNumber}
          </button>
        {/each}

        {#if data.purchaseRequests.currentPage < data.purchaseRequests.totalPages}
          <button
            onclick={() =>
              changePage(Number(data.purchaseRequests.currentPage) + 1)}
            >Next</button
          >
        {/if}
      </div>
    {/if}
  {/if}
</main>

<!-- View Modal -->
<ModalDialog bind:show>
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

          <button type="submit" class="reject-btn footer-button">
            Reject
          </button>
        </form>
      {/if}
    {/if}
  {/snippet}
</ModalDialog>

<style>

  .requests-grid > li {
    margin-bottom: 5px;
    list-style-type: none;
  }

  :global(.notification-item) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 0 3%;
  }

  .request-header-notification {
    display: flex;
    align-items: center;
  }

  .request-id {
    margin-right: 10px;
  }

  .status-badge {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.8em;
  }

  .status-badge.status-open {
    background-color: #e0f7fa;
    color: #00acc1;
  }

  .status-badge.status-pending {
    background-color: #fffde7;
    color: #fbc02d;
  }

  .status-badge.status-closed {
    background-color: #f1f8e9;
    color: #4caf50;
  }

  .request-details-notification {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    width: 60%;
  }

  .detail-pair {
    margin-right: 15px;
  }

  .detail-pair dt {
    display: inline;
  }

  .detail-pair dd {
    display: inline;
    margin-left: 5px;
  }

  .requests-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  /* .requests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  } */

  .request-card {
    background-color: var(--color-bg-active);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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

  .reject-btn {
    background-color: #dc3545;
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

  .pagination button:hover:not(.active) {
    background-color: #f5f5f5;
    color: black;
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
