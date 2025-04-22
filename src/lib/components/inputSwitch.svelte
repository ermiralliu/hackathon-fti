<script lang="ts">
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

  .toggle-switch-text {
    font-size: 14.5px;
  }

  .toggle-switch-visual {
    display: block;
    position: relative;
    width: 46px;
    height: 26px;
    background-color: #ccc;
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
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease-in-out;
  }

  .toggle-switch-checkbox:checked ~ .toggle-switch-visual {
    background-color: var(--color-accent);
  }

  /* Use the general sibling combinator (~) here too */
  .toggle-switch-checkbox:checked ~ .toggle-switch-visual::before {
    transform: translateX(20px);
  }
</style>
