from flask import Flask
from config import Config
from app.sessionManager import SessionManager

app = Flask(__name__)
app.config.from_object(Config)

sessionManager = SessionManager()

from app import routes