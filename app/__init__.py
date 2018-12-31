from flask import Flask
from config import Config
from flask_socketio import SocketIO
from app.sessionManager import SessionManager

app = Flask(__name__)
app.config.from_object(Config)

socketio = SocketIO(app)
sessionManager = SessionManager()

from app import routes