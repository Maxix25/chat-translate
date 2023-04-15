var socket = io();
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get('lang');
if (lang === null)
{
    document.location.href = "/"
}
const username = urlParams.get('username');


const chat_form = document.getElementById("chat-form")

// Función para agregar un mensaje al contenedor de mensajes
function addMessage(message) {
    const date = new Date();
    const newMessage = $(`
    <div class="chat-message-right pb-4">
        <div>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfm8UnQUb93iMa_J1a9GuKRJ1LWIzTD8dxrA&usqp=CAU" class="rounded-circle mr-1" alt="Chris Wood" width="40" height="40">
            <div class="text-muted small text-nowrap mt-2">${date.getHours()}:${date.getMinutes()}</div>
        </div>
        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div class="font-weight-bold mb-1">${username}</div>
            ${message}
        </div>
    </div>
`)
    $('#conversation').append(newMessage);
}
// Manejador de evento para enviar un mensaje
chat_form.onsubmit = (e) => {
    e.preventDefault();
    const message = $('#chat-input').val();
    $('#chat-input').val('');
    socket.emit('message', {'message': message});
};

socket.emit('language', {language: lang});

// Manejador de evento para recibir un mensaje
socket.on('message', function(data) {
    addMessage(data.message);
});