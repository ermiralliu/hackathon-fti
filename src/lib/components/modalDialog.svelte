<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    show, // let's hope I'm not fucking anything up
    header,
    body,
    footer,
  }: { show: boolean; header: Snippet; body: Snippet; footer: Snippet } =
    $props();

  let dialogReference: HTMLDialogElement;

  function openViewModal() {
    dialogReference.showModal();
    dialogReference.classList.add("openedDialog");
  }

  $effect(() => {
    if (show && !dialogReference.open) {
      openViewModal();
    } else if (!show && dialogReference.open) {
      closeModal();
    }
  });

  function closeModal() {
    dialogReference.classList.remove("openedDialog");
    setTimeout(() => {
      dialogReference.close();
    }, 300);
  }

  function dialogClickOutside(e: Event) {
    if (e.target === dialogReference) {
      // closeModal(); // For some reason you should click the part associated with dialog reference
      show = false;
    }
  }
</script>

<dialog bind:this={dialogReference} onclick={dialogClickOutside}>
  {#if show}
    <div class="modal">
      <header class="modal-header">
        {@render header()}
        <button onclick={closeModal}>&times;</button>
      </header>
      <div class="modal-body">
        {@render body()}
      </div>
      <footer class="status-actions">
        {@render footer()}
      </footer>
    </div>
  {/if}
</dialog>
