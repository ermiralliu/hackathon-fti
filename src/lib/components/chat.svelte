<script lang="ts">
    import { enhance } from "$app/forms";

  const messages = $state< {user: string, message: string}[] >([
    {
      user : "User A",
      message : "Hello!"
    },
    {
      user : "You",
      message : "Hi there!"
    },
    {
      user : "User A",
      message: "How's it going?"
    },
    {
      user : "You",
      message : "Pretty good!"
    },
  ]);

  let toBeSent = $state('');
  let disabledButton = $derived(toBeSent.trim() ? false : true);

</script>

<div class="chat-widget">
  <div class="chat-header">Simple Chat</div>
  <div class="chat-body">
    <ul>
      {#each messages as msg}
        <li class={msg.user === 'You' ? 'you': 'other'}>
          <span style:font-weight="bold">{msg.user}:</span>
          <span class="message-content">{msg.message}</span>
        </li>
      {/each}
    </ul>
  </div>
  <form class="chat-input" use:enhance>
    <input type="text" name="message" bind:value={toBeSent} placeholder="Type a message..." required/>
    <button
      disabled={disabledButton}
    >Send</button>
  </form>
</div>

<style>
  .chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    max-height: 400px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #777777;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  .chat-header {
  padding: 10px;
  background-color: #7a7a7a;
  border-bottom: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  text-align: center;
}

.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.chat-body ul {
  list-style: none; /* Remove default list styling */
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column; /* Ensure messages stack vertically */
}

.chat-body li {
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  background-color: #e0f7fa; /* Default message background */
  word-break: break-word;
  align-self: flex-start; /* Align messages to the left by default */
}

.chat-body li .message-content {
  color: #333;
}

.chat-input {
  padding: 10px;
  border-top: 1px solid #ccc;
  display: flex;
}

.chat-input input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.chat-input button {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 0 4px 4px 0;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  opacity: 0.6; /* Indicate it's disabled */
}

.chat-input button:hover {
  background-color: #45a049;
  opacity: 0.6; /* Maintain disabled visual */
}
.chat-input button:disabled{
  cursor: auto;
}

li {
  color: black;
}

li.you {
  background-color: #dcedc8; /* Background for own messages */
  align-self: flex-end; /* Align to the right for own messages */
}

li.other {
  margin-right: 5px;
  color: #555;
}

.chat-input input:disabled,
.chat-input button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
