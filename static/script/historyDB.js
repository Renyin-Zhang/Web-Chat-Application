// 规则如下：
// 通用的入参:
// username: 用户的登录username
// type: 问题类型, chatgpt=1, eliza=2, 20问=3, 海龟汤=4, wordle=5
// role: 问题的提出者, 用户=1, 机器人=2
// content: 问题的内容,可以带换行符之类的


function getUsername() {
    const params = new URLSearchParams(window.location.search);
    return params.get("username");
}

function getInput() {
    const params = new URLSearchParams(window.location.search);
    return params.get("input") ? params.get("input") : "";
}


//获取单个chat的历史记录
async function getHistory(username, type) {
    let history = [];
    let input = getInput();
    let params = {username: username, input: input, type: type};
    const url = "http://localhost:3403/history/get";
    let res = await postHttpPromise(url, params);
    restful = JSON.parse(res);
    history = restful.text;
    return history;
}


//存储历史记录
function setHistory(username, type, role, content) {
    return new Promise((resolve, reject) => {
        let params = {username: username, type: type, role: role, content: content};
        let msg = "success";
        const url = "http://localhost:3403/history/set";
        postHttp(url, params, (res) => {
            restful = JSON.parse(res);
            resolve(msg);  // Resolve the promise when the request is finished
        });
    });
}



function postHttpPromise(url, params) {
    return new Promise((resolve, reject) => {
        postHttp(url, params, (res) => {
            resolve(res);
        });
    });
}
