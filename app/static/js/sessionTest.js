$(function(){
	$('#list-button').click(function() {
        console.log('displaying sessions...')
    	$.ajax({
    		url: '/sessionList',
    		type: 'GET',
    		success: function(response) {
                console.log('submitted.')
                console.log(response)
            }
	    })
    })
})

$(function(){
	$('#create-button').click(function() {
        console.log('creating session...')
        console.log($('#name-input').serialize())
    	$.ajax({
            url: '/sessionStart',
            data: $('#name-input').serialize(),
            type: 'POST',
            success: function(response) {
                console.log('new session added.')
                console.log(response)
            }
        })
	})
})