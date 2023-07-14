// The base URL for the ChatGPT Turbo API
const url = "http://localhost:3403/chatgptturbo";

// Object to store the response from the API
let restful = {
    code: "",
    name: "",
    text: ""
}

// Variable to track the game mode (Situation Puzzle)
let situationP = -1;

// Array to store the messages exchanged between the user and the bot
let messages = [];

// DOM element for the chat contents
const chatContents = document.getElementById("chat-contents");

// Function to send input or bot reaction to the chat content
const sendToContent = (innerHTML) => {
    chatContents.innerHTML += innerHTML;
};

// Function to initialize the chat history
const initChatHistory = () => {
    chatContents.innerHTML = chatHistory.reduce((pre, cur) => {
        const current =
            cur.type === "ask"
                ? formatFromUser(cur.username[0], cur.content)
                : formatFromOther(cur.username[0], cur.content);
        return pre + current;
    }, "");
};

// Event listener when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Display initial message and options for Situation Puzzles
    sendToContent(
        formatFromOther(
            "🐢",
            `<h1 class="text-2xl font-bold tracking-wider text-center my-5 mt-0" 
            style="color: mediumslateblue; margin-bottom: 2px;">Situation Puzzles</h1>
            <h2 class="font-bold my-2" style="color: cornflowerblue;">
            Please choose a situation you liked:</h2>
             <ol style="font-size: 1.1em; font-family: 'Comic Sans MS', cursive;">
               <li>1. Piece of Paper on the Cactus</li>
               <li>2. Time for Bed</li>
               <li>3. Radio</li>
             </ol>`
        )
    );
    // Set the game mode to Situation Puzzle
    situationP = 0;
});

// Function to handle the send button click
const send = async () => {
    // Get the user's input value
    const input = document.getElementById("send-input");
    chatContents.innerHTML += formatFromUser(
        username[0].toUpperCase(),
        input.value
    );

    if (situationP == 0) {
        initSituation(input.value);
    } else {
        loadSituation(input.value);
    }
    chatContents.lastChild.scrollIntoView();
    // Clean the input
    input.value = "";
};

// Function to initialize the Situation Puzzle game
const initSituation = (choice) => {
    situationP = 1;
    if (isNaN(choice) || Number(choice) < 1 || Number(choice) > 3) {
        return alert("Please reply with number 1 to 3.");
    }
    // Load the story based on the user's choice
    let story = situations[Number(choice) - 1].story;
    let answer = situations[Number(choice) - 1].answer;

    // Prepare the initial message for the game
    messages.push({
        role: "system", content: `Here's a situation puzzle, the story is “${story}”, 
    the answer is “${answer}”. I am gonna play this game with you, 
    and I will ask questions about the puzzle, 
    you can only answer with "Yes", "No" or "irrelevant". 
    If what I ask you is not a yes-or-no question, 
    you should refuse to answer that question and tell me I can only 
    ask yes-or-no questions. In the end, I would tell you I am ready 
    to reconstruct the story, and you should tell me whether I am 
    right and give the original story to me.`
    });

    // Tell ChatGPT to start the game
    postHttp(url, messages, (resp) => {
        restful = JSON.parse(resp);
        messages.push({role: restful.name, content: restful.text});
    })

    sendToContent(
        formatFromOther(
            "🐢",
            `<p><span style="color: blueviolet; font-weight: bold">Puzzle ${choice}?</span> Got it!</p>`
        )
    );
    sendToContent(
        formatFromOther(
            "🐢",
            `<h2 class="font-bold my-2">Here's the story:</h2>
             <div style="font-family: 'Courier New', Courier, monospace; 
             font-size: 14px; background-color: #f5f5f5; padding: 10px;">${story}</div>
             <p>Enter <span style="color: hotpink; font-style: italic">Reconstructing the Story</span> when
             you are ready to solve the puzzle.</p>`
        )
    );
}

// Function to handle questions from the player
const loadSituation = (question) => {
    // Convert the question to lowercase
    question = question.toLowerCase();

    if (question === "reconstructing the story") {
        // Tell ChatGPT that the player is ready to solve the puzzle
        messages.push({role: "user", content: `I am ready to reconstruct the story.`});
        postHttp(url, messages, (resp) => {
            restful = JSON.parse(resp);
            messages.push({role: restful.name, content: restful.text});
        })

        // Display a message to prompt the player to reconstruct the story
        sendToContent(
            formatFromOther(
                "🐢",
                `<p><span style="font-weight: bold; color: crimson">Great!</span> 
                Please go ahead and reconstruct the story based on the information provided. 
                Once you're done, let me know, and I'll confirm if your reconstruction is correct.</p>`
            )
        );
        situationP = 2;
        return;
    }

    // Send the player's questions to ChatGPT
    messages.push({role: "user", content: `${question}`});
    postHttp(url, messages, (resp) => {
        restful = JSON.parse(resp);
        messages.push({role: restful.name, content: restful.text});
        sendToContent(
            formatFromOther(
                "🐢",
                `<p>${restful.text}</p>`
            )
        );
    })
    messages.pop();
}

async function postHttp(url, params, callback) {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });

        if (response.status === 200) {
            const responseData = await response.text();
            callback(responseData);
        } else {
            console.error("Request failed, status code:", response.status);
        }
    } catch (error) {
        console.error("Request error:", error);
    }
}

let username = "";

const initUser = () => {
    const params = new URLSearchParams(window.location.search)
    username = params.get("username")
    const usernameEl = document.getElementById("username")
    usernameEl.innerHTML = username
}

// Initialize user
initUser()