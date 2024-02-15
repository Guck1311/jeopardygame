<!-- GameState.svelte -->

<script lang="ts">
  import Category from "./Category.svelte";
  import NewCategory from "./NewCategory.svelte";
  import GameBoard from "./GameBoard.svelte";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import type { gameStateSchema } from "./Types";

  let gameId: string = "";
  let gameState: any = null;
  let errorMessage: string | null = null;
  let activeEditGame = false;
  const PORT = process.env.PORT || 5173;

  let gameboardGoBack: Writable<HTMLButtonElement> = writable();

  let catMaxHeight: Writable<number> = writable(0);

  let hostGame: boolean = false;

  let game: Writable<gameStateSchema> = writable();

  const resetGameState = () => {
    activeEditGame = false;
  };

  const createGame = async () => {
    try {
      const response = await fetch(
        `${window.location.origin}/api/create-game/${gameId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Add body data if required
        }
      );

      if (!response.ok) {
        throw new Error("Unable to create game");
      }

      const data = await response.json();
      game = writable(data); // Set gameState to the response data
      activeEditGame = true;
      errorMessage = null;
      catMaxHeight.set(0);
    } catch (error: any) {
      errorMessage = "Game already exists";
    }
  };

  const retrieveGame = async (editOrHost: boolean) => {
    try {
      const response = await fetch(
        `${window.location.origin}/api/game-state/${gameId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to retrieve game");
      }

      const data = await response.json();
      game.set(data); // Set gameState to the response data
      editOrHost ? (activeEditGame = true) : (hostGame = true);
      errorMessage = null;
      if (!activeEditGame && hostGame && !$game.status) {
        errorMessage =
          "Unfortunately, this game has not been completed to properly setup correctly!";
        hostGame = false;
      }
      catMaxHeight.set(0);
    } catch (error: any) {
      console.error(error);
      errorMessage = "Failed to retrieve game";
    }
  };

  const updateGame = async (gameId: string, updatedState: gameStateSchema) => {
    try {
      const response = await fetch(
        `${window.location.origin}/api/update-game/${gameId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedState), // Send updated game state to the server
        }
      );

      if (!response.ok) {
        throw new Error("Unable to update game");
      }

      errorMessage = null;
    } catch (error) {
      console.error(error);
      errorMessage = "Failed to update game state";
    }
  };

  const hasInput = (input: string, method: () => {}) => {
    if (input.length > 0) {
      method();
      errorMessage = null;
      return true;
    } else {
      errorMessage = "Please insert a gameID";
      return false;
    }
  };
</script>

{#if !activeEditGame && !hostGame}
  <h1>Start your Jeopardy journey now!</h1>

  <label>
    Enter Game ID:
    <input type="text" bind:value={gameId} />
  </label>

  <button on:click={() => hasInput(gameId, createGame)}>Create Game</button>
  <button on:click={() => hasInput(gameId, () => retrieveGame(true))}
    >Edit Game</button
  >
  <button on:click={() => hasInput(gameId, () => retrieveGame(false))}
    >Host Game</button
  >

  {#if errorMessage}
    <p>Error: {errorMessage}</p>
  {/if}
{:else if activeEditGame && !hostGame}
  <h2>Jeopardy Game: {gameId}</h2>

  <!-- <div class="grid">
    {#each $game.game as categories, i}
      <Category {game} index={i} {catMaxHeight}/>
    {/each}
  </div> -->
  <NewCategory {game} {catMaxHeight} />
  <button on:click={() => updateGame(gameId, $game)}>Save</button>
  <button
    class:ready={$game.status}
    class:unready={!$game.status}
    on:click={() => {
      if (!$game.status) {
        let finished = true;
        for (const categories of $game.game) {
          for (const question of categories.questions) {
            if (question.status !== "Completed") {
              finished = false;
            }
          }
        }
        if (finished) {
          game.update((state) => {
            state.status = true;
            return state;
          });
        } else {
          alert("Not all questions are marked as completed") // TODO make better
        }
      } else {
        game.update((state) => {
            state.status = false;
            return state;
          });
      }
    }}>{$game.status ? "Ready to host" : "Mark as ready to host"}</button
  >
  <button on:click={resetGameState}>Go Back</button>
{:else if !activeEditGame && hostGame}
  <GameBoard {game} {gameboardGoBack}/>
  <button bind:this={$gameboardGoBack} on:click={() => hostGame = false}>Go Back</button>
{:else}
  <p>Something must have went horribly wrong lol</p>
{/if}

<style>
  /* Adjust grid layout styles */
  .grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: auto;
    gap: 10px;
  }

  .ready {
    border: 1px solid green;
  }

  .unready {
    border: 1px solid red;
  }
</style>
