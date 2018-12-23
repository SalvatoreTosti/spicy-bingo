import json
from app import app, sessionManager
from flask import render_template, request

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/board')
def board():
    return render_template('board.html')

@app.route('/sessionTest')
def sessionTest():
    return render_template('sessionTest.html')

@app.route('/sessionList')
def sessionList():
    if not sessionManager.sessionNames:
        return json.dumps("")
    return json.dumps(sessionManager.sessionNames)

@app.route('/sessionStart', methods=['POST'])
def sessionStart():
     form = request.form
     name = form['name-input'].lower()
     sessionManager.createSession(name)
     return json.dumps("success")