$.socket = new Object()

$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
});

$(document).ready(function(){
    $.socket.on('toggle-response', function(msg) {
        console.log(msg);
    });
});

$(document).ready(function(){
    $.socket.on('username-response', function(msg) {
        console.log(msg);
    });
});


$(function(){
	$('#test-button').click(function() {
        x = Number(window.prompt('x'))
        y = Number(window.prompt('y'))
        
        $.socket.emit('toggle-event',{'room':'test','x':x,'y':y})
        
        // $.socket.emit('join', {'username': username,'room':'test'})
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

