document.addEventListener("DOMContentLoaded", function () {
    currentGameRound += 1;
    sendToContent(
        formatFromOther(
            "🤖",
            `<h1 class="wordle-game-title">WORDLE</h1>
    <div id='wordle-game-${currentGameRound}-${count}' class='wordle-game'>
      ${formatEmptyWordleGame()}
      </div>`
        )
    );
    // set the game basic info and status
    isOnGame = true;
    answer = dictionary[Math.floor(Math.random() * dictionary.length)];
});