<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  let {
    show, // let's hope I'm not fucking anything up
    closeModal,
    header,
    body,
    footer,
  }: {
    show: boolean;
    closeModal: () => void;
    header: Snippet;
    body: Snippet;
    footer?: Snippet;
  } = $props();

  let dialogReference: HTMLDialogElement;

  function openViewModal() {
    dialogReference.showModal();
    dialogReference.classList.add("openedDialog");
  }

  $effect(() => {
    if (show && !dialogReference.open) {
      openViewModal();
    } else if (!show && dialogReference.open) {
      closeDialog();
    }
  });

  function closeDialog() {
    dialogReference.classList.remove("openedDialog");
    setTimeout(() => {
      dialogReference.close();
    }, 200);
  }

  function dialogClickOutside(e: Event) {
    if (e.target === dialogReference) {
      closeModal();
    }
  }
</script>

<dialog bind:this={dialogReference} onclick={dialogClickOutside}>
  <div class="modal">
    <header class="modal-header">
      {@render header()}
      <button onclick={closeModal}>&times;</button>
    </header>

    <div class="modal-body">
      {@render body()}
    </div>

    <footer class="status-actions">
      {@render footer?.()}
    </footer>
  </div>
</dialog>

<style>
  /* Would've preferred to use dialog::backdrop, however transitions there are not compatible with Firefox */
  /* So ::before is the best option */
  dialog::before {
    content: "";
    visibility: hidden;
    position: fixed;
    z-index: -1; /* This places it behind the dialog content */
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(1px);
    /* pointer-events: all; */
  }

  dialog {
    z-index: 1;
  }

  /* hide default backdrop */
  dialog::backdrop {
    /* display: none; */
    visibility: hidden;
    /* opacity: 0; */
  }

  :root {
    --transition-delay: 0s;
    --transition-duration: 0.2s;
  }

  /* add transitions */
  dialog,
  dialog::before {
    /* display: block; */
    transition: var(--transition-duration) var(--transition-delay) opacity, 
    0.4s 0.2s backdrop-filter ease-out;
    opacity: 0;
  }

  dialog:global(.openedDialog),
  dialog:global(.openedDialog)::before {
    opacity: 1;
    visibility: visible;
  }
  dialog:global(.openedDialog)::before {
    /* display: block; */
    backdrop-filter: blur(4px);
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

  /* .modal-header h2 {
    margin: 0;
  } */

  .modal-header button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  /* This last part just makes anything added to the footer a flex container */
  .status-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }
</style>
