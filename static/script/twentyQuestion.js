// history of twenty questions' answers
let history = [];

// get the username of which has been login
const username = "Aminos Co.";

// Get the chat contents element
const chatContents = document.getElementById("chat-contents");

// Function to send the input or bot reaction to the content
const sendToContent = (innerHTML) => {
    chatContents.innerHTML += innerHTML;
};

// Function to ask a question and display it in the chat interface
const askQuestion = (question) => {
    // Send the question to the content
    sendToContent(
        formatFromOther(
            "🤖",
            `<p>${question}</p>`
        )
    );
    // Add the question to the history
    history.push(question);
}

// Function to display the answer in the chat interface
const answerTime = (answer) => {
    // Send the answer to the content
    sendToContent(
        formatFromOther(
            "🤖",
            `<p>${answer}</p>`
        )
    );
}

// Function to handle the answer received from the user
const handleAnswer = (answer) => {
    // Convert the answer to lowercase
    answer = answer.toLowerCase();
    // Check if the answer is not "yes" or "no", show an alert message and return
    if (answer !== "yes" && answer !== "no") {
        return alert("Please reply with 'Yes' or 'No'.");
    }

    // Check the answer and ask the next question or provide the final answer accordingly
    if (answer === "yes") {
        if (history[history.length - 1] === "Is it a mammal?") {
            askQuestion("Does it have stripes?");
        } else if (history[history.length - 1] === "Does it have stripes?") {
            answerTime("It's a zebra🦓!");
        } else if (history[history.length - 1] === "Is it a bird?") {
            askQuestion("Does it fly?");
        } else if (history[history.length - 1] === "Does it fly?") {
            answerTime("It's an eagle🦅!");
        }
    } else if (answer === "no") {
        if (history[history.length - 1] === "Is it a mammal?") {
            askQuestion("Is it a bird?");
        } else if (history[history.length - 1] === "Does it have stripes?") {
            answerTime("It's a lion🦁!");
        } else if (history[history.length - 1] === "Is it a bird?") {
            answerTime("It's a gila monster🦎!");
        } else if (history[history.length - 1] === "Does it fly?") {
            answerTime("It's a penguin🐧!");
        }
    }
}

// Perform actions when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Send the initial chat messages to the content
    sendToContent(
        formatFromOther(
            "🤖",
            `<h1 class="text-2xl font-bold tracking-wider text-center my-5 mt-0" style="color: mediumslateblue;">Twenty Questions</h1>
       <h2 class="font-bold my-2" style="color: cornflowerblue;">Please choose an animal in your mind:</h2>
       <ul style="list-style-type:disc; padding-left: 20px; font-size: 1.1em; font-family: 'Comic Sans MS', cursive;">
         <li>Zebra🦓</li>
         <li>Lion🦁</li>
         <li>Eagle🦅</li>
         <li>Penguin🐧</li>
         <li>Gila Monster🦎</li>
       </ul>
       <br>
       <p class="font-bold" style="color: hotpink;">Ready? Let's go!</p>`
        )
    );
    // Ask the first question
    askQuestion("Is it a mammal?");
});

// Handle the send button click
const send = async () => {
    const input = document.getElementById("send-input");
    // Display the user's input in the chat
    chatContents.innerHTML += formatFromUser(
        username[0].toUpperCase(),
        input.value
    );

    // Handle the user's answer
    handleAnswer(input.value);

    // Scroll to the bottom of the chat log
    chatContents.lastChild.scrollIntoView();
    // Clear the input box
    input.value = "";
};

// Initialize the user
const initUser = () => {
    const params = new URLSearchParams(window.location.search)
    // Get the username from the URL parameters
    const username = params.get("username")
    const usernameEl = document.getElementById("username")
    // Set the username element's content to the username
    usernameEl.innerHTML = username
}

// Call the function to initialize the user
initUser()