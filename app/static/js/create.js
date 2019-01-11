$(function(){
	$('#add-word-button').click(function() {
        newDiv = $( "<div />" ).text($('#word-input').val())
        .addClass('click-box small-box small-margin-vertical dark-bg hilight-fg margin-half btn')
        $('#word-container').prepend(newDiv)
        updateCreateButton()
    }) 
})

$(function(){
	$('#create-button').click(function() {
        create()
    }) 
})

$(function(){
    $('#word-container').on('click', '.click-box', function (event) {
        $(this).remove()
        updateCreateButton()
    })
})

$(function(){
    $('input[type=radio][name=size]').on('change', function() {  
        updateCreateButton()  
    })
})

$(function(){
    $.ajax({
        url: '/roomName',
        type: 'GET',
        success: function(response) {
            console.log('ok')
			response = JSON.parse(response)
            $('#name').attr('placeholder',response['name'])
        }
    })
})

function updateCreateButton(){
    wordCount = $("#word-container").children().length;
    boardSize = $('#board-size-buttons input:radio:checked').parent('label').text().trim()
    if(boardSize == '3 x 3'){
        if(wordCount >= 9){
            $('#create-button').removeClass('mid-bg hilight-fg')
            $('#create-button').addClass('dark-bg hilight-fg')
            return        
        } else {
            $('#create-button').removeClass('dark-bg hilight-fg')
            $('#create-button').addClass('mid-bg')
            return
        }
    }
    
    if(boardSize == '5 x 5'){
        if(wordCount >= 25){
            $('#create-button').removeClass('mid-bg hilight-fg')
            $('#create-button').addClass('dark-bg hilight-fg')
            return
        } else {
            $('#create-button').removeClass('dark-bg hilight-fg')
            $('#create-button').addClass('mid-bg')
            return
        }
    }
}

function create(){
    data = $('form').serialize()
    boardSize = $('#board-size-buttons input:radio:checked').parent('label').text().toLowerCase().trim()
    
    translatedBoardSize=''
    if(boardSize == '3 x 3'){
        translatedBoardSize = 'three'
    } else if(boardSize == '5 x 5') {
        translatedBoardSize = 'five'
    }
    
    mode = $('#mode-buttons input:radio:checked').parent('label').text().toLowerCase().trim()    
	data = $('form').serialize()
    data = data.replace('size=on','size='+translatedBoardSize)
    data = data.replace('mode=on','mode='+mode)
    
    childText = []
    children = $("#word-container").children(".click-box")
    for(i = 0; i < children.length; i++){
        childText[i] = children[i].innerText
    }
    data += '&words=' + childText    
    $.ajax({
        url: '/create',
        data: data,
        type: 'POST',
        success: function(response) {
			response = JSON.parse(response)
            goToBoard(response['name'])
        }
    })
}