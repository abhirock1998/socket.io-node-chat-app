const socket = io("/");
const messageElement = document.getElementById("chat__bodyMessage");
const messageForm = document.getElementById("chat__form");
const messageInput = document.getElementById("chat__bodyInputMessage");
let userName = prompt("What is your name");

function chatInit() {
  if (
    userName !== null &&
    userName !== undefined &&
    userName !== "" &&
    userName.length !== 0
  ) {
    connectOrDisconnect((message = "You join the room"));
    messageInput.focus();
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      createMessage(message, "me");
      socket.emit("chat-message", message, userName);
      messageInput.value = "";
      messageInput.focus();
    });

    socket.on("receive-message", (data) => {
      createMessage(data.message, data.name);
    });
    socket.on("user-disconnect", (name) => {
      connectOrDisconnect((message = `${name} Disconneted`));
    });
    socket.emit("user-connected", userName);
    function createMessage(message, user) {
      const divElement = document.createElement("div");
      divElement.className = "chat__bodyMessageBox";
      divElement.style.alignSelf =
        user == userName || user == "me" ? "flex-end" : "flex-start";
      divElement.style.backgroundColor =
        user == userName || user == "me" ? "#ffd369" : "#EEEEEE";
      divElement.style.borderRadius =
        user == userName || user == "me"
          ? "20px 20px 0px 20px"
          : "0px 20px 20px 20px";
      divElement.innerHTML = user != undefined ? user + ":" + message : message;

      messageElement.append(divElement);
    }
    function connectOrDisconnect(message, user) {
      const divElement = document.createElement("div");
      divElement.className = "chat__bodyMessageBox";
      divElement.style.alignSelf = "center";
      divElement.style.backgroundColor='#ffd369';
      divElement.style.borderRadius='20px';
      divElement.innerHTML = user != undefined ? user + ":" + message : message;

      messageElement.append(divElement);
    }
  } else {
    userName = prompt("What is your name");
  }
}
chatInit();
