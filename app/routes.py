import json
from app import app, sessionManager,socketio
from flask import render_template, request
from flask_socketio import emit, join_room, leave_room

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/board')
def board():
    return render_template('board.html')

@app.route('/boards/<name>', methods=['GET'])
def boards(name):
    session = sessionManager.fetchSession(name)
    if not session:
        sessionManager.createSession(name)
    return render_template('board.html', name=name, playerNames=session.players)

@app.route('/players/<name>', methods=['GET'])
def players(name):
    session = sessionManager.fetchSession(name)
    if session:
        return json.dumps({'players': session.players})
    return json.dumps({'players': []})

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

@socketio.on('point-event', namespace='/test')
def test_message(message):
    emit('point-response', {'data': message['data']})

@socketio.on('add-player-event', namespace='/test')
def addPlayer(message):
    session = sessionManager.fetchSession(message['session-name'])
    if not session:
        session = sessionManager.createSession(message['session-name'])
    if session:
        session.addPlayer(message['player-name'])
        emit(
        'add-player-response', 
        {
            'session-name': message['session-name'],
            'player-name': message['player-name']
        })
    
     
@socketio.on('my event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']})

@socketio.on('my broadcast event', namespace='/test')
def test_message(message):
    emit('my response', {'data': message['data']}, broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')