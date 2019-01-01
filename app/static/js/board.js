$.socket = new Object()
$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    $.socket.on('add-player-response', function(msg) {
        $('#player-list')
        .append(msg['player-name'])
        .addClass('tiny-box small-margin-vertical mid-bg')
    })
})

$(document).ready(function(){
    // console.log('zeddy')
    // $.socket.emit('join', {'username':'test','room':'test'})
    // console.log('zeddy2')
    $.socket.on('test', function(msg) {
        console.log(msg);
    });
});


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
