$.socket = new Object()
$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    $.socket.on('point-response', function(msg) {
        console.log('Received: ' + msg.data)
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
