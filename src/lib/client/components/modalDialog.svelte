<script lang="ts">
  import { type Snippet } from "svelte";

  let {
    show = $bindable(), // let's hope I'm not fucking anything up
    header,
    body,
    footer,
  }: {
    show: boolean;
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

  function close(){
    show = false;
  }

  function dialogClickOutside(e: Event) {
    if (e.target === dialogReference) {
      show = false;
    }
  }
</script>

<dialog bind:this={dialogReference} onclick={dialogClickOutside}>
  <div class="modal">
    <header class="modal-header">
      {@render header()}
      <button style:color="darkgray" onclick={close}>&times;</button>
    </header>

    <div class="modal-body">
      {@render body()}
    </div>
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
    visibility: hidden;
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

  /* Modal styles */
  dialog {
    border: none;
    border-radius: 8px;
    padding: 0;
    width: 90%;
    max-width: 500px;
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); */
  }

  .modal {
    padding: 1.5rem;
    padding-top: 1rem;
    background-color: var(--color-bg-component);
    color: var(--color-text-primary);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 1rem;
  }

  .modal-header button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
</style>
