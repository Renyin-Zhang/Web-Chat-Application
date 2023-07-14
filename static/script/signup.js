document.addEventListener('DOMContentLoaded', function () {
    let restful = {
        code: "",
        name: "",
        text: ""
    }
    console.log(1);
    const form = document.getElementById('form');
    const submitButton = form.querySelector('button[type="submit"]');
    console.log(form);
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
            passwordAgain: form.elements.passwordAgain.value
        };

        // post function
        postHttp('http://localhost:3403/auth/signup', formData, function (resp) {
            // update the page content after getting the response data successfully
            restful = JSON.parse(resp);
            if (restful.code === 200) {
                alert("successfully signed up!\n Redirect to sign in page.");
                window.location.href = "http://localhost:3403/signin";
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
