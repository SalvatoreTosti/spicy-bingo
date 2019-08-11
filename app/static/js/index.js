$(function(){
	$('#start-button').click(function() {
        goToCreate()
	})
})

$(function(){
	$('#join-button').click(function() {
        boardName = $('#name').val()
        if(!boardName.match('^[a-zA-Z0-9]*$') || boardName === ''){
            $('#help-text').removeClass('invisible')
            $('#help-text').text('Please enter a valid room name. (no spaces)')
            return
        }

        $.ajax({
            url: '/activeBoard/' + boardName,
            type: 'GET',
            success: function(response) {
        		response = JSON.parse(response)
                isActiveBoard = response['active']
                if (isActiveBoard == 'true'){
                    goToBoard(boardName)
                } else {
                    $('#help-text').removeClass('invisible')
                    $('#help-text').text('Room is not active.')
                }
            }
        })
	})
})
