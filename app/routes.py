import json
from app import app, sessionManager, socketio
from flask import render_template, request, redirect, url_for
from flask import session as flask_session
from flask_socketio import emit, send, join_room, leave_room
from app.names import Names

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')
    
@socketio.on('username', namespace='/test')
def username_message(message):
    emit('username-response', {'username': flask_session['username']})

@app.route('/boards/<name>', methods=['GET'])
def boards(name):
    session = sessionManager.fetchSession(name)
    if not session:
        return redirect(url_for('create'))
    if not flask_session.get('username'):
        flask_session['username'] = Names.generateName()
    return render_template('board.html', name=name, playerNames=session.players, words=session.generateWordSet())

@app.route('/name', methods=['GET'])
def name():
    if not flask_session.get('username'):
        flask_session['username'] = Names.generateName()
    return json.dumps({'name': flask_session['username']})

@app.route('/players/<name>', methods=['GET'])
def players(name):
    session = sessionManager.fetchSession(name)
    if not session:
        return []
    return json.dumps({'players' : session.playerNames})

@app.route('/create', methods=['GET','POST'])
def create():
    if request.method == 'GET':
        return render_template('create.html')    
    form = request.form
    name = form['name']
    sizeWord = form['size']
    size = 0
    if sizeWord == 'three':
        size = 3
    elif sizeWord == 'five':
        size = 5
    
    mode = form['mode']
    words = form['words'].split(",")
    session = sessionManager.createSession(name, mode, size, size, words)
    return json.dumps({'name':name})

@app.route('/sessionStart', methods=['POST'])
def sessionStart():
     form = request.form
     name = form['name-input'].lower()
     sessionManager.createSession(name)
     return json.dumps("success")

@socketio.on('join', namespace='/test')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    addPlayer({'session-name' : room, 'player-name': username})

@socketio.on('leave', namespace='/test')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

@socketio.on('toggle-event', namespace='/test')
def toggle(message):
    room = message['room']
    session = sessionManager.fetchSession(room)
    board = session.players[flask_session['username']]
    
    x = message['x']
    y = message['y']
    board.togglePoint(x,y)
    
    emit('toggle-response', {'data': board.toString()})

@socketio.on('add-player-event', namespace='/test')
def addPlayer(message):
    session = sessionManager.fetchSession(message['session-name'])
    if session:
        if message['player-name'] in session.playerNames:
            return
        session.addPlayer(message['player-name'])
        emit(
        'add-player-response', 
        {
            'player-name': message['player-name']
        },
        broadcast=True)

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')