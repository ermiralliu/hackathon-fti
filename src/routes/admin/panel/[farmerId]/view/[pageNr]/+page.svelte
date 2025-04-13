<script>
  // @ts-ignore
  let { data } = $props();
</script>
{#if data.totalCount === 0}
<h3>Farmer has no data</h3>
{/if}

<div class="tab-content">
  <h2>Purchase Requests</h2>
  <div class="requests-list">
    <table>
      <tbody>
        <tr>
          <th><strong>Name:</strong></th>
          <th><strong>Description:</strong></th>
          <th><strong>Price:</strong></th>
          <th><strong>CreatedAt:</strong></th>
          <th><strong>Availability:</strong></th>
          <th><strong>Type:</strong></th>
        </tr>
        {#each data.products as item (item.id)}
          <tr>
            <td> {item.name}</td>
            <td> {item.description}</td>
            <td> {item.price}</td>
            <td>
              {new Date(item.createdAt).toLocaleString()}
            </td>
            <td> {item.availability}</td>
            <td> {item.type} </td>
          </tr>
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
