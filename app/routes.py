from app import app
from flask import render_template

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/board')
def board():
    return render_template('board.html')