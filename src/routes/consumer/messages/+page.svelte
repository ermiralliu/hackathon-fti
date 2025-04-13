<script>
// @ts-nocheck

     // Messages
  let activeChat = null;
  let messages = $state([]);
  // svelte-ignore non_reactive_update
    let newMessage = '';

  // Send message
  function sendMessage() {
    if (newMessage.trim()) {
      messages.update(m => [...m, { sender: 'You', text: newMessage }]);
      newMessage = '';
    }
  }
</script>
<div class="tab-content">
    <h2>Messages</h2>
    {#if activeChat}
      <div class="chat-container">
        <div class="chat-header">
          <h3>Chat with {activeChat}</h3>
        </div>
        <div class="messages">
          {#each $messages as message}
            <div class="message {message.sender === 'You' ? 'sent' : 'received'}">
              <strong>{message.sender}:</strong> {message.text}
            </div>
          {/each}
        </div>
        <div class="message-input">
          <input 
            type="text" 
            bind:value={newMessage} 
            placeholder="Type your message..."
            onkeydown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onclick={sendMessage}>Send</button>
        </div>
      </div>
    {:else}
      <p>No active chats. Accept a purchase request to start chatting.</p>
    {/if}
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
    
    
    /* Chat */
    .chat-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      height: calc(100vh - 200px);
      display: flex;
      flex-direction: column;
    }
    
    .chat-header {
      padding: 20px;
      background-color: #007bff;
      color: white;
    }
    
    .messages {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
      background-color: #f8f9fa;
    }
    
    .message {
      margin-bottom: 15px;
      padding: 12px 16px;
      border-radius: 18px;
      max-width: 80%;
      line-height: 1.4;
    }
    
    .message.sent {
      background-color: #007bff;
      color: white;
      margin-left: auto;
    }
    
    .message.received {
      background-color: #e9ecef;
      margin-right: auto;
    }
    
    .message-input {
      display: flex;
      padding: 15px;
      border-top: 1px solid #dee2e6;
      background-color: white;
    }
    
    .message-input input {
      flex: 1;
      padding: 12px 15px;
      border: 1px solid #ced4da;
      border-radius: 24px;
      margin-right: 10px;
      font-size: 16px;
    }
    
    .message-input button {
      padding: 12px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s;
    }
    
    .message-input button:hover {
      background-color: #0069d9;
    }
    
    
    
    @media (max-width: 576px) {
      
      .message {
        max-width: 90%;
      }
      
      .tab-content {
        padding: 10px;
      }
  
      /* Better handling for very narrow screens */
      .message-input input {
        width: calc(100% - 30px); /* Account for padding */
      }
  
      /* Ensure buttons don't overflow */
      button {
        white-space: normal;
        word-wrap: break-word;
      }
    }
  
    /* Extra small devices (phones, 400px and down) */
    @media (max-width: 400px) {
      
  
      .message-input input {
        padding: 8px 10px;
        font-size: 14px;
      }
  
      /* Adjust button sizes */
      button {
        padding: 8px 12px;
        font-size: 14px;
      }
  
    }
  
    
  </style>