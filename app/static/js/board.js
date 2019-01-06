$.socket = new Object()

$(document).ready(function(){
    $.socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    sessionName = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)
    $.socket.on('add-player-response', function(msg) {
        addPlayerToList(msg['player-name'])
    })
    $.ajax({
        url: '/players/'+sessionName,
        type: 'GET',
        success: function(response){
            $.ajax({
                url: '/name',
                type: 'GET',
                success: function(response) {
                    response = JSON.parse(response)
                    $.socket.emit('join', {'room' : sessionName, 'username' : response['name']})
                }
            })
        }
    })  
})

$(document).ready(function(){
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
        } else {
            $(this).addClass('dark-bg')
            $(this).removeClass('mid-bg')
            $(this).removeClass('active')
        }
	})
})

function addPlayerToList(playerName){
    console.log(playerName)
    newDiv = $( "<div />" ).text(playerName)
    .addClass('tiny-box small-margin-vertical mid-bg')
    $('#player-list').append(newDiv)
}
