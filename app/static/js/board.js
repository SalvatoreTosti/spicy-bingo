$.socket = new Object()
$.playerName = new Object()

$(document).ready(function(){
    $.socket = io.connect('https://' + document.domain + ':' + location.port + '/bingo');
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
                    
                    $.ajax({
                        url: '/bingos/' + sessionName,
                        type: 'GET',
                        success: function(response){
                            response = JSON.parse(response)
                            playersWithBingo = response['bingos']
                            for(i = 0; i < playersWithBingo.length; i++){
                                togglePlayerNameBingo(playersWithBingo[i])
                            }
                        }
                    })  
                }
            })
        }
    })  
})

$(document).ready(function(){
    $.socket.on('bingo', function(msg) {
        togglePlayerNameBingo(msg['player'])
    })
})

$(document).ready(function(){
    $.socket.on('reset-response', function(msg) {
        playerName = msg['player-name']
        $('#player-list').children('.player-card').each(function(){
            if($(this).text() == playerName){
                $(this).addClass('light-mid-bg')   
                $(this).removeClass('mid-dark-bg')
                $(this).removeClass('jiggle-in-2')
                element = $(this)
                setTimeout(
                    function(){
                    element.addClass('jiggle-in-2')
                },  20)                              
            }
        })
    })
})

$(document).ready(function(){
    $('#reset-button').click(function(){  
        if(!confirm(
            'This will reset your board and any cards you\'ve clicked. ' +  
            'Are you sure?')){
                return;
            }
        $.ajax({
            url: '/words/' + sessionName + '/'+ $.playerName,
            type: 'GET',
            success: function(response){
                response = JSON.parse(response)
                var words = response['words']
                i = 0
                $('.tile').each(function(){
                    $(this).removeClass('hilight-mid-bg')
                    $(this).removeClass('active')
                    $(this).removeClass('jiggle-in-2')
                    $(this).addClass('light-mid-bg')
                    $(this).text(words[i])
                    i += 1 
                })
                $.socket.emit(
                    'reset', 
                    {
                        'session-name' : sessionName, 
                        'player-name' : $.playerName
                    })                      
                }
            })
        })
})

$(function(){
	$('.tile').click(function() {
        if(!$(this).hasClass('active')){
            $(this).addClass('active')
            $(this).addClass('jiggle-in-2')
            $(this).removeClass('light-mid-bg')   
            $(this).addClass('hilight-mid-bg')
            $.socket.emit('toggle-event', {
                'room' : sessionName, 
                'username' : $.playerName,
                'number' : $(this).attr('number'),
            })
        } else {
            $(this).removeClass('active')
            $(this).removeClass('hilight-mid-bg')
            $(this).removeClass('jiggle-in-2')
            $(this).addClass('light-mid-bg')
                     
            $.socket.emit('toggle-event', {
                'room' : sessionName, 
                'username' : $.playerName,
                'number' : $(this).attr('number'),
            })
        }
	})
})

function addPlayerToList(playerName){
    containsName = false
    $('#player-list').children('.player-card').each(function(){
        if($(this).text() == playerName){
            containsName = true
        }
    })
    if(containsName){
        return
    }
    
    newDiv = $( '<div />' ).text(playerName)
    .addClass('player-card tiny-box light-mid-bg hilight-fg box-shadow text-shadow small-margin-vertical flex center')
    .addClass('pulse-in-3')
    $('#player-list').append(newDiv)
}

function togglePlayerNameBingo(playerName){
    $('#player-list').children('.player-card').each(function(){
        if($(this).text() == playerName){
            $(this).removeClass('light-mid-bg')   
            $(this).addClass('mid-dark-bg')
            $(this).addClass('jiggle-in-2')
        }
    })
}
