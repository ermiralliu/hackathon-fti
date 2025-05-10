<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let {
    isOn = $bindable(),
    id,
    labelText,
    ariaLabel,
  }: {
    isOn: boolean;
    id: string;
    labelText: string;
    ariaLabel: string;
  } = $props();

  const localStorageKey = `toggle-switch-${id}-preference`;
  const cookieKey = `preference-${id}`;
  const maxAgeSeconds = 31536000; // 1 year in seconds

  // onMount(() => {
  //   if (!browser || !window.localStorage) return;
  //   const item = localStorage.getItem(localStorageKey);
  //   if (!item) return;
  //   isOn = item == "on" ? true : false;
  // });

  // $effect(() => {
  //   if (!browser || !window.localStorage) return;
  //   console.log(`Saving ${id} preference: ${isOn}`);
  //   localStorage.setItem(localStorageKey, isOn ? "on" : "off");
  // });
  
  $effect(()=>{
    if (browser) {
      console.log(`Saving ${id} preference to cookie: ${isOn}`);
      document.cookie = `${cookieKey}=${isOn ? 'on' : 'off'}; max-age=${maxAgeSeconds}; path=/`;
    }
  });

</script>

<label class="toggle-switch-container" for={id}>
  <input
    type="checkbox"
    {id}
    class="toggle-switch-checkbox"
    aria-label={ariaLabel}
    role="switch"
    bind:checked={isOn}
  />

  <span class="toggle-switch-text">{labelText}</span>

  <span class="toggle-switch-visual"></span>
</label>

<style>
  .toggle-switch-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 15px;
    cursor: pointer;
    color: var(--switch-text);
    transition: color 0.2s ease-in-out;
  }

  .toggle-switch-checkbox {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  }

  :root{
    --toggle-switch-text-color: rgb(66, 66, 66);
    --toggle-switch-color: rgb(214, 98, 98);
    --toggle-switch-color-active: rgb(129, 129, 204);
    --toggle-switch-thumb-color: #fff;
  }

  :global(:root):has(:global(#theme-switch):checked){
    --toggle-switch-text-color: rgb(212, 212, 212);
    --toggle-switch-color:rgb(245, 245, 245);
    --toggle-switch-color-active: black;
    --toggle-switch-thumb-color: #616161;
  }

  .toggle-switch-text {
    font-size: 14.5px;
    color: var(--toggle-switch-text-color);
  }

  .toggle-switch-visual {
    display: block;
    position: relative;
    width: 46px;
    height: 26px;
    background-color: var(--toggle-switch-color);
    border-radius: 26px;
    transition: background-color 0.2s ease-in-out;
    flex-shrink: 0;
    margin-left: auto;
  }

  .toggle-switch-visual::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 22px;
    height: 22px;
    background-color: var(--toggle-switch-thumb-color);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;
  }

  .toggle-switch-checkbox:checked ~ .toggle-switch-visual {
    background-color: var(--toggle-switch-color-active);
  }

  /* Use the general sibling combinator (~) here too */
  .toggle-switch-checkbox:checked ~ .toggle-switch-visual::before {
    transform: translateX(20px);
  }
</style>
