<script>
  // @ts-nocheck
  // Notifications
  let { data } = $props();
  let requests = $derived(data.products);
</script>

<div class="tab-content">
  <h2>Purchase Requests</h2>
  <div class="requests-list">
    <table>
      <tbody>
        <tr>
          <th><strong>Message:</strong></th>
          <th><strong>Created At:</strong></th>
          <th><strong>Product ID:</strong></th>
          <th><strong>Status:</strong></th>
          <th> <strong>Quantity:</strong></th>
          <th><strong>Finished At:</strong></th>
        </tr>
        {#each requests as item (item.productId)}
          <tr>
            <td> {item.message ? item.message : "N/A"}</td>
            <td>
              <time datetime="{item.createdAt.toISOString()}">
                {item.createdAt.toDateString()}
              </time>
            </td>
            <td> {item.productId}</td>
            <td> {item.status}</td>
            <td>
              {item.quantity ? item.quantity : "N/A"}
            </td>
            <td>
              {#if item.finished}
                <time>
                {item.finished}
                </time>
              {:else}
                "Not Finished"
              {/if}
            </td></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .tab-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Requests */
  .requests-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
</style>
