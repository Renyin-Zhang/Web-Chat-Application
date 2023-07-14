document.addEventListener('DOMContentLoaded', function () {
    let restful = {
        code: "",
        name: "",
        text: ""
    }
    console.log(1);
    const form = document.getElementById('form');
    const submitButton = form.querySelector('button[type="submit"]');
    console.log(12, form);

    // listen to the submit event of the form
    form.addEventListener('submit', function (event) {
        console.log('Submit button clicked!');
        // prevent the default form submit action
        event.preventDefault();

        // disable the submit button to prevent duplicate submits
        submitButton.disabled = true;
        // change the form data to an object
        const formData = {
            username: form.elements.username.value,
            password: form.elements.password.value,
            remember: document.getElementById('remember').checked
        };
        console.log(123, formData);

        //post function
        postHttp('http://localhost:3403/auth/signin', formData, function (resp) {
            // after getting the response data successfully, update the page content
            restful = JSON.parse(resp);
            if (restful.code === 200) {
                let cookie = restful.text.cookie;
                let expire = restful.text.expire;
                setCookie("3403", cookie, expire);
                alert("successfully signed in!\n Redirect to chat page.");
                window.location.href = `http://localhost:3403/chat?username=${formData.username}`;
            } else {
                // enable the submit button
                submitButton.disabled = false;
                alert(restful.text);
            }
        });

    });
});


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
            console.error("error：", response.status);
        }
    } catch (error) {
        console.error("error：", error);
    }
}

// cookie function
function setCookie(name, value, expires) {
    let expiresString = "";
    if (expires) {
        let date = new Date(expires);
        expiresString = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expiresString + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
