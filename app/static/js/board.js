$.socket = new Object()
$.playerName = new Object()

$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    sessionName = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)
    $.socket.on('add-player-response', function(msg) {
        addPlayerToList(msg['player-name'])
    })
    $.ajax({
        url: '/players/' + sessionName,
        type: 'GET',
        success: function(response){
            $.ajax({
                url: '/name',
                type: 'GET',
                success: function(response) {
                    response = JSON.parse(response)
                    $.playerName = response['name']
                    $.socket.emit('join', {'room' : sessionName, 'username' : response['name']})
                }
            })
        }
    })  
})

$(document).ready(function(){
    $('#grid').children('.card').each(
        function(i) { 
            $(this).attr('number',i)
        })
})

$(document).ready(function(){
    $.socket.on('bingo', function(msg) {
        console.log('in bingo!')
        playerName = msg['player']
        $('#player-list').children('.player-card').each(function(){
            console.log($(this).text())
            console.log(playerName)
            if($(this).text() == playerName){
                $(this).removeClass('mid-bg')
                $(this).addClass('light-bg')
                $(this).addClass('hilight-fg')
            }
        })
    });
});

$(function(){
	$('.card').click(function() {
        if($(this).hasClass('dark-bg')){
            $(this).addClass('mid-bg')
            $(this).removeClass('dark-bg')
            $(this).addClass('active')
            $.socket.emit('toggle-event', {
                'room' : sessionName, 
                'username' : $.playerName,
                'number' : $(this).attr('number'),
            })
        } else {
            $(this).addClass('dark-bg')
            $(this).removeClass('mid-bg')
            $(this).removeClass('active')
            $.socket.emit('toggle-event', {
                'room' : sessionName, 
                'username' : $.playerName,
                'number' : $(this).attr('number'),
            })
        }
	})
})

function addPlayerToList(playerName){
    newDiv = $( "<div />" ).text(playerName)
    .addClass('player-card tiny-box small-margin-vertical mid-bg')
    $('#player-list').append(newDiv)
}
