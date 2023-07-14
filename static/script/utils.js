// the function format the ask content into html
const formatFromOther = (username, content) => {
    return `<div class="chat-from-other-wrapper">
<div class="chat-from-other">
  <div class="chat-user-avatar">
    ${username}
  </div>
  <div class="chat-send from-other">
    <div>${content}</div>
  </div>
</div>
</div>`;
};

// the function format the answer content into html
const formatFromUser = (username, content) => {
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