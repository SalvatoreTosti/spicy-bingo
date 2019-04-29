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
    
@socketio.on('username', namespace='/bingo')
def username_message(message):
    emit('username-response', {'username': flask_session['username']})

@app.route('/boards/<name>', methods=['GET'])
def boards(name):
    session = sessionManager.fetchSession(name)
    if not session:
        return redirect(url_for('create'))
    if not flask_session.get('username'):
        flask_session['username'] = Names.generateName()
    
    playerName = flask_session['username']
    if not session.players.get(playerName):
        session.setPlayerWords(playerName, session.generateWordSet())

    words = session.getPlayerWords(playerName)
    numbers = session.getToggledNumbers(playerName)
    return render_template('board.html', name=name, playerNames=session.players, size=session.gridSize, words=words, numbers=numbers)

@app.route('/activeBoard/<name>', methods=['GET'])
def activeBoard(name):
    if sessionManager.fetchSession(name):
        return json.dumps({'active' : 'true'})    
    return json.dumps({'active' : 'false'})

@app.route('/name', methods=['GET'])
def name():
    if not flask_session.get('username'):
        flask_session['username'] = Names.generateName()
    return json.dumps({'name': flask_session['username']})

@app.route('/roomName', methods=['GET'])
def roomName():
    return json.dumps({'name': Names.generateRoomName()})

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

@socketio.on('join', namespace='/bingo')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    addPlayer({'session-name' : room, 'player-name': username})

@socketio.on('leave', namespace='/bingo')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

@socketio.on('toggle-event', namespace='/bingo')
def toggle(message):
    room = message['room']
    session = sessionManager.fetchSession(room)
    board = session.players[flask_session['username']]
        
    coordinates = session.coordinateTranslate(message['number'])
    x = coordinates['x']
    y = coordinates['y']
    board.togglePoint(x,y)
    
    if session.bingo(flask_session['username']):
        emit(
            'bingo', 
            {'player': flask_session['username']},
            broadcast = True)
    
    emit('toggle-response', {'data': board.toString()})

@socketio.on('add-player-event', namespace='/bingo')
def addPlayer(message):
    session = sessionManager.fetchSession(message['session-name'])
    if session:
        if not message['player-name'] in session.playerNames:
            session.addPlayer(message['player-name'])
        emit(
        'add-player-response', 
        {
            'player-name': message['player-name']
        },
        broadcast = True)

@socketio.on('reset', namespace='/bingo')
def resetPlayer(message):
    session = sessionManager.fetchSession(message['session-name'])
    if session:
        session.reset(message['player-name'])
        emit(
            'reset-response',
            {
                'player-name': message['player-name']
            },
            broadcast = True)
            
@app.route('/words/<board>/<name>', methods=['GET'])
def words(board, name):
    session = sessionManager.fetchSession(board)
    if session:
        if name in session.playerNames:
            words = session.getPlayerWords(name)
            return json.dumps({'words': words})
    return json.dumps({'words': []})

@socketio.on('connect', namespace='/bingo')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/bingo')
def test_disconnect():
    print('Client disconnected')