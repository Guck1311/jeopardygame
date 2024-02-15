<script lang="ts">
  import type { Writable } from "svelte/store";
  import Question from "./Question.svelte";
  import type { gameStateSchema, questionSchema } from "./Types";
  import InPlaceEdit from "./InPlaceEdit.svelte";
  import { afterUpdate, onMount } from "svelte";

  export let catMaxHeight: Writable<number>;
  export let game: Writable<gameStateSchema>;
  export let index: number;
  let questions = $game.game[index].questions;
  let catName = $game.game[index].name;
  let status = $game.game[index].status;
  let checkedBox: HTMLInputElement;
  let statusCheckbox = status === "Completed" ? true : false;
  const originalCatName = catName;
  let catDiv: HTMLDivElement;

  $: {
    catName;
    updateCatName(index, catName);
  }
  function updateCatName(catIndex: number, newValue: string) {
    game.update((state) => {
      // Access the specific question
      const catToUpdate = state.game[catIndex];
      // Update the value of the question
      catToUpdate.name = newValue;
      return state;
    });
  }

  $: {
    statusCheckbox;
    updateCatStatus(index);
  }
  function updateCatStatus(catIndex: number) {
    game.update((state) => {
      // Access the specific question
      const catToUpdate = state.game[catIndex];
      // Update the value of the question
      if (checkedBox && checkedBox.checked) {
        catToUpdate.status = "Completed";
      }
      return state;
    });
  }

  $: {
    if (checkedBox) {
      statusCheckbox ? (checkedBox.checked = true) : false;
    }
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === catDiv) {
          const newHeight = entry.contentRect.height;
          if (newHeight > $catMaxHeight) catMaxHeight.set(newHeight);
        }
      }
    });

    if (catDiv) {
      resizeObserver.observe(catDiv);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  $: {
    $catMaxHeight;
    if (catDiv) console.log("Before", $catMaxHeight, catDiv.getBoundingClientRect().height)
    if (catDiv && $catMaxHeight > catDiv.getBoundingClientRect().height) {
      catDiv.style.height = `${$catMaxHeight}px`;
      console.log("After", $catMaxHeight, catDiv.getBoundingClientRect().height)
    }
  }
</script>

<div class="category">
  <div
    bind:this={catDiv}
    style="min-height: {$catMaxHeight}px"
    class="column"
    class:unsaved={$game.game[index].name !== originalCatName}
    class:temp={$game.game[index].status === "Template" &&
      $game.game[index].name === originalCatName}
    class:saved={$game.game[index].status === "Completed" &&
      $game.game[index].name === originalCatName}
  >
    <div class="checkbox-text">
      <span>Name finished</span>
      <input
        type="checkbox"
        bind:this={checkedBox}
        on:click={() => (statusCheckbox = !statusCheckbox)}
      />
    </div>
    <InPlaceEdit bind:value={catName} required={true} />
  </div>
  <div class="question-buttons">
    {#each questions as question, i}
      <Question {game} catIndex={index} qIndex={i} />
    {/each}
  </div>
</div>

<style>
  .category {
    grid-column: span 1;
    margin-bottom: 20px;
    padding: 5px;
    align-items: center;
    text-align: center;
  }

  .question-buttons {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }

  .column {
    font-weight: bold;
    margin-bottom: 5px;
    border: 1px solid blue;
    display: flex;
    flex-direction: column;
  }

  .saved {
    border: 1px solid green;
  }

  .unsaved {
    border: 1px solid red;
  }

  .temp {
    border: 1px solid blue;
  }
</style>
