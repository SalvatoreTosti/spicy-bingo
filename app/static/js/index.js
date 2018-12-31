$.socket = new Object()

$(document).ready(function(){
    console.log('zed')
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    console.log($.socket)
    $.socket.on('my response', function(msg) {
        console.log('Received: ' + msg.data)
    });
});

$(function(){
	$('#test-button').click(function() {
        playerName = window.prompt('player name')
        $.socket.emit(
            'add-player-event',
             {
                 'session-name': 'test',
                 'player-name': playerName
             })
        console.log('done')
        return false;
    })
})

$(function(){
	$('#start-button').click(function() {
        console.log('start')
        $.socket.emit('my event', {data: '123'})
        return false;
	})
})

$(function(){
	$('#join-button').click(function() {
        console.log('join')
        goToBoard()
	})
})

