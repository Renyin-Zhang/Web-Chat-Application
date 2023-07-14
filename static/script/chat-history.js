// whether we are on the game or not
let isOnGame = false;
// the true answer of current wordle game
let answer = "";
// max count of guessing in one round
const maxCount = 6;
// the number of guessing in the round of wordle game
let count = 0;
// the number of wordle game has been started
let currentGameRound = 0;

const chatContents = document.getElementById("chat-contents");

// the function send the input or bot reaction to content
const sendToContent = (innerHTML) => {
    chatContents.innerHTML += innerHTML;
};

const initChatHistory = () => {
    chatContents.innerHTML = chatHistory.reduce((pre, cur) => {
        const current =
            cur.type === "ask"
                ? formatFromOther(cur.username[0], cur.content)
                : formatFromUser(cur.username[0], cur.content);
        return pre + current;
    }, "");
};

// get the username of which has been login
const username = "Aminos Co.";

// get the init empty wordle game innerHtml
const formatEmptyWordleGame = () => {
    let emptyWordleGame = "";
    for (let i = 0; i < maxCount; i++) {
        emptyWordleGame += `<div class="wordle-row">
    <div class="wordle-cube"></div>
    <div class="wordle-cube"></div>
    <div class="wordle-cube"></div>
    <div class="wordle-cube"></div>
    <div class="wordle-cube"></div>
    </div>`;
    }
    return emptyWordleGame;
};

// format result to new wordle game line
const formatWordleNewLine = (words) => {
    return words.split("").reduce((pre, cur, curIndex) => {
        let className = "bg-wrong";
        if (cur === answer[curIndex]) {
            className = "bg-correct";
        } else if (answer.includes(cur)) {
            className = "bg-exist";
        }
        return (
            pre +
            `<div class="wordle-cube ${className}">${cur}</div>`
        );
    }, "");
};

// judge the result of typing
const judgeResultWithValue = (value) => {
    const failed = count === maxCount && value !== answer;
    const win = value === answer;
    // if fail or win we need to end this round of game and send the game last status
    if (failed || win) {
        sendToContent(
            formatFromOther(
                "🤖",
                failed
                    ? `<div class='text-red-500'>FAILED and answer is ${answer}</div>`
                    : "<div class='text-red-500'>WIN 🏆</div>"
            )
        );
        sendToContent(
            formatASK(
                "🤖️",
                `Enter "\wordle" if you want to play another round!`
            )
        );
        isOnGame = false;
        count = 0;
        answer = "";
    }
};

// the function use for handle game
const handleGame = (value) => {
    if (value.length !== answer.length) {
        return alert("The answer contains five letters");
    }

    if (!dictionary.includes(value)) {
        return alert("This word is not in the word list");
    }

    // get the result of previous round innerHtml
    const game = document.getElementById(
        `wordle-game-${currentGameRound}-${count}`
    );
    // to format this round game result
    const cloneNode = game.cloneNode(true);
    cloneNode.children[count].innerHTML = formatWordleNewLine(value, answer);
    // this round game have guessed time plus 1
    count += 1;
    sendToContent(
        formatFromOther(
            "🤖",
            `<div id='wordle-game-${currentGameRound}-${count}' class='wordle-game'>${cloneNode.innerHTML}</div>`
        )
    );
    // judge the result of input guess
    judgeResultWithValue(value);
};

// handle the chat with gpt part
const handleGptConversation = async (msg) => {
    const {name, text} = await postData("http://localhost:3403/chatgpt", {
        msg,
    });
    chatContents.innerHTML += formatFromOther(`🤖${name}`, text);
};

// handle the send button click
const send = async () => {
    // get the guess input value
    const input = document.getElementById("send-input");
    chatContents.innerHTML += formatFromUser(
        username[0].toUpperCase(),
        input.value
    );

    // whether to start the game or not
    if (input.value === "/wordle") {
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
    } else if (isOnGame) {
        handleGame(input.value);
    } else {
        await handleGptConversation(input.value);
    }
    chatContents.lastChild.scrollIntoView();
    input.value = "";
};

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json();
}

const initUser = () => {
    const params = new URLSearchParams(window.location.search)
    const username = params.get("username")
    const usernameEl = document.getElementById("username")
    usernameEl.innerHTML = username
}

initUser()