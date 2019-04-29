$(function(){
	$('#add-word-button').click(function() {
        if($('#word-input').val().trim() === ''){
            return
        }
        
        newDiv = $( "<div />" ).text($('#word-input').val())
        .addClass('click-box small-box margin-half whitespace-nowrap light-mid-bg hilight-fg box-shadow text-shadow small-margin-vertical margin-half cursor')
        newDiv.addClass('pulse-in-3')
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
        item = $(this)
        $(this).addClass('pulse-out-75')
        setTimeout(
            function(){
                item.remove()
                updateCreateButton()
                
            },
            750
        )
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
			response = JSON.parse(response)
            $('#name').val(response['name'])
        }
    })
})

function updateCreateButton(){
    wordCount = $("#word-container").children().length;
    boardSize = $('#board-size-buttons input:radio:checked').parent('label').text().trim()
    if(boardSize == '3 x 3'){
        if(wordCount >= 9){
            $('#create-button').removeClass('light-fg')
            $('#create-button').addClass('jiggle-in-2 light-mid-bg hilight-fg box-shadow')
            return        
        } else {
            $('#create-button').removeClass('jiggle-in-2 light-mid-bg hilight-fg box-shadow')
            $('#create-button').addClass('light-fg')
            return
        }
    }
    
    if(boardSize == '5 x 5'){
        if(wordCount >= 25){
            $('#create-button').removeClass('light-fg')
            $('#create-button').addClass('jiggle-in-2 light-mid-bg hilight-fg box-shadow')
            return
        } else {
            $('#create-button').removeClass('jiggle-in-2 light-mid-bg hilight-fg box-shadow')
            $('#create-button').addClass('light-fg')
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
    
    if(children.length == 0){
        alert('No phrases entered!')
        return
    }
    
    allValid = true
    for(i = 0; i < childText.length; i++){
        if(!childText || childText[i] === ''){
            allValid = false
        }
    }
    if(!allValid){
         alert('Phrases contain an empty or blank item!')
        return
    }
    
    if(translatedBoardSize == 'three' && children.length < 9){
        if(!confirm(
            'There are fewer words provided than the size of the board. ' +  
            'This board will include duplicates. ' +
            'Is this ok?')){
                return;
            }
    }
    
    if(translatedBoardSize == 'five' && children.length < 25){
        if(!confirm(
            'There are fewer words provided than the size of the board. ' +
            'This board will include duplicates. ' +
            'Is this ok?')){
                return;
            }
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