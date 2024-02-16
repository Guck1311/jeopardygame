<script lang="ts">
  import type { Writable } from "svelte/store";
  import Popup from "./Popup.svelte";
  import type { gameStateSchema } from "./Types";

  export let game: Writable<gameStateSchema>;
  export let qIndex: number;
  export let catIndex: number;
  let value = $game.game[catIndex].questions[qIndex].value;
  let questionText = $game.game[catIndex].questions[qIndex].questionText;
  let answer = $game.game[catIndex].questions[qIndex].answer;
  let status = $game.game[catIndex].questions[qIndex].status;
  let checkedBox = status === "Completed" ? true : false;

  let isPopupOpen = false;
  let buttonQuestion: HTMLElement;

  const openPopup = () => {
    isPopupOpen = true;
  };

  const closePopup = () => {
    isPopupOpen = false;
  };

  $: {
    questionText;
    answer;
    checkedBox;
    if (buttonQuestion) {
      if (checkedBox) {
        buttonQuestion.style.background = `green`;
        updateStatusValue(catIndex, qIndex, true);
      } else {
        buttonQuestion.style.background = `${color}`;
      }
    }
  }
  let color = "blue";
  function updateStatusValue(
    catIndex: number,
    qIndex: number,
    newValue: boolean
  ) {
    game.update((state) => {
      // Access the specific question
      const questionToUpdate = state.game[catIndex].questions[qIndex];
      // Update the value of the question
      newValue ? (questionToUpdate.status = "Completed") : "Unfinished";
      return state;
    });
  }

  $: {
    answer;
    updateQuestionAnswerText(catIndex, qIndex, answer);
  }
  function updateQuestionAnswerText(
    catIndex: number,
    qIndex: number,
    newValue: string
  ) {
    game.update((state) => {
      // Access the specific question
      const questionToUpdate = state.game[catIndex].questions[qIndex];
      // Update the value of the question
      questionToUpdate.answer = newValue;
      return state;
    });
  }

  $: {
    questionText;
    updateQuestionQuestionText(catIndex, qIndex, questionText);
  }
  function updateQuestionQuestionText(
    catIndex: number,
    qIndex: number,
    newValue: string
  ) {
    game.update((state) => {
      // Access the specific question
      const questionToUpdate = state.game[catIndex].questions[qIndex];
      // Update the value of the question
      questionToUpdate.questionText = questionText;
      return state;
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={buttonQuestion}
  class:template={status === "Template"}
  on:click={openPopup}>{value}$</div
>
<Popup
  isOpen={isPopupOpen}
  onClose={closePopup}
  bind:questionText
  bind:questionAnswer={answer}
  bind:color
  bind:status={checkedBox}
/>

<style>
  div {
    width: calc(100%); 
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center; 
    justify-content: center;
    height: 100%; 
    border-radius: 10px; 
    padding: 0.5rem;
    margin: -0.5rem;
    background-color: #222;
    transition: background-color 0.3s ease;
  }

  div:hover {
    color: #e7eb1f;
    background-color: #222;
    box-shadow:0px 0px 0px 2px yellow inset;
  }

  div.template {
    background: blue;
  }
</style>


