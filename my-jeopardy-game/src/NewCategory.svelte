<script lang="ts">
  import type { Writable } from "svelte/store";
  import Question from "./Question.svelte";
  import type { gameStateSchema, questionSchema } from "./Types";
  import InPlaceEdit from "./InPlaceEdit.svelte";
  import { afterUpdate, onMount } from "svelte";

  export let catMaxHeight: Writable<number>;
  export let game: Writable<gameStateSchema>;

  const colors: string[] = [
    "#8b0000",
    "#8b4500",
    "#006400",
    "#00008b",
    "#4b0082",
  ];

  const names: string[] = [];

  $game.game.forEach((gameItem) => {
    names.push(gameItem.name);
  });

  $: {
    names;
    game.update((state) => {
      for (let i = 0; i < names.length; i++) {
        const catToUpdate = state.game[i];
        catToUpdate.name = names[i];
      }
      return state;
    });
  }

  const checkboxList: (HTMLInputElement | null)[] = Array.from(
    { length: names.length },
    (_, index) => null
  );

  function updateCatStatus() {
    game.update((state) => {
      for (let i = 0; i < checkboxList.length; i++) {
        const catToUpdate = state.game[i];
        if (checkboxList[i]) {
          if (checkboxList[i]?.checked) {
            catToUpdate.status = "Completed";
          } else {
            catToUpdate.status = "Template";
          }
        }
      }
      return state;
    });
  }

  console.log($game);
</script>

<!-- Add a variable for the number of categories -->
<div class="jeopardy-board" style="--num-categories: {$game.game.length}">
  <!-- Render category names -->
  <div class="row">
    {#each $game.game as category, i}
      <div class="category-cell" class:hoverEffect={category.status !== 'Completed'}>
        <div>
          <span
            style="color: {category.status === 'Completed' ? 'green' : 'red'}"
            >Completed</span
          >
          <input
            type="checkbox"
            checked={category.status === "Completed" ? true : false}
            bind:this={checkboxList[i]}
            on:click={updateCatStatus}
          />
        </div>
        <InPlaceEdit
          disableCat={$game.game[i].status === "Completed" ? true : false}
          bind:value={names[i]}
          required={true}
        />
      </div>
    {/each}
  </div>

  <!-- Render question values -->
  {#each $game.game[0].questions as question, i}
    <div class="row">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      {#each $game.game as category, j}
        <div class="value-cell">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <Question {game} catIndex={j} qIndex={i} />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .jeopardy-board {
    display: flex;
    flex-direction: column;
    background-color: #000;
    color: white;
    padding: 1rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    border-radius: 15px;
    border: 2px solid #333;
  }

  .row {
    display: flex;
    flex: 1;
    justify-content: space-evenly;
  }

  .category-cell {
    background-color: #111;
    font-weight: bold;
    flex: 1;
    text-align: center;
    border: 1px solid #333;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    margin: 5px;
    padding: 0.5rem;
  }

  .value-cell {
    flex: 1;
    text-align: center;
    border: 1px solid #333;
    box-sizing: border-box;
    cursor: pointer;
    border-radius: 10px;
    margin: 5px;
    padding: 0.5rem;
    background-color: #222;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .value-cell:hover {
    background-color: #333;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid #888;
    background-color: #333;
    outline: none;
    cursor: pointer;
  }

  .hoverEffect:hover {
    color: #e7eb1f;
    background-color: #222;
    box-shadow: 0px 0px 0px 2px yellow inset;
  }

</style>
