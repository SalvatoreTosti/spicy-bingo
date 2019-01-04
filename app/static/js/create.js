$(function(){
	$('#add-word-button').click(function() {
        newDiv = $( "<div />" ).text($('#word-input').val())
        .addClass('click-box small-box small-margin-vertical dark-bg hilight-fg margin-half btn')
        $('#word-container').prepend(newDiv)
        updateCreateButton()
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