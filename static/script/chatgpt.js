const chatContents = document.getElementById("chat-contents");

// let chatHistory = getHistory(getUsername(), 1).result;
// console.log(chatHistory);
let restful = {
    code: "",
    name: "",
    text: ""
}

let message = {role: "", content: ""};
let messages = [];

//chatgpt history conversation
let conversation = {pre: "", cur: ""};


// the function send the input or bot reaction to content
const sendToContent = (innerHTML) => {
    chatContents.innerHTML += innerHTML;
};

//init history
const initChatHistory = async () => {
    let chatHistory = await getHistory(getUsername(), 1);
    chatContents.innerHTML = chatHistory.reduce((pre, cur) => {
        const current =
            cur.type === "ask"
                ? formatAsk(cur.username[0], cur.content)
                : formatAnswer('<img src="./static/assets/gpt3.5.png">', cur.content);
        return pre + current;
    }, "");
};
initChatHistory();


async function postHttp(url, params, callback) {
    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        });

        if (response.status === 200) {
            const responseData = await response.text();
            callback(responseData);
        } else {
            console.error("error：", response.status);
        }
    } catch (error) {
        console.error("error：", error);
    }
}


// main function
const send = () => {
    username = new URLSearchParams(window.location.search).get("username");

    // get the input value
    const input = document.getElementById("send-input");
    chatContents.innerHTML += formatAsk(
        username[0].toUpperCase(),
        input.value
    );
    let tempMsg = input.value;
    //clean the input
    input.value = "";

    //store each ask message into messages
    messages.push({role: "user", content: tempMsg});

    //dynamically set appropriate tokens for messages.
    let countMsg = 0, preCountMsg = 0, popTime = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
        countMsg += messages[i].content.length;
        if (countMsg > 1990) {
            popTime = i;
            messages[i].content = messages[i].content.substring(0, 1990 - preCountMsg.length);
            break;
        }
        preCountMsg += messages[i].content.length;
    }
    //if messages index out of range, then pop some messages.
    messages = messages.slice(popTime);


    const url = "http://localhost:3403/chatgptturbo";
    postHttp(url, messages, async (resp) => {

        //restful includes {name:bot name, text:bot answer}
        restful = JSON.parse(resp);
        messages.push({role: restful.name, content: restful.text});
        console.log(1, restful.text);
        //return answer
        chatContents.innerHTML += formatAnswer('<img src="./static/assets/gpt3.5.png">', restful.text);

        setHistoryInOrder(tempMsg, restful.text);

    });

};

// the function format the ask content into html
function processResponseText(text) {
    // use regex to match the code block
    const codeBlockRegex = /```[\s\S]*?```/g;
    const inlineCodeRegex = /`([^`]*)`/g;

    // highlight code blocks
    const highlightedText = text.replace(codeBlockRegex, function (match) {
        // delete the first and last three backticks
        const code = match.slice(3, -3);
        // use highlight.js to highlight the code
        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.innerHTML = code;
        hljs.highlightBlock(codeElement);
        preElement.appendChild(codeElement);
        return preElement.outerHTML;
    });

    // bold single backticks and double backticks
    const boldedText = highlightedText.replace(inlineCodeRegex, function (match, p1) {
        return '<strong>`' + p1 + '`</strong>';
    });

    // wrap the remaining text in <p> tags
    const wrappedText = boldedText
        .split('\n')
        .map((paragraph) => (paragraph.trim() ? '<p >' + paragraph + '</p>' : ''))
        .join('');

    return wrappedText;
}

const initUser = () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const usernameEl = document.getElementById("username");
    usernameEl.innerHTML = username;
}

initUser();

// the function format the ask content into html
const formatAnswer = (username, content) => {
    // create a new div element
    const newDiv = document.createElement('div');

    // give the div a class name
    newDiv.innerHTML = processResponseText(content);
    newDiv.querySelectorAll('div > p').forEach(p => {
        p.classList.add('gpt-answer-margin');
    });
    console.log(2, newDiv.innerHTML);
    return `<div class="chat-from-other-wrapper">
<div class="chat-from-other1">
  <div class="chat-user-avatar ">
    <img src="./static/assets/gpt3.5.png">
  </div>
  <div class="chat-send from-other text-break " style="overflow: auto">
    ${newDiv.innerHTML}
  </div>
</div>
</div>`;
};

// the function format the answer content into html
const formatAsk = (username, content) => {
    return `<div class="chat-from-user-wrapper">
<div class="chat-from-user">
  <div class="chat-user-avatar">
    ${username}
  </div>
  <div class="chat-send from-user">
    <div>${content}</div>
  </div>
</div>
</div>`;
};

//set the history by order
async function setHistoryInOrder(a, b) {
    await setHistory(getUsername(), 1, 1, a);
    await setHistory(getUsername(), 1, 2, b);
}



