const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get the username and language from the url parameters
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang');
const username = urlParams.get('username');
    
// Connect to server
const socket = io();
// Emit the preffered language to the server
socket.emit('language', { language: lang });


const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


// Message from server
socket.on("message", (data) => {
console.log(data);
outputMessage(data);

// Scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
e.preventDefault();

// Get message text
const msg = e.target.elements.message.value;

// Emit message to server
socket.emit("message", { message: msg, username: username });

// Clear input
e.target.elements.message.value = "";
e.target.elements.message.focus();
});

// Output message to DOM
function outputMessage(data) {
const div = document.createElement("div");
const time = formatAMPM(new Date);
div.classList.add("message");
div.innerHTML = `<p class="meta">${data.username} <span>${time}</span></p>
<p class="text">${data.message}</p><br>`;
chatMessages.appendChild(div);
}