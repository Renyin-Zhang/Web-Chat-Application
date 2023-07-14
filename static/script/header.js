const gotoHistory = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/history"
    );
};

const gotoProfile = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/profile"
    );
};

const gotoChat = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/chat"
    );
};

const goBack = () => {
    history.back();
};

const gotochatgpt = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/chatgpt"
    );
};

const gotoWordle = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/wordle"
    );
};

const goto20question = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/twentyquestion"
    );
};

const gotoSituationP = () => {
    window.location.href = window.location.href.replace(
        window.location.pathname,
        "/situationpuzzle"
    );
};

const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
        document.cookie = "3403=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = window.location.href.replace(
            window.location.pathname,
            "/signin"
        );
    }
};