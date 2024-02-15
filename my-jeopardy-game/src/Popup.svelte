<script lang="ts">
  export let isOpen: boolean;
  export let onClose: () => void;
  export let questionText: string;
  export let questionAnswer: string;
  export let color: string;
  export let status: boolean;

  let checkedBox: HTMLInputElement;

  const questionTextBuffer = questionText;
  const questionAnswerBuffer = questionAnswer;
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  });

  $: {
    if (checkedBox) {
      status ? (checkedBox.checked = true) : false;
    }
    color = questionText !== questionTextBuffer || questionAnswer !== questionAnswerBuffer ? "red" : "blue";
  }
</script>

{#if isOpen}
  <div class="popup">
    <div class="popup-content">
      <button class="close-btn" on:click={onClose}>
        <span class="close-icon">×</span>
      </button>
      <div class="textarea">
        <label for="question-input">Question:</label>
        <textarea
          id="question-input"
          bind:value={questionText}
          disabled={status}
        ></textarea>
      </div>
      <div class="textarea">
        <label for="answer-input">Answer:</label>
        <textarea
          id="answer-input"
          bind:value={questionAnswer}
          disabled={status}
        ></textarea>
      </div>
      <div class="checkbox">
        <label>
          <input
            type="checkbox"
            bind:this={checkedBox}
            on:change={() => (status = !status)}
          />
          Question completed
        </label>
      </div>
    </div>
  </div>
{/if}

<style>
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .popup-content {
    position: relative; /* Set the position of the popup content to relative */
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 50%;
    max-width: 600px;
    border: 3px solid lightgray;
  }

  .close-btn {
    position: absolute; /* Position the close button absolutely */
    top: 0px;
    right: 0px;
    background: none;
    border: none;
    cursor: pointer;
  }
  .close-icon {
    font-size: 1.5em;
    color: #fff;
  }

  .textarea {
    margin-bottom: 10px;
  }

  .textarea label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .textarea textarea {
    width: calc(100% - 16px); /* Adjust width to account for padding */
    padding: 8px; /* Adjust padding */
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    background-color: #444;
    color: #fff;
  }

  .checkbox input[type="checkbox"] {
    margin-right: 5px;
    cursor: pointer;
  }
</style>
