$.socket = new Object()
$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    $.socket.on('add-player-response', function(msg) {
        console.log('in here!')
        $('#player-list')
        .append(msg['player-name'])
        .addClass('tiny-box small-margin-vertical mid-bg')
        // playerName = msg['player-name']
        
        // console.log('Received: ' + msg.data)
    })
})

$(function(){
	$('.card').click(function() {
        if($(this).hasClass('dark-bg')){
            $(this).addClass('mid-bg')
            $(this).removeClass('dark-bg')
            $(this).addClass('active')
            console.log(this)
            console.log($.socket.emit('point-event', {data: this}))
             
        } else {
            $(this).addClass('dark-bg')
            $(this).removeClass('mid-bg')
            $(this).removeClass('active')
        }
	})
})
