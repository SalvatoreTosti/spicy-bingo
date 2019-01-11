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
        goToCreate()
	})
})

$(function(){
	$('#join-button').click(function() {
        if( $('#form').is(":valid") ){
            boardName = $('#name').val()
            $.ajax({
                url: '/activeBoard/' + boardName,
                type: 'GET',
                success: function(response) {
        			response = JSON.parse(response)
                    isActiveBoard = response['active']
                    console.log(isActiveBoard)
                    if (isActiveBoard == 'true'){
                        goToBoard(boardName)
                    } else {
                        $('#help-text').removeClass('invisible')
                        $('#help-text').text('Room is not active.')
                    }
                }
            })
        } else {
            $('#help-text').removeClass('invisible')   
            $('#help-text').text('Please enter a valid room name. (no spaces)')   
        }
	})
})

