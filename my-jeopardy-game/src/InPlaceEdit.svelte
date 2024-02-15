<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let value: string;
  export let required = true;

  const dispatch = createEventDispatcher();
  let editing = false,
    original;

  onMount(() => {
    original = value;
  });

  function edit() {
    editing = true;
  }

  function submit() {
    if (value != original) {
      dispatch("submit", value);
    }

    editing = false;
  }

  function keydown(event) {
    if (event.key == "Escape") {
      event.preventDefault();
      value = original;
      editing = false;
    }
  }

  function focus(element) {
    element.focus();
  }
</script>

{#if editing}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <form on:submit|preventDefault={submit} on:keydown={keydown}>
    <input bind:value on:blur={submit} {required} use:focus />
  </form>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="parent-div" on:click={edit}>
    <span class="content">{value}</span>
    <div class="edit-symbol">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
      >
        <path
          fill="currentColor"
          d="M3 17v4h4L17 9l-4-4L3 17zm18.3-9.2c.4-.4.4-1 0-1.4l-2.3-2.3c-.4-.4-1-.4-1.4 0l-1.8 1.8 4 4 1.8-1.8z"
        />
      </svg>
    </div>
  </div>
{/if}

<style>
  input {
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
  }

  .parent-div {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    align-items: center;
    height: 100%;
    margin: 0px 5px;
  }

  .content {
    flex: 1;
    word-wrap: break-word;
    max-width: 130px; /* TODO proper value */
  }

  .edit-symbol {
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
  }
</style>
