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

