// mocked history chat
const histories = [
    {
        title: "ChatGPT",
        description: "Have a chat with gpt",
        icon: '<img src="./static/assets/gpt3.5.png" height="30px" width="30px">',
        pathname: "/chatgpt"
    },
    {
        title: "Eliza",
        description: "Have a chat with eliza",
        icon: "🤖",
        pathname: "/chat"
    },
    {
        title: "Wordle",
        description: "Play a wordle game",
        icon: "🎮",
        pathname: "/wordle"

    },
    {
        title: "20 Questions",
        description: "Ask 20 questions",
        icon: "❓",
        pathname: "/twentyquestion"
    },
    {
        title: "Situation Puzzle",
        description: "Situation Puzzle",
        icon: "🐢",
        pathname: "/situationpuzzle"
    },
];

const historyList = document.getElementById("chat-history-list");

// append the history chat into list
histories.forEach((history) => {
    const item = document.createElement("div");
    const sanitizedTitle = sanitizeTitle(history.title);
    item.className = "chat-history-item bg-white" + " " + sanitizedTitle;
    item.onclick = () => {
        window.location.href = window.location.href.replace(window.location.pathname, history.pathname)
    };
    item.innerHTML = `<div class="chat-history-item-title">${history.title}</div>
  <div class="chat-history-item-info">
    <div class="chat-history-item-description">${history.description} conversations</div>
    <div class="chat-history-item-icon">${history.icon}</div>
  </div>`;
    historyList.appendChild(item);
});

function search() {
    const inputVal = document.getElementById("send-input").value;
    if (inputVal != "") {
        histories.forEach(history => {
            const sanitizedTitle = '.' + sanitizeTitle(history.title);
            const item = document.querySelector(sanitizedTitle);
            const newUrl = createNewUrl(window.location.href, history, inputVal);
            item.onclick = () => {
                window.location.href = newUrl;
            }
        });
    }
}

function clean() {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.delete('input');  // delete the 'input' parameter
    url.search = params.toString();
    window.history.pushState({}, '', url.toString());
}


function createNewUrl(url, history, inputValue) {
    let urlObj = new URL(url);
    let urlParams = urlObj.searchParams;

    // Check if the 'input' parameter already exists
    if (urlParams.has('input')) {
        // If it exists, update the value
        urlParams.set('input', inputValue);
    } else {
        // If not, add the 'input' parameter
        urlParams.append('input', inputValue);
    }

    // Update the pathname and return the new URL
    urlObj.pathname = history.pathname;
    return urlObj.toString();
}


function sanitizeTitle(title) {
    return title.replace(/\s+/g, '').replace(/\d+/g, '');
}
