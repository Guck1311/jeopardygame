<!-- JeopardyBoard.svelte -->
<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { gameStateSchema, questionSchema } from "./Types";
  import QuestionPage from "./QuestionPage.svelte";

  export let game: Writable<gameStateSchema>;
  export let gameboardGoBack: Writable<HTMLButtonElement>;

  // Define colors for each dollar amount
  const colors: string[] = [
    "#8b0000",
    "#8b4500",
    "#006400",
    "#00008b",
    "#4b0082",
  ];

  // Track the state of the clicked question and solution visibility
  let curQuestion: questionSchema | null = null;

  // Function to handle the click event on a question
  function handleClick(question: questionSchema) {
    curQuestion = question;
  }

  // Hide go back to main menu button if popup is opened
  $: {
    if ($gameboardGoBack) {
      if (!curQuestion) {
        $gameboardGoBack.hidden = false;
      } else $gameboardGoBack.hidden = true;
    }
  }
</script>

<!-- Render the game board or the question and solution -->
{#if curQuestion === null}
  <div class="jeopardy-board">
    <!-- Render category names -->
    <div class="row">
      {#each $game.game as category}
        <div class="category-cell">{category.name}</div>
      {/each}
    </div>

    <!-- Render question values -->
    {#each $game.game[0].questions as question, i}
      <div class="row">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#each $game.game as category, j}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="value-cell"
            style="background-color: {colors[i]}"
            on:click={() => handleClick(question)}
          >
            {(i + 1) * 100}$
          </div>
        {/each}
      </div>
    {/each}
  </div>
{:else}
  <QuestionPage bind:curQuestion />
{/if}

<style>
  .jeopardy-board {
    display: flex;
    flex-direction: column;
    background-color: #333;
    color: white;
    padding: 2rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }

  .row {
    display: flex;
    flex: 1;
  }

  .category-cell,
  .value-cell {
    flex: 1;
    padding: 1rem;
    text-align: center;
    border: 1px solid #666;
    box-sizing: border-box;
    cursor: pointer; /* Add cursor pointer for clickable cells */
  }

  .category-cell {
    background-color: #666;
    font-weight: bold;
  }
</style>
