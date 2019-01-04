import json
from app import app, sessionManager, socketio
from flask import render_template, request
from flask import session as flask_session
from flask_socketio import emit, send, join_room, leave_room
from app.names import Names

@app.route('/')
@app.route('/index')
def index():
    if not flask_session['username']:
        flask_session['username'] = Names.generateName()
    return render_template('index.html')
    
@socketio.on('username', namespace='/test')
def username_message(message):
    emit('username-response', {'username': flask_session['username']})

@app.route('/boards/<name>', methods=['GET'])
def boards(name):
    if not flask_session['username']:
        flask_session['username'] = Names.generateName()
    session = sessionManager.fetchSession(name)
    if not session:
        session = sessionManager.createSession(
        'test',
        3,
        3,
        [
            'test','test','test',
            'test','testa','test',
            'test','test','test'
        ])
    session.addPlayer(flask_session['username'])
    
    return render_template('board.html', name=name, playerNames=session.players, words=session.generateWordSet())

@app.route('/create', methods=['GET','POST'])
def create():
    if not flask_session['username']:
        flask_session['username'] = Names.generateName()
    if request.method == 'GET':
        return render_template('create.html')    
    form = request.form
    name = form['name']
    words = form['words']
    width = form['width']
    height = form['height']
    session = sessionManager.createSession(name, width, height, words)
    redirect(url_for('boards', name=name))

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
    emit('test',{'message':username + ' has entered the room.'}, room=room)

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
    if not session:
        session = sessionManager.createSession(message['session-name'])
    if session:
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