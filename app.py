from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from googletrans import Translator, LANGUAGES

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
client_languages = {}
LANG_KEYS = list(LANGUAGES.keys())
LANG_VALUES = list(LANGUAGES.values())
translator = Translator()

@socketio.on('connect')
def handle_connect():
    client_languages[request.sid] = 'es'

@socketio.on('disconnect')
def handle_disconnect():
    del client_languages[request.sid]

@socketio.on('language')
def handle_language(data):
    client_languages[request.sid] = data['language']

@socketio.on('message')
def handle_message(data):
    print("Got the message")
    message = data['message']
    username = data["username"]
    translations = {}
    for sid, language in client_languages.items():
        if language not in translations:
            # If we haven't translated into this language we translate
            translation = translator.translate(message, dest=language).text
            translations[language] = translation
        # Emit message in the preffered language
        emit('message', {'message': translations[language], "username": username}, room=sid)

@app.route("/")
def sandeshindex():
    return render_template("index.html", lang_dict = LANGUAGES)

@app.route("/chat")
def sandeshchat():
    return render_template("chat.html")

if __name__ == '__main__':
    socketio.run(app, debug = True)