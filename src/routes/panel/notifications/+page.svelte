<script>
// @ts-nocheck
// Notifications
let requests = $state([
    { id: 1, buyer: 'John Doe', product: 'Vintage Camera', status: 'pending' },
    { id: 2, buyer: 'Jane Smith', product: 'Wireless Headphones', status: 'pending' }
  ]);

    function handleRequest(id, action) {
    if (action === 'accept') {
      // Start chat
      activeChat = requests.find(r => r.id === id).buyer;
      messages.set([{ sender: 'System', text: 'Chat started about the product' }]);
      
      // Update request status
      requests.update(r => r.map(req => 
        req.id === id ? { ...req, status: 'accepted' } : req
      ));
    } else {
      // Decline request
      requests.update(r => r.filter(req => req.id !== id));
    }
  }
</script>
<div class="tab-content">
    <h2>Purchase Requests</h2>
    <div class="requests-list">
      {#each requests as request (request.id)}
        <div class="request-card">
          <p><strong>{request.buyer}</strong> wants to buy <strong>{request.product}</strong></p>
          {#if request.status === 'pending'}
            <div class="request-actions">
              <button onclick={() => handleRequest(request.id, 'accept')}>Accept</button>
              <button onclick={() => handleRequest(request.id, 'decline')} class="decline">Decline</button>
            </div>
          {:else}
            <p class="accepted">Request accepted - chat started</p>
          {/if}
        </div>
      {/each}
    </div>
</div>
<style>
    /* Base Styles */
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      color: #212529;
      min-width: 320px; /* Prevent horizontal scrolling on very narrow screens */
    }
  
    
    
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
    
    .request-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .request-actions {
      display: flex;
      gap: 15px;
      margin-top: 15px;
    }
    
    .request-actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    
    .request-actions button:first-child {
      background-color: #28a745;
      color: white;
    }
    
    .request-actions .decline {
      background-color: #dc3545;
      color: white;
    }
    
    .accepted {
      color: #28a745;
      font-weight: 600;
      margin-top: 10px;
    }
    
    
    
    
    @media (max-width: 768px) {
      
  
      /* Prevent horizontal overflow */
      
      .request-card {
        min-width: 0; /* Allow these to shrink below content width */
        overflow: hidden; /* Prevent content from overflowing */
      }
    }
    
    @media (max-width: 576px) {
      
      
      
      .request-actions {
        flex-direction: column;
      }
      
      
      
      .tab-content {
        padding: 10px;
      }
  
     
  
      /* Ensure buttons don't overflow */
      button {
        white-space: normal;
        word-wrap: break-word;
      }
    }
  
    /* Extra small devices (phones, 400px and down) */
    @media (max-width: 400px) {

  
      /* Adjust button sizes */
      button {
        padding: 8px 12px;
        font-size: 14px;
      }
  
      /* Reduce card padding */
      .request-card {
        padding: 15px;
      }
  
      
    }
  

  </style>