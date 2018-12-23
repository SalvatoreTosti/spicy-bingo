from flask import Flask
from app.sessionManager import SessionManager

app = Flask(__name__)

sessionManager = SessionManager()

from app import routes