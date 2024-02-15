<!-- QuestionPage.svelte -->
<script lang="ts">
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import type { questionSchema } from "./Types";

  export let curQuestion: questionSchema | null;
  const questionText = curQuestion?.questionText;
  const solutionText = curQuestion?.answer;
  // Track the state of the solution visibility
  let showSolution: boolean = false;

  // Function to toggle solution visibility
  function toggleSolution() {
    showSolution = !showSolution;
  }

  // Function to go back to the game board
  function goBackToGameBoard() {
    curQuestion = null;
  }
</script>

<div class="question-page">
  <h2>Question:</h2>
  <p>{questionText}</p>
  <button on:click={toggleSolution}>Show Solution</button>
  {#if showSolution}
    <h2>Solution:</h2>
    <p>{solutionText}</p>
  {/if}
  <button on:click={goBackToGameBoard}>Go Back to Game Board</button>
</div>

<style>
  .question-page {
    padding: 2rem;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  }

  h2 {
    margin-bottom: 0.5rem;
    color: #333;
  }

  p {
    margin-bottom: 1rem;
    color: #666;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }
</style>
